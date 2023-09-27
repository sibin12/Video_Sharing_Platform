// import React from 'react';
// import styled from 'styled-components';

// const NotFoundContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   height: 100vh;
//   background-color: #f0f0f0; /* Background color for the 404 page */
// `;

// const NotFoundText = styled.h1`
//   font-size: 36px;
//   font-weight: bold;
//   margin-bottom: 20px;
// `;

// const NotFoundMessage = styled.p`
//   font-size: 18px;
//   text-align: center;
//   margin-bottom: 30px;
// `;

// const HomeButton = styled.a`
//   text-decoration: none;
//   background-color: #007bff; /* Button background color */
//   color: #fff; /* Button text color */
//   font-size: 18px;
//   padding: 10px 20px;
//   border-radius: 5px;
//   transition: background-color 0.3s ease;

//   &:hover {
//     background-color: #0056b3; /* Button background color on hover */
//   }
// `;

// function NotFoundPage() {
//   return (
//     <NotFoundContainer>
//       <NotFoundText>404</NotFoundText>
//       <NotFoundMessage>Page not found</NotFoundMessage>
//       <HomeButton href="/">Go to Home</HomeButton>
//     </NotFoundContainer>
//   );
// }

// export default NotFoundPage;

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Import your custom background image or provide the image URL
// import backgroundImage from './your-background-image.jpg';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url("https://htmlburger.com/blog/wp-content/uploads/2022/06/404-Page-Examples-Myriad-Video-Agency-Old-TV-Style-Static-Animation-Error-Page-Design.gif") no-repeat center center fixed;
  background-size: cover;
`;

const NotFoundText = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #fff; /* Text color on the background image */
`;

const NotFoundMessage = styled.p`
  font-size: 18px;
  text-align: center;
  margin-bottom: 30px;
  color: #fff; /* Text color on the background image */
`;

const HomeButton = styled.a`
  text-decoration: none;
  background-color: #007bff;
  color: #fff;
  font-size: 18px;
  padding: 10px 20px;
  margin-top: 200px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

function NotFoundPage() {
  return (
    <NotFoundContainer>
      {/* <NotFoundText>404</NotFoundText>
      <NotFoundMessage>Page not found</NotFoundMessage> */}
      <Link to="/" style={{textDecoration:"none"}}>
      <HomeButton >Go to Home</HomeButton>
      </Link>
    </NotFoundContainer>
  );
}

export default NotFoundPage;

