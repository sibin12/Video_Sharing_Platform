import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from '@emotion/styled'
import AdminHome from './pages/admin/admin-home/AdminHome';
import AdminLogin from './pages/admin/admin-login/AdminLogin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerifyAdmin from './components/admin/VerifyAdmin';
import UserDetails from './pages/admin/user-details/userDetails';
import AdminNavbar from './components/admin/admin-navbar/AdminNavbar';
import { useSelector } from 'react-redux';
import VideoDetails from './pages/admin/video-details/VideoDetails';


const Container = styled.div`
display: flex;
`;

const Wrapper = styled.div`

padding:22px 10px;

`


function Admin() {
 const {admin} = useSelector((state)=> state.adminAuth)
  return (
<>
      <BrowserRouter>
      {admin  && <AdminNavbar /> }
       
    <Container>
       <Wrapper>

        <Routes>
          <Route path='/admin' element={<VerifyAdmin />}>
            <Route index element={<AdminHome />} />
            <Route path='/admin/users' element={<UserDetails />} />
            <Route path='/admin/videos' element={<VideoDetails />} />
          </Route>

        {!admin &&  <Route path='/admin/login' element={<AdminLogin />} />}
          
        </Routes>
       </Wrapper>
      <ToastContainer />
    </Container>
      </BrowserRouter>
</>
  )
}

export default Admin
