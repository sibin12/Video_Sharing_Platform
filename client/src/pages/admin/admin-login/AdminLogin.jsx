import React ,{useState} from 'react'
import styled from "styled-components";
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { adminAuthInstance } from '../../../utils/axios';
import { adminLogin } from '../../../redux/adminAuthSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  margin-left:35vw;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
  overflow-x:hidden;
  
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: skyblue;
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color:lightblue;
  color: ${({ theme }) => theme.textSoft};
`;



const Error =styled.p`
color:red;
font-size:11px;
margin-top:4px;
`;

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [emailErr, setEmailErr] = useState("");
   

    const dispatch = useDispatch()
    const navigate = useNavigate() 
    

    const handleLogin = async (e) => {
        e.preventDefault();
     console.log("admin login");

        let hasError = false

        if (!email ) {
          setEmailErr("Please enter a valid email address");
          hasError = true;
        }
      
        if (!password ) {
          setPasswordErr(
            "Please enter your password"
          );
          hasError = true;
        }
        if (hasError) {
          return;
        }

      
        try {
          console.log("admin try blok");
          adminAuthInstance.post('/login',{email, password})
          .then((res)=>{
           console.log(res.data , " response of login ");
            const token = res.data.token;
            localStorage.setItem('admintoken', token);
           dispatch( adminLogin(res.data))
           navigate('/admin')
          })
          .catch((err)=>{
            console.log("login err of admin",err.message);
            toast.error(err.message || 'An error occurred.');

          })
         
        
        } catch (error) {
          console.log(error.message);
        }
    }
  



  return (
    
    <Container>
    <Wrapper>
      <Title>Sign in</Title>
      <SubTitle>to continue to LoopNet Admin Page</SubTitle>
      <Input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)} />
                  {emailErr && <Error >{emailErr}</Error>}

      <Input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}/>
                  {passwordErr && <Error >{passwordErr}</Error>}

      <Button onClick={handleLogin}>Sign in</Button>
                  {/* {loginErr  && <Error> {loginErr}</Error>} */}

    </Wrapper>
    
  </Container>
  )
}

export default AdminLogin
