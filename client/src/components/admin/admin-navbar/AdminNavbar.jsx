import React from 'react'
import './adminnavbar.scss'
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogout } from '../../../redux/adminAuthSlice';
import { Link, useNavigate } from 'react-router-dom';

function AdminNavbar() {
const dispatch = useDispatch()
const navigate = useNavigate()
const {admin} = useSelector((state)=>state.adminAuth)

const handleLogout =()=>{
  dispatch(adminLogout())
  navigate('/admin')
}
  return (
    <div className='container'>
        <div className='navbar'>
        <Link to={'/admin'}>
        <span className='navbar-component'><HomeIcon /></span>
        </Link>

        <Link to={"/admin/users"} >
        <span className='navbar-component' >Users</span>
        </Link>

        <Link to={"/admin/videos"}>
        <span className='navbar-component'>Videos</span>
        </Link>
        {/* <span className='navbar-component'>Shorts</span> */}
        <span className='navbar-component'><AccountCircleIcon /><h4 onClick={handleLogout}>Logout</h4></span>

        </div>
    </div>
  )
}

export default AdminNavbar
