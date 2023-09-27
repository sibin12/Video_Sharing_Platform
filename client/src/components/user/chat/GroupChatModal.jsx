import React, { useState } from 'react';
import styled from 'styled-components';
import { chatInstance, userInstance } from '../../../utils/axios';
import { ChatState } from '../../../Context/ChatProvider';
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItems';
import { toast } from 'react-toastify';

// Styled components
const ModalWrapper = styled.div`
  display:flex;
//  ${props => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  top: 200px;
  left: 10rem;
//   width: 100%;
//   height: 100%;
  // background-color: rgba(0, 0, 0, 0.5);
  
  justify-content: center;
  align-items: center;
 
  @media (max-width: 456px){
    top:350px;
    left:0
  }


`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const UserItem = styled.li`
  margin: 5px 0;
  cursor: pointer;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

// Component
const GroupChatModal = ({ isOpen, onClose }) => {

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userSearch, setUserSearch] = useState('');
  const [userList, setUserList] = useState([]);


  const { user, chats, setChats, setSelectedChat,
  } = ChatState();

  // Simulated user list, replace with your own data
  const users = ["User1", "User2", "User3", "User4"];

  const handleSearch = async (query) => {
    if(!query){
        return;
    }
    setSearch( query)

    try {
        setLoading(true)
        userInstance.get(`/chat/?search=${search}`)
        .then((res) => {
            if (res.data.length < 0) {
                setLoading(true)
            } else {
                setSearchResult(res.data)
                setLoading(false)
            }
        })
    } catch (error) {
        toast.error("No User Exist's")
        console.log(error.message);
    }

  };

  const handleAddUser = (usertoAdd) => {
    console.log(`Added ${usertoAdd} to the group!`);

    if( selectedUsers.includes(usertoAdd)){
        toast.info("User already added")
        return
    }
    setSelectedUsers([...selectedUsers, usertoAdd])
  };


  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };


  const handleCreateGroup = async() => {
    if (groupChatName.trim() === "") {
      toast.info("enter a group name")
      return;
    } else if(selectedUsers.length <2) {
      // Simulated create group logic
      toast.info("select atleast 2 user's")
      return;
    }else{
        try {
            const { data } = await chatInstance.post(
              `/group`,
              {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
              }
            );
            setChats([data, ...chats]);
            setSelectedChat(data)
            onClose();
            toast.success("New Group Chat Created!");
          } catch (error) {
            toast.error(error.message ||"Failed to Create the Group!",
              );
          }                      
        };
    
        onClose();       
        
    
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>Create Group Chat</Title>
        <Input
          type="text"
          placeholder="Enter Group Name"
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Add Users eg: John, Piyush, Jane"
          
          onChange={(e) => handleSearch(e.target.value)}
        />
        
{selectedUsers?.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
      
        <UserList>
            {loading ?(
                <span>Loading...</span>
            ): (

          searchResult &&  searchResult.slice(0,4).map((user, index) => (
            <UserListItem  key={index} user={user} handleFunction={()=>handleAddUser(user)} />
          ))
            )}
        </UserList>

        <Button onClick={handleCreateGroup}>Create Group</Button>
      </ModalContent>
    </ModalWrapper>
  );
};

export default GroupChatModal;



