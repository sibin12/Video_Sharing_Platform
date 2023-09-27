// import React, { useEffect, useState } from 'react';
// import './UserDetails.scss';
// import { adminInstance } from '../../../utils/axios';
// import { toast } from 'react-toastify';
// import DataTable from 'react-data-table-component';

// const UserDetails = () => {
//   const [users, setUsers] = useState([]);


//   const columns = [
//     {
//         name: 'Username',
//         selector: row => row.username,
//     },
//     {
//         name: 'Subscribers',
//         selector: row => row.Subscribers,
//     },
// ];


//   useEffect(() => {
//     // Fetch user data from the server
//     adminInstance.get('/users')
//       .then((res) => {
//         setUsers(res.data);
//       })
//       .catch((error) => {
//         console.log(error.message);
//       });



//   }, []);

//   const handleBlockUser = async (userId) => {

//     const userBlock = users.find((user) => user?._id === userId);
//     const isBlocked = userBlock?.isBlocked;

//     if (isBlocked) {
//       await adminInstance.put(`/users/${userId}/blockUser`);
//     } else {
//       await adminInstance.put(`/users/${userId}/unblockUser`)
//     }

//     setUsers((prevDetails) =>
//       prevDetails.map((user) =>
//         user._id === userId ? { ...user, isBlocked: !isBlocked } : user
//       )
//     )


//   };



//   return (
//     <div className='user-container'>
//       <table className="user-table">
//       <thead>
//           <tr>
//             <th>userId</th>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Subscribers</th>
//             <th>Actions</th>
          
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user?._id}>
//               <td>{user?._id}</td>
//               <td>{user?.username}</td>
//               <td>{user?.email}</td>
//               <td>{user?.subscribers}</td>
//               <td>

//                 <button onClick={() => handleBlockUser(user?._id)} style={{ background: user?.isBlocked ? "blue" : "red" }}>
//                   {user?.isBlocked ? 'Unblock' : 'Block'}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default UserDetails;

import React, { useEffect, useState } from 'react';
import { adminInstance } from '../../../utils/axios';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component'; // Import DataTable component
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
      sortable: true, // Enable sorting for this column
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true, // Enable sorting for this column
    },
    {
      name: 'Subscribers',
      selector: (row) => row.subscribers,
      sortable: true, // Enable sorting for this column
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
    // Fetch user data from the server
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
        title="User Details" // Set the table title
        columns={columns}
        data={users}
        pagination // Enable pagination
        paginationPerPage={7} // Number of rows per page
        paginationRowsPerPageOptions={[7, 14, 25, 40, 50]} // Rows per page options
        paginationTotalRows={users.length} // Total number of rows
      />
    </div>
  );
};

export default UserDetails;
