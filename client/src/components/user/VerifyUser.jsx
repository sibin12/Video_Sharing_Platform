import React from 'react'
import { useSelector } from 'react-redux'

import { Outlet, Navigate } from 'react-router-dom'

const VerifyUser = () => {
    const { user } = useSelector((state) => state.auth)
    return user ?  <Outlet /> : <Navigate to="/register" />
}

export default VerifyUser;
