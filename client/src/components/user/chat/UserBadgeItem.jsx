import React from 'react';
import styled from 'styled-components';
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";

// Styled components
const StyledBadge = styled(Badge)`
  padding: 1px 8px;
  border-radius: 16px;
  margin: 4px;
  margin-bottom: 8px;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #ffffff;
  background-color: #6B46C1;
  cursor: pointer;
`;

const AdminBadge = styled.span`
  font-size: 12px;
  margin-left: 4px;
`;

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <StyledBadge onClick={handleFunction}>
      {user?.username}
      {admin === user._id && <AdminBadge> (Admin)</AdminBadge>}
      <CloseIcon pl={1} />
    </StyledBadge>
  );
};

export default UserBadgeItem;
