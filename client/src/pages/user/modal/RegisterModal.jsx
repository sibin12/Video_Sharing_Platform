import React from 'react';
import styled from 'styled-components';
// import Register from '../../register/Register';
import Register from '../register/register';
import CloseIcon from '@mui/icons-material/Close';

const ModalOverlay = styled.div`
position: fixed;
padding:15px;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5); 
display: flex;
align-items: center;
justify-content: center;
opacity: ${props => (props.isOpen ? 1 : 0)};
transition: opacity 0.3s ease-in-out;
`;

const ModalContainer = styled.div`
background-color: white;
padding: 20px;
border-radius: 5px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
opacity: ${props => (props.isOpen ? 1 : 0)};
transition: opacity 0.3s ease-in-out;
`;

const Span = styled.div`
cursor:pointer;
top:0;
`;

const RegisterModal = ({isOpen, onClose }) => {
    if (!isOpen) {
        return null; // Return null if the modal is not open
      }
      
  return ( 
    
    <ModalOverlay isOpen={isOpen}>
    <ModalContainer isOpen={isOpen}>
        <Span>
      <CloseIcon onClick={onClose}>Close</CloseIcon>
        </Span>
      <Register /> {/* Render your registration form component */}
    </ModalContainer>
  </ModalOverlay>
  );
};

export default RegisterModal;
