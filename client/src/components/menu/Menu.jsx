import React ,{useState} from 'react'
import styled from 'styled-components'
import loopnet from '../../assets/loop.png'
import HomeIcon from '@mui/icons-material/Home';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import LogoutIcon from '@mui/icons-material/Logout';
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import Upload from '../user/upload/Upload';


const Container = styled.div`
// flex:1;
// background-color:${({theme}) =>theme.bg};
background-color:whitesmoke;
color:${({theme}) => theme.text};
height:100vh;
position:fixed;
top:56px;
z-index:2;
`

const Wrapper = styled.div`

padding: 18px 26px;
`

const Logo = styled.div`
display: flex;
align-items:center;
gap: 5px;
margin-bottom:15px;
font-weight:bold;
font-size:35px
`

const Img = styled.img`
height:30px;
`

const Item = styled.div`
display: flex;
align-items:center;
cursor:pointer;
padding: 7.5px 0px;
gap:10px;

&:hover {
    padding-left:5px;
    border-radius:7px;
    background-color: ${({theme})=> theme.soft}
}
`

const Hr = styled.div`
width:130px;
margin: 15px 0px;
// border:0.5px solid ${({theme}) =>theme.soft};
border:0.5px solid transparent;
 `;

 const ToggleButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 7.5px 0px;
  gap: 10px;
  justify-content: flex-end; /* Align the button to the right */

  &:hover {
    padding-right: 5px;
    border-radius: 7px;
    background-color: ${({ theme }) => theme.soft};
  }
`;

function Menu( {darkMode , setDarkMode} ) {
    const [open, setOpen] = useState(false)
    const {user} =useSelector((state)=> state.auth)
    const toggle =useSelector((state)=> state.auth.toggle)

    const navigate = useNavigate()

 console.log(toggle,"toggeleeee");
      const dispatch = useDispatch()
    const handleLogout = ()=>{
        console.log("logout called");
        dispatch(logout())
        navigate('/')
    }
    
   

    return (
        <>
        <Container >
            <Wrapper style={{padding: toggle ? '18px 10px' : '0px 0px'}} >
                

             {toggle && (
                <>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Item>
                <HomeIcon /> Home
                </Item>
                </Link>
                    <Hr />
                    <Link to="/subscriptions" style={{textDecoration: 'none', color:'inherit'}} >
                <Item>
                <SubscriptionsIcon />Subscription
                </Item>
                    </Link>
                    <Hr />
                    <Link to="/trends" style={{textDecoration: 'none', color:'inherit'}} >
                <Item>
                <SubscriptionsIcon />Trending
                </Item>
                    </Link>
                    <Hr />
                <Item  onClick={()=> setOpen(true)} >
                <CloudUploadIcon /> Upload
                </Item>
                    <Hr />
                    <Link to="/chat" style={{textDecoration: 'none', color:'inherit'}} >
                <Item  >
                <ChatIcon /> Chat
                </Item>
                    </Link>
                    <Hr />
                <Item>    
                    <SettingsIcon /> Setting
                </Item>
                    <Hr />
                <Item onClick={(e)=> setDarkMode(!darkMode)}>    
                    <SettingsBrightnessIcon />{darkMode ? "Light": "Dark"} Mode
                </Item>
                   <Hr />
               {user ? (<Item  onClick ={handleLogout}>
                    <LogoutIcon  /> Logout
                </Item> ): <div />} 
                </>
                )}  
            </Wrapper>
          
        </Container>
        {open && <Upload setOpen={setOpen} /> }
        </>
    )
}

export default Menu
