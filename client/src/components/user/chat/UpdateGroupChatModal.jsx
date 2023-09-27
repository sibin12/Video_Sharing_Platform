
import React, { useState } from 'react';
import styled from 'styled-components';
import { chatInstance, userInstance } from '../../../utils/axios';
import { ChatState } from '../../../Context/ChatProvider';
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItems';
import { toast } from 'react-toastify';
import LoadingSpinner from './Spinner';
import { useSelector } from 'react-redux';

// Styled components
const ModalWrapper = styled.div`
  display:flex;
//  ${props => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  top: 200px;
  left: 6rem;
  right:6rem;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.5);
  
  justify-content: center;
  align-items: center;

  @media (max-width: 456px){
    top:350px;
    left:0;
    right:0;
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
  right: 19rem;
  font-size: 24px;
  cursor: pointer;

`;

const Title = styled.h2`
  margin-bottom: 10px;
`;


const Input = styled.input`
  width: 80%;
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
const UpdateGroupChatModal = ({ isOpen, onClose, fetchMessages, fetchAgain, setFetchAgain } ) => {

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const {user}= useSelector((state)=>state.auth)

  const { selectedChat, setSelectedChat,  chats, setChats } = ChatState();


  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    setSearch(query)

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

  const handleAddUser = async (user1) => {
     if(selectedChat.users.find((u)=>u._id === user1._id)){
      toast.info("User Already in group");
      return;
     }
console.log(user?._id,"❤️❤️❤️");
     if(selectedChat.groupAdmin._id !== user?._id){
      toast.error("Only Admins can add Users");
      return;
     }

     try {

       const {data}= await chatInstance.put(`/groupadd`,{
        chatId: selectedChat._id,
      userId:user1._id
    })
      
       setSelectedChat(data)
       setFetchAgain(!fetchAgain)
       setLoading(false)


     } catch (error) {
      console.log(error.message);
     }
   
  }; 


 

  const handleRemove = async (user1)=>{
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
      toast.error("Only admin can remove someone")
      return 
    }
    try {
        if(user1._id == user._id && user1._id == selectedChat.groupAdmin._id){
          toast.info("You can't remove you😄") 
          return;
        }
      const {data} = await chatInstance.put(`/groupremove`,{
        chatId: selectedChat._id,
      userId:user1._id
      })

    if(data){
      setSelectedChat(data)
    }
    onClose()

    } catch (error) {
      console.log(error.message);
    }
  }

  const handleRename = async ()=>{
    if (groupChatName.trim() === "") {
      toast.info("enter a group name")
      return;
  }
  try {
    setRenameLoading(true)
    const {data} = await chatInstance.put(`/rename`,
    {
      chatId: selectedChat._id,
    chatName:groupChatName
  })


  setChats(prev => {
    return prev.map((obj, indx) => {
      if(obj._id === data._id){
        return data
      }
      return obj
    })
  })

  setSelectedChat(data)

  console.log(data,"🤣🤣");
  setFetchAgain(!fetchAgain);
  setRenameLoading(false)

  } catch (error) {
    console.log(error.message);
    setRenameLoading(false)
  }

  setGroupChatName('')
  }

  

  return (
    <ModalWrapper isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>{selectedChat?.chatName}</Title>

        {selectedChat?.users?.map((u) => (
          <UserBadgeItem
            key={u._id}
            user={u}
            admin={selectedChat.groupAdmin}
            handleFunction={() => handleRemove(u)}
          />
        ))}

        <Input
          type="text"
          placeholder="Rename Group Name"
          value={groupChatName} 
          onChange={(e) => setGroupChatName(e.target.value)}
          />  
          {renameLoading ? (<LoadingSpinner />):
           (<Button
            isLoading ={renameLoading}
            onClick={handleRename}
           > 
              Update
              </Button>)
           }
          

        <Input  style={{width:"90%"}}
          type="text"
          placeholder="Add Users eg: John, Piyush, Jane"

          onChange={(e) => handleSearch(e.target.value)}
        />

       

        <UserList>
          {loading ? (
            <span>Loading...</span>
          ) : (

            searchResult && searchResult.slice(0, 4).map((user, index) => (
              <UserListItem key={index} user={user} handleFunction={() => handleAddUser(user)} />
            ))
          )}
        </UserList>

        <Button style={{background:"red"}} onClick={()=>handleRemove(user)}>Leave Group</Button>
      </ModalContent>
    </ModalWrapper>
  );
};

export default UpdateGroupChatModal;