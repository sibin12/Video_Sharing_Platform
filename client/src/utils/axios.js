import axios from 'axios';
const token = localStorage.getItem('token');
const adminToken = localStorage.getItem('admintoken')
const URL='http://localhost:5000/api/'

const userInstance = axios.create({
    baseURL:`${URL}users`,
})

const authInstance = axios.create({
    baseURL:`${URL}auth`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})
const videoInstance = axios.create({
    baseURL:`${URL}video`,

})
const commentInstance = axios.create({
    baseURL:`${URL}comments`,

})

const chatInstance = axios.create({
    baseURL:`${URL}chat`,
})

const messageInstance = axios.create({
    baseURL:`${URL}message`,
})

const adminAuthInstance = axios.create({
    baseURL:`${URL}admin`,
   
    headers: {
        Accept:"application/json"
    }
})
const adminInstance = axios.create({
    baseURL:`${URL}admin`,

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