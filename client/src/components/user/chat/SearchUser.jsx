
import React, { useState } from 'react';
import styled from 'styled-components';
import ChatLoading from './ChatLoading';
import Search from '@mui/icons-material/Search';
import { toast } from 'react-toastify';
import { chatInstance, userInstance } from '../../../utils/axios';
import UserListItem from './UserListItems';
import { ChatState } from '../../../Context/ChatProvider';

const SideDrawerContainer = styled.div`
  display: flex;
  width: 25%; /* Set the width of the side drawer */
  height: 100%; /* Adjust the height as needed */
  position:absolute;
  margin-left:50px;
  border-radius:10px;
  @media (max-width:540px){
    width:60%;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 10px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
`;

const UserListContainer = styled.div`
//   flex: 1; /* This will take 1fr width */
width:fit-content;
  background-color: #ffffff;
  padding: 20px; 
`;




function SearchUser( ) {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    // const [selectedChat, setSelectedChat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingChat, setLoadingChat] = useState(false);

    const {
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
      } = ChatState();
      
    const handleSearch = async () => { 
        if (!search) {
            toast.error(
                "Please Enter something in search",
            );
            return;
        }

        try {

            setLoading(true);

            // useEffect(()=>{
            userInstance.get(`/chat/?search=${search}`)
                .then((res) => {
                    if (res.data.length < 0) {
                        setLoading(true)
                    } else {

                        console.log(res.data, "😁😁😁");
                        setSearchResult(res.data)
                        setLoading(false)
                    }
                })
            // },[search])



        } catch (error) {
            toast.error(error.message)
        }
    }


    const accessChat = async (userId) => {
        console.log(userId);

        try {
            setLoadingChat(true);

            const { data } = await chatInstance.post(`/`, { userId });

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
             console.log(data,"res of access chat ");
            // setLoadingChat(false);
        } catch (error) {
            toast.error( error.message ||
                "Error fetching the chat"
            );
            setLoading(false)
            setLoadingChat(false);
        }
    };

    return (
        <SideDrawerContainer  style={{ display : loadingChat ? "none" : "block"}}>
            <UserListContainer>
                <SearchBar>
                    <SearchInput type="text" placeholder="Search Users"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} />
                    <button onClick={handleSearch}>          <Search />
                    </button>
                </SearchBar>
 
                {loading ?
                    (<ChatLoading />
                    )
                    :
                    (
                        searchResult.map((user) => (
                            <UserListItem
                                key={user?._id}
                                user={user}
                                handleFunction={() => accessChat(user?._id)} />
                           
                        ))
                    )

                }


            </UserListContainer>
        </SideDrawerContainer>
    );
}

export default SearchUser;
