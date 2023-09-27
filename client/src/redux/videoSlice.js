import {createSlice} from '@reduxjs/toolkit'

const initialState ={
    video:null,
    block:false,
}

export const videoSlice = createSlice({
    name : 'video',
    initialState,
    reducers:{
        fetchSuccess:(state,action)=>{
            state.currentVideo = action.payload
        },
        like: (state, action) => {
            if (!state.currentVideo.likes.includes(action.payload)) {
              state.currentVideo.likes.push(action.payload);
              state.currentVideo.dislikes.splice(
                state.currentVideo.dislikes.findIndex(
                  (userId) => userId === action.payload
                ),
                1
              );
            }
          },
          dislike: (state, action) => {
            if (!state.currentVideo.dislikes.includes(action.payload)) {
              state.currentVideo.dislikes.push(action.payload);
              state.currentVideo.likes.splice(
                state.currentVideo.likes.findIndex(
                  (userId) => userId === action.payload
                ),
                1
              );
            }
          },
          block:(state)=>{
            return {
                ...state,
                block: !state.block
            };
        }  ,
        },
      });

export const {fetchSuccess, like, dislike, block} = videoSlice.actions

export default videoSlice.reducer
