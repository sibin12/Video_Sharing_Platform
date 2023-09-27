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
        toggle:(state)=>{
            return {
                ...state,
                toggle: !state.toggle
            };
        }  ,
        subscription: (state, action) => {
            if (state.user) {
              if (!state.user.subscribedUsers) {
                state.user.subscribedUsers = [];
              }
              const isSubscribed = state.user.subscribedUsers.includes(action.payload);
          
              if (isSubscribed) {
                state.user.subscribedUsers = state.user.subscribedUsers.filter(
                  (userId) => userId !== action.payload
                );
              } else {
                state.user.subscribedUsers.push(action.payload);
              }
            }
          },
          
          
        // subscription: (state, action) => {
        //     console.log(state.user,"userdetail redux");
        //     console.log(action.payload,"kolladda");
        //     if (state.user?.subscribedUsers?.includes(action.payload)) {
        //       state.user?.subscribedUsers.splice(
        //         state.user?.subscribedUsers.findIndex(
        //           (userId) => userId === action.payload
        //         ),
        //         1
        //       );
        //     } else {
        //       state.user?.subscribedUsers?.push(action.payload);
        //     //   console.log(user?.subscribedUsers,"😍😍😍😍");
        //     }
        //   },
    }
})

export const {login, register, updateUser, logout , toggle ,subscription} = authSlice.actions

export default authSlice.reducer
