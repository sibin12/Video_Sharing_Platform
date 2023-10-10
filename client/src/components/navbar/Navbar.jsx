import React, { useState } from 'react'
import styled from '@emotion/styled'
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import loopnet from '../../assets/loop.png'
import { logout, togglee } from '../../redux/authSlice'
import './Navbar.scss'
import { Link, useNavigate } from 'react-router-dom';
import RegisterModal from '../../pages/user/modal/RegisterModal';
import { useSelector, useDispatch } from 'react-redux';
// import Dropdown from 'react-dropdown'
import { createGlobalStyle } from 'styled-components';

// import '../../style.css'

const Container = styled.div`
position: fixed;
width:100%;
top: 0;
// background-color:${({theme}) =>theme.text};
background-color:whitesmoke;
height: 56px;
 
// animation: colorChange 7s infinite;


@media (max-width: 426px) {
  height:110px;
}
`;

const Wrapper = styled.div`
display: flex;
align-items: center;
justify-content: space-between; /* Adjust the alignment as needed */
height: 100%;
padding: 0px 20px;
position: relative;
flex-wrap: wrap; /* Allow content to wrap to the next line on smaller screens */
   
// @media (min-width: 768px) {
//   flex-direction: column; /* Change flex direction on screens >= 768px */
// }
`;

const Logo = styled.div`
// position:absolute;
font-weight:bold;
font-size:30px;
margin-right:auto;
display:flex;
align-items: center;
margin-top:10px;
cursor:pointer;
color:${({theme})=> theme.text};
`;

const Search = styled.div`
width: 35%; /* Take up full width on small screens */
  max-width: 300px; /* Limit width on larger screens */
  // position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
  margin-top: 10px; /* Add spacing between Logo and Search on small screens */
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  width: 80%; /* Take up most of the available width */

`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left:auto;
  gap: 5px;
  margin-top: 10px; /* Add spacing between Search and Button on small screens */
 
`;


const Img = styled.img`
height:25px;
padding-left:2px;
`;


// Global styles to remove default list styles
const GlobalStyles = createGlobalStyle`
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
`;

const CustomDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  // overflow-x: visible;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 1;
  overflow-x: visible !important;


  `;


const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;


function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to control the dropdown visibility
  console.log(user,'❤️❤️');
  const [q, setQ] = useState("")
  console.log(user, "user");
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("modal closing");
    setIsModalOpen(false);
  };
  const toggleMenu = () => {
    console.log("hi");
    dispatch(togglee())

  };


  const toggleDropdown = () => {
    // Toggle the dropdown visibility
    setDropdownOpen(!isDropdownOpen);
  };

  // Sample options for the dropdown
  const options = [
    { label: 'Profile', value: 'profile' },
    { label: 'Setting', value: 'setting' },
    { label: 'Logout', value: 'logout' },
  ];


  const handleOptionClick = (optionValue) => {
    if (optionValue === 'profile') {
      setDropdownOpen(!isDropdownOpen);

      navigate('/profile');
    } else if (optionValue === 'setting') {
      setDropdownOpen(!isDropdownOpen);

      // navigate('/settings');
    } else if (optionValue === 'logout') {
      setDropdownOpen(!isDropdownOpen);
      dispatch(logout())
      navigate('/')
    }
  };


  return (
    <Container>
      <Wrapper>
        <Logo >
          <DehazeOutlinedIcon onClick={toggleMenu} />
          <Link to={'/'} style={{ textDecoration: "none", color: "inherit" }} >
            <Img src={loopnet} />LoopNet
          </Link>
        </Logo>

        <Search>
          <Input type='text' placeholder='SEARCH' onChange={(e) => setQ(e.target.value)} />
          <SearchIcon onClick={() => navigate(`/search?q=${q}`)} />
        </Search>

        <Button onClick={!user && openModal}>
          <AccountCircleIcon />
          {user ? user.username : "SIGN IN"}
          {user && <ArrowDropDownIcon onClick={toggleDropdown} />}

          {/* Conditionally render the Dropdown component */}
          <GlobalStyles />
          {isDropdownOpen && (
            <CustomDropdown isOpen={isDropdownOpen}>
              <ul>
                {options.map((option, index) => (
                  <li key={index} >
                    <DropdownItem onClick={() => handleOptionClick(option.value)}>
                      {option.label}
                    </DropdownItem>
                  </li>
                ))}
              </ul>
            </CustomDropdown>
          )}
        </Button>
        <RegisterModal isOpen={isModalOpen && !user} onClose={closeModal} />
      </Wrapper>
    </Container>
  )
}

export default Navbar
