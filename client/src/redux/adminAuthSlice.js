import {createSlice} from '@reduxjs/toolkit'

const initialState ={
    admin :null,
    adminToken: null,
}

export const adminAuthSlice = createSlice({
    name : 'adminAuth',
    initialState,
    reducers:{
        adminLogin: (state,action) =>{
            state.admin = action.payload.others
            state.adminToken = action.payload.token
        },
       
        adminLogout: (state) =>{
            state.admin = null
            state.adminToken = null
            // localStorage.clear()
            localStorage.setItem("admintoken" , null)
        },
     
    }
})

export const {adminLogin,adminLogout } = adminAuthSlice.actions

export default adminAuthSlice.reducer
