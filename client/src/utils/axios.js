import axios from 'axios';
const token = localStorage.getItem('token');
const adminToken = localStorage.getItem('admintoken')

const userInstance = axios.create({
    baseURL:"http://localhost:5000/users",
})

const authInstance = axios.create({
    baseURL:"http://localhost:5000/auth",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})
const videoInstance = axios.create({
    baseURL:"http://localhost:5000/video",

})
const commentInstance = axios.create({
    baseURL:"http://localhost:5000/comments",

})

const chatInstance = axios.create({
    baseURL:"http://localhost:5000/chat",
})

const messageInstance = axios.create({
    baseURL:"http://localhost:5000/message",
})

const adminAuthInstance = axios.create({
    baseURL:"http://localhost:5000/admin",
   
    headers: {
        Accept:"application/json"
    }
})
const adminInstance = axios.create({
    baseURL:"http://localhost:5000/admin",

})


// Request interceptor for userInstance, videoInstance, and commentInstance
const setAuthorizationHeader = (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };
  
  userInstance.interceptors.request.use(setAuthorizationHeader);
  videoInstance.interceptors.request.use(setAuthorizationHeader);
  commentInstance.interceptors.request.use(setAuthorizationHeader);
  chatInstance.interceptors.request.use(setAuthorizationHeader);
  messageInstance.interceptors.request.use(setAuthorizationHeader);
  



  
  const setAdminAuthorizationHeader = (config) => {
    const adminToken = localStorage.getItem('admintoken');
    if (token) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  };

  adminInstance.interceptors.request.use(setAdminAuthorizationHeader);


export {userInstance , authInstance , videoInstance , commentInstance, chatInstance, messageInstance, adminAuthInstance, adminInstance};