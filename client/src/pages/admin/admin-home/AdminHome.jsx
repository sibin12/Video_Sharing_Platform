import React, { useEffect, useState } from 'react'
import MyChart from '../../../components/admin/admin-chart/MyChart'
import './home.scss';
import { adminInstance } from '../../../utils/axios';

function AdminHome() {
const [videos, setVideos] = useState(0)
const [users, setUsers] = useState(0)
const [comments, setComments] = useState(0)
 useEffect(() => {
  const fetchData = async()=>{
    const {data} = await adminInstance.get('/dashboard-details')
    const {users, videos, comments} = data

    setVideos(videos);
    setUsers(users)
    setComments(comments)
  }

 
 fetchData();
 }, [])
 

  return (
  
  <>




    <div className="dashboard">

      <div className="main-content">
        <h1>LoopNet Admin Dashboard</h1>

        <div className="widgets">
          <div className="widget">
            <h3>Overview</h3>
            <ul className="overview-items">
              <li className="overview-item">
                <i className="fa-solid fa-video"></i>
                <span>{videos} Videos</span>
              </li>
              <li className="overview-item">
                <i className="fa-solid fa-users"></i>
                <span>{users} Users</span>
              </li>
              <li className="overview-item">
                <i className="fa-solid fa-comments"></i>
                <span>{comments} Comments</span>
              </li>
            </ul>

          </div>
          
        </div>
      </div>


      <div className='chart'>

        <MyChart />
      </div>

    </div>

  </>
  )

}

export default AdminHome
