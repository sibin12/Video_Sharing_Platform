import axios from 'axios';
const token = localStorage.getItem('token');
const adminToken = localStorage.getItem('admintoken')

const userInstance = axios.create({
    baseURL:"http://localhost:5000/api/users",
})

const authInstance = axios.create({
    baseURL:"http://localhost:5000/api/auth",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})
const videoInstance = axios.create({
    baseURL:"http://localhost:5000/api/video",

})
const commentInstance = axios.create({
    baseURL:"http://localhost:5000/api/comments",

})

const chatInstance = axios.create({
    baseURL:"http://localhost:5000/api/chat",
})

const messageInstance = axios.create({
    baseURL:"http://localhost:5000/api/message",
})

const adminAuthInstance = axios.create({
    baseURL:"http://localhost:5000/api/admin",
   
    headers: {
        Accept:"application/json"
    }
})
const adminInstance = axios.create({
    baseURL:"http://localhost:5000/api/admin",

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