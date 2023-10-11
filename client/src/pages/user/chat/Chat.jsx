import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Search, Notifications } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { chatInstance } from '../../../utils/axios';
import { useSelector } from 'react-redux';
import ChatLoading from '../../../components/user/chat/ChatLoading';
import UserListItem from '../../../components/user/chat/UserListItems';
import SearchUser from '../../../components/user/chat/SearchUser';
import LoadingSpinner from '../../../components/user/chat/Spinner';
import { ChatState } from '../../../Context/ChatProvider';
import { getSender, getSenderImage } from '../../../utils/ChatLogin';
import AddIcon from '@mui/icons-material/Add';
import GroupChatModal from '../../../components/user/chat/GroupChatModal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UpdateGroupChatModal from '../../../components/user/chat/UpdateGroupChatModal';
import SingleChat from "../../../components/user/chat/SingleChat"

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Default: Single column layout */
  gap: 20px;
  margin: 40px 20px; /* Reduce the margins for smaller screens */

  @media (min-width: 674px) {
    /* Adjust the layout for screens wider than 768px */
    grid-template-columns: 1.4fr 4fr;
    margin: 40px 70px;
  }
`;

const Navbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px 20px;
  margin: 40px 70px 0px 70px;

  @media (max-width: 426px) {
    margin-top: 90px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: whitesmoke;
  border-radius: 5px;
  padding: 5px 10px;
  margin-right: 10px;
  flex-grow: 1; /* Allow it to grow on wider screens */
`;

const SearchInput = styled.label`
  border: none;
  outline: none;
  background-color: whitesmoke;

  width: 100%;
`;

const NotificationsIcon = styled(Notifications)`
  cursor: pointer;
  font-size: 24px;
`;

const Wrapper = styled.div`
  border-radius: 8px 8px 0px 0px;
  padding: 10px 16px;
  background-color: whitesmoke;
  font-weight: 400;
  font-size: 18px;
  margin: 0;
`;

const Heading = styled.h2`
  background-color: whitesmoke;
  min-width: 16vw;
  margin: 0; /* Remove default margin */
  padding: 10px; /* Add padding for space */
`;

const SearchDiv = styled.div`
  margin-top: 10px;

  @media (min-width: 768px) {
    width: fit-content;
    flex-direction: row;
    justify-content: flex-start;
  }
`;

const UserList = styled.div`
  padding: 20px;
  background-color: whitesmoke;
  border: 1px solid grey;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
  margin-right: 10px;

  @media (min-width: 768px) {
    min-height: 350px;
    margin-right: 0;
  }
`;

const ChatSection = styled.div`
  border: 1px solid grey;
  border-radius: 10px;
  overflow-y: scroll;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1)
  ),
    url('https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Background.2e16d0ba.fill-1422x800.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
  padding: 0px;
  max-height: 470px;
  min-height: 370px;
  margin-top: 10px; /* Add margin for separation on smaller screens */

  @media (min-width: 768px) {
    /* Adjust styles for screens wider than 768px */
    margin-top: 0; /* Remove margin on larger screens */
  }
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin-bottom: 10px;
  background: #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
`;

const UserImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
  cursor: pointer;
`;

const Username = styled.span`
  font-weight: bold;
  margin-top: 2px;
  font-size: 14px;
`;

const ChatSectionHeading = styled.div`
  border-radius: 8px 8px 0px 0px;
  padding: 10px 16px;
  background-color: whitesmoke;
  font-weight: 600;
  overflow-y: hidden;

  font-size: 26px;

  margin: 0;
`;

const Text = styled.p``;

const Button = styled.button`
  justify-content: center;
  font-weight: 500;
  padding: 3px;
  margin: 3px;
  border: none;
  box-shadow: 5px 3px 3px rgba(0, 0, 0, 0.3);
`;

function Chat({ fetchAgain }) {
  const {user} =useSelector((state)=>state.auth)
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loggedUser, setLoggedUser] = useState();
  const [edit ,setEdit] = useState(false)
  const { selectedChat, setSelectedChat,  chats, setChats } = ChatState();

  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    console.log(open, "opennn status");
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
   
  const handleOpenEdit = ()=>{
    setEdit(true)
  }

  const handleCloseEdit =()=>{
    setEdit(false)
  }

  const fetchChats = async () => {
    try {
      const { data } = await chatInstance.get('/');
      setChats(data);
    } catch (error) {
      toast.error(error.message || 'Failed to load chats');
    }
  };

  useEffect(() => {
    setLoggedUser(user);
    fetchChats();
  }, [fetchAgain]);

  // const senderName = getSender(loggedUser, chat?.users);
       
  return (
    <>
      <Navbar>
        <SearchBar>
          <SearchInput onClick={() => setLoading(!loading)}>
            Click here to Search
          </SearchInput>
        </SearchBar>
        <NotificationsIcon />
      </Navbar>
      {open && (<GroupChatModal open={open} onClose={handleCloseModal} />)}
      {edit && ( <UpdateGroupChatModal open={edit} onClose={handleCloseEdit} fetchAgain={fetchAgain} setFetchAgain={!fetchAgain} />)}
      <SearchDiv>
        {loading && <SearchUser />}
      </SearchDiv>
      <Container>
        <UserList>
          <Wrapper>
            <Heading>
              My Chats
              <Button onClick={handleOpenModal}>
                New Group Chat <AddIcon />
              </Button>
            </Heading>
          </Wrapper>

          {chats ? (
            chats?.map((chat) => (
              <UserItem
                key={chat?._id}
                style={{
                  backgroundColor:
                    selectedChat === chat ? '#38B2AC' : '#E8E8E8',
                  color: selectedChat === chat ? 'white' : 'black',
                }}
                onClick={() => setSelectedChat(chat)}
              >

                {!chat?.isGroupChat ? (
                  <>
                   
                    <UserImage
                      src={`http://localhost:5000/images/profile/${getSenderImage(loggedUser,chat?.users)}`}
                      alt={`http://localhost:5000/images/profile/${getSenderImage(loggedUser,chat?.users)}`} />

                    <Username> {getSender(loggedUser, chat?.users) }</Username>
                  </>
                ) : (
                  <Username>{chat?.chatName}   </Username>
                )}
              </UserItem>
            ))
          ) : (
            <ChatLoading />
          )}
        </UserList>
        <ChatSection>
          {loadingChat && <LoadingSpinner />}
          {selectedChat && (
            <>
  <ChatSectionHeading>
    {!selectedChat.isGroupChat ? (
      <>
        <UserImage
          src={`http://localhost:5000/images/profile/${selectedChat?.users[0]?.image}`}
          
          alt={selectedChat?.users[0]?.username}
          />
        {selectedChat?.users[0]?.username}
      </>
    ) : (
      <>
        {selectedChat?.chatName}
        <span style={{ float: "right" }}>
          <VisibilityIcon onClick={handleOpenEdit} />
        </span>
      </>
    )}
  </ChatSectionHeading>
 <SingleChat />
    </>
 
)}


        </ChatSection>
      </Container>
    </>
  );
}

export default Chat;
