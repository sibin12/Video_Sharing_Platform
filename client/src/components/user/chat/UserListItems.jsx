import React from 'react';
import styled from 'styled-components';


const Container = styled.div`
background-color:whitesmoke;
border-radius:5px;
padding:10px;
`

const ListItem = styled.div`
  cursor: pointer;
  background: #E8E8E8;
  &:hover {
    background: #38B2AC;
    color: white;
  }
//   width: 100%;
  display: flex;
  align-items: center;
  color: black;
  padding: 8px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
`;

const AvatarImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
  cursor: pointer;
`;

const InfoContainer = styled.div`
  flex: 1;
`;

const UserName = styled.p`
  margin: 0;
`;

const Email = styled.p`
  font-size: 12px;
  margin: 0;
`;

const UserListItem = ({ handleFunction, user }) => {
  return (
    <Container>

    <ListItem onClick={handleFunction}>
      <AvatarImage
        src={`http://localhost:5000/images/profile/${user?.image}`}
        alt={user?.username}
        />
      <InfoContainer>
        <UserName>{user?.username}</UserName>
        <Email>
          <b>Email:</b> {user?.email}
        </Email>
      </InfoContainer>
    </ListItem>
        </Container>
  );
};

export default UserListItem;
