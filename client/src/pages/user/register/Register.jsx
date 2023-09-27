import React ,{useState} from 'react'
import './Register.scss';
import styled from "styled-components";
// import './Register.scss'
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { login , register} from '../../../redux/authSlice'
import { auth, provider} from '../../../firebase/config'
import { signInWithPopup} from 'firebase/auth'
import { authInstance } from '../../../utils/axios';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
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

function Register() {
    const [username, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailErrorL, setEmailErrorL] = useState("");
    const [passwordErrorL, setPasswordErrorL] = useState("");
    const [loginErr, setLoginErr] = useState("")
    const [registerErr, setRegisterErr] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate() 
    
    const usernamePattern = /^\S+$/;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    
    const handleLogin = async (e) => {
        e.preventDefault();
         setLoginErr("")
        setEmailErrorL("");
        setPasswordErrorL("");

        let hasError = false

        if (!email || !emailPattern.test(email)) {
          setEmailErrorL("Please enter a valid email address");
          hasError = true;
        }
      
        if (!password ) {
          setPasswordErrorL(
            "Please enter your password"
          );
          hasError = true;
        }
        if (hasError) {
          return;
        }

      
        try {
          authInstance.post('/login',{email, password})
          .then((res)=>{
            // localStorage.setItem("IS AUTH",true)
           console.log(res.data , " response of login ");
           // When you receive the token in the response
            const token = res.data.token;
            localStorage.setItem('token', token);
            // localStorage.setItem('userInfo', res.data);
            localStorage.setItem("userInfo", JSON.stringify(res.data));

           dispatch(login(res.data))

           navigate('/')
          })
          .catch((err)=>{
            if (err.response) {
              // setRegisterErr('User not found! Please check your email.');
              setRegisterErr(err.response.data.message);
            } else {
              setRegisterErr('An error occurred while logging in. Please try again later.');
            }
           console.log(err,"error of login");
          })
          // const res = await fetch(`http://localhost:5000/auth/login` , {
          //   headers: {
          //     "Content-Type": "application/json"
          //   },
          //   method: "POST",
          //   body : JSON.stringify({email , password})
          // })
          // const data = await res.json()
          // // alert(data)
          // console.log(data, "login data");
          // setLoginErr(data)
          // dispatch(login(data))
          // navigate('/')
        } catch (error) {
          console.log(error.message);
        }
    }
    const handleRegister = async (e) => {
      e.preventDefault();
       
  // Clear previous error messages
  setRegisterErr("")
  setUsernameError("");
  setEmailError("");
  setPasswordError("");

  // Perform validation for Register a new user
  let hasError = false;
  if (!username) {
    setUsernameError("Username is required");
    hasError = true;
  } else if (!usernamePattern.test(username)) {
    setUsernameError("Username cannot contain white spaces");
    hasError = true;
  }

  if (!email || !emailPattern.test(email)) {
    setEmailError("Please enter a valid email address");
    hasError = true;
  }

  if (!password || !passwordPattern.test(password)) {
    setPasswordError(
      "Password must have at least 6 characters, one uppercase letter, and one digit"
    );
    hasError = true;
  }
  if (hasError) {
    return;
  }


      try {
             authInstance.post('/register',{username, email, password})
             .then((res)=>{
              console.log(res.data , " response of register ");
              const token = res.data.token;
            localStorage.setItem('token', token);
            // localStorage.setItem('userInfo', res.data);
            localStorage.setItem("userInfo", JSON.stringify(res.data));

              dispatch(register(res.data))
              navigate('/')
             })
             .catch((err)=>{
              if (err.response && err.response.status === 404) {
                setRegisterErr('username is already taken🫤');
              } else  {
                setRegisterErr('this email is already taken!');
              }
             })
        // const res = await fetch(`http://localhost:5000/auth/register`, {
        //   headers: {
        //     "Content-Type": "application/json"
        //   },
        //   method: "POST",
        //   body: JSON.stringify({username, email, password})
        // })
        // const data = await res.json()
        // alert(data);

        
      } catch (error) {

        console.log(error.message)
      }
    }
 
    const sigInWithGoogle = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        console.log(result, "result from google");
    
        const res = await fetch(`http://localhost:5000/auth/google`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            username: result.user.displayName,
            email: result.user.email,
            image: result.user.photoURL,
          }),
        });
           const data = await res.json()

           console.log(data, "register data");
          //  setRegisterErr(data)
           dispatch(register(data))
           navigate('/')
       
      } catch (error) {
        console.log(error.message);
        
      }
    };
    



  return (
    
    <Container>
    <Wrapper>
      <Title>Sign in</Title>
      <SubTitle>to continue to LoopNet</SubTitle>
      <Input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)} />
                  {emailErrorL && <Error >{emailErrorL}</Error>}

      <Input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}/>
                  {passwordErrorL && <Error >{passwordErrorL}</Error>}

      <Button onClick={handleLogin}>Sign in</Button>
                  {loginErr  && <Error> {loginErr}</Error>}

      <p>or</p>
       <Button onClick={sigInWithGoogle}>Signin with Google</Button>
      <p>or</p>
      <Input
        placeholder="username"
        onChange={(e) => setName(e.target.value)}/>
                   {usernameError && <Error >{usernameError}</Error>}

      <Input
       placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                   {emailError && <Error >{emailError}</Error>}

      <Input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}/>
                  {passwordError && <Error >{passwordError}</Error>}

      <Button onClick={handleRegister}>Sign up</Button>
                  {registerErr && <Error>{registerErr}</Error>}
    </Wrapper>
    
  </Container>
  )
}

export default Register
