

import React, { useEffect, useState } from 'react';
import { adminInstance } from '../../../utils/axios';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component'; 
import './UserDetails.scss'


const UserDetails = () => {
  const [users, setUsers] = useState([]);

  const columns = [
    {
      name: 'userId',
      selector: (row) => row._id,
      sortable: true, // Enable sorting for this column
    },
    {
      name: 'Username',
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true, 
    },
    {
      name: 'Subscribers',
      selector: (row) => row.subscribers,
      sortable: true, 
    },
    {
      name: 'Created At',
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true, 
    },
    {
      name: 'Actions',
      cell: (row) => (
        <button
          onClick={() => handleBlockUser(row._id)}
          style={{ background: row.isBlocked ? 'blue' : 'red' }}
        >
          {row.isBlocked ? 'Unblock' : 'Block'}
        </button>
      ),
    },
  ];

  useEffect(() => {
    
    adminInstance
      .get('/users')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  const handleBlockUser = async (userId) => {
    const userBlock = users.find((user) => user._id === userId);
    const isBlocked = userBlock?.isBlocked;

    try {
      if (isBlocked) {
        await adminInstance.put(`/users/${userId}/unblockUser`);
      } else {
        await adminInstance.put(`/users/${userId}/blockUser`);
      }

      // Update the user list after blocking/unblocking
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, isBlocked: !isBlocked } : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="user-container">
      <DataTable
        title="User Details" 
        columns={columns}
        data={users}
        pagination 
        paginationPerPage={7} 
        paginationRowsPerPageOptions={[7, 14, 25, 40, 50]} 
        paginationTotalRows={users.length} 
      />
    </div>
  );
};

export default UserDetails;
