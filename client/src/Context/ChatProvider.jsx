
import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext()

const ChatProvider = ({children}) =>{
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState();
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState();
    useEffect(() => {
        // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        // setUser(userInfo);
        
        const userInfo = localStorage.getItem("userInfo");
        // JSON.parse(userInfo)
         setUser(userInfo)
        // if (!userInfo) {
        //   navigate("/");
        // }
      }, []);

    return ( 
    <ChatContext.Provider
    value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
       >
        {children}
        </ChatContext.Provider >
    );
};


export const ChatState = ()=>{
     return useContext(ChatContext);
    
}

export default ChatProvider;


