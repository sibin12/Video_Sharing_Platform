import {createSlice} from '@reduxjs/toolkit'

const initialState ={
    user :null,
    token: null,
    toggle:true,
}

export const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers:{
        login: (state,action) =>{
            state.user = action.payload.others
            state.token = action.payload.token
        },
        register: (state,action) =>{
            state.user = action.payload.others
            state.token = action.payload.token
        },
        logout: (state) =>{
            state.user = null
            state.token = null
            // localStorage.clear()
            localStorage.setItem('token',null)
        },
        updateUser(state,action){
          state.user = action.payload
        },
        togglee:(state)=>{
            return {
                ...state,
                toggle: !state.toggle
            };
        }  ,
        subscription: (state, action) => {
            if (state.user) {
              if (!state.user.subscribedUser) {
                state.user.subscribedUser = [];
              }
              const isSubscribed = state.user.subscribedUser.includes(action.payload);
          
              if (isSubscribed) {
                state.user.subscribedUser = state.user.subscribedUser.filter(
                  (userId) => userId !== action.payload
                );
              } else {
                state.user.subscribedUser.push(action.payload);
              }
            }
          },
          
       
    }
})

export const {login, register, updateUser, logout , togglee ,subscription} = authSlice.actions

export default authSlice.reducer
