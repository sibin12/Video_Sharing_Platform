import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

`;

const loadingAnimation = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

const LoadingLine = styled.div`
  width: 100%;
  height: 40px;
  border-radius:5px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${loadingAnimation} 1.5s infinite;
`;

const ChatLoading = () => {
  return (
    <LoadingContainer>
      <LoadingLine />
      <LoadingLine />
      <LoadingLine />
      <LoadingLine />
      <LoadingLine />
      <LoadingLine />
      <LoadingLine />
      <LoadingLine />
      <LoadingLine />
     
    </LoadingContainer>
  );
};

export default ChatLoading;
