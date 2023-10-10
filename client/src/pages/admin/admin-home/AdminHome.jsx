import React from 'react'
import AdminNavbar from '../../../components/admin/admin-navbar/AdminNavbar'
import AdminLogin from '../admin-login/AdminLogin'
import UserDetails from '../user-details/userDetails'
import './home.scss';

function AdminHome() {





    return (

      <div className="dashboard">

    <div className="main-content">
      <h1>LoopNet Admin Dashboard</h1>

      <div className="widgets">
        <div className="widget">
          <h3>Overview</h3>
          <ul class="overview-items">
    <li className="overview-item">
      <i className="fa-solid fa-video"></i>
      <span>1000 Videos</span>
    </li>
    <li className="overview-item">
      <i class="fa-solid fa-users"></i>
      <span>1000 Users</span>
    </li>
    <li class="overview-item">
      <i class="fa-solid fa-comments"></i>
      <span>1000 Comments</span>
    </li>
  </ul>

        </div>
        <div className="widget">
          <h3>Latest Posts</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>This is my first post!</td>
                <td>John Doe</td>
                <td>2023-10-10</td>
              </tr>
              <tr>
                <td>This is my second post!</td>
                <td>Jane Doe</td>
                <td>2023-10-11</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

    )

}

export default AdminHome
