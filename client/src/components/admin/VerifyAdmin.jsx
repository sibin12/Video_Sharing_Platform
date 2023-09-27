import React from 'react'
import { useSelector } from 'react-redux'

import { Outlet, Navigate } from 'react-router-dom'

const VerifyAdmin = () => {
    const { admin } = useSelector((state) => state.adminAuth)
    return admin ?  <Outlet /> : <Navigate to="/admin/login" />
}

export default VerifyAdmin
