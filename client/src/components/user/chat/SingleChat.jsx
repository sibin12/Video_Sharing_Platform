import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import { ChatState } from "../../../Context/ChatProvider";
import LoadingSpinner from "./Spinner";
import { toast } from "react-toastify";
import { messageInstance } from "../../../utils/axios";
import { useSelector } from "react-redux";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from '../../../utils/ChatLogin'


import io from 'socket.io-client'
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;



const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-height:350px;
  min-height:350px;
  background-color: #f0f0f0;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: scroll;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  gap:10px;
`;

const SentMessage = styled.div`
display:flex;
  padding: 10px;
`;

const ReceivedMessage = styled.div`
  background-color: #e5e5e5;
  color: #333;
  padding: 10px;
  gap:10;
  border-radius: 10px;
  text-align: left;
`;

const UserImage = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  object-fit: cover;
`;

const Username = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 10px;
  margin-bottom:-7px;
`;

const Input = styled.input`
  flex-grow: 1;
  border: none;
  padding: 10px;
`;

const SendButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 0px 20px 20px 0px;
`;




const ChatPage = () => {

    const { user } = useSelector((state) => state.auth)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState();

    const [socketConnected, setSocketConnected] = useState(false)

    const [typing, setTyping] = useState(false)
    const [isTyping, setisTyping] = useState(false)

    const { selectedChat, setSelectedChat } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return

        try {
            setLoading(true)
            const { data } = await messageInstance.get(`/${selectedChat._id}`)

            setMessages(data)
            // console.log(data);
            // console.log(messages,"😄😄😄");

            setLoading(false)

            socket.emit('join chat', selectedChat._id)

        } catch (error) {
            toast.error("error occured")
            console.log(error.message);
        }
    }



    useEffect(() => {

        socket = io(ENDPOINT);
        socket.emit("setup", user)
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", ()=> setisTyping(true))
        socket.on("stop typing", ()=> setisTyping(false))
    }, [])

    useEffect(() => {
        fetchMessages()

        selectedChatCompare = selectedChat;
    }, [selectedChat])


    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                // notification setup
            } else {
                setMessages([...messages, newMessageRecieved])
            }

        })
    })



    const sendMessage = async () => {
        if (!newMessage) {
            toast.info("enter any message!")
            return
        }
socket.emit('stop typing', selectedChat._id)
        try {
            setLoading(true)
            setNewMessage("")


            const { data } = await messageInstance.post(`/`, {
                content: newMessage,
                chatId: selectedChat._id
            })


            socket.emit('new message', data)  

            setMessages([...messages, data])
            // console.log(data, );
            setLoading(false)
        } catch (error) {
            console.log(error.message);
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        if(!socketConnected) return;

        if(!typing){
            setTyping(true)
            socket.emit('typing',selectedChat._id);
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(()=>{
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime;


            if(timeDiff >= timerLength  && typing){
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }

        },timerLength)

        //need to implement typing .....
    }
    return (
        <Container>

            <Content>
                <MessageContainer >


                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {messages &&
                                messages?.map((m, i) => (
                                    <>
                                        <SentMessage >
                                            {(isSameSender(messages, m, i, user?._id) ||
                                                isLastMessage(messages, i, user?._id)) && (
                                                    <>
                                                        <Username style={{ color: "skyblue" }} >{m?.sender?.username}</Username>
                                                        <UserImage src={`http://localhost:5000/images/profile/${m?.sender?.image}`} />
                                                    </>
                                                )}

                                            <span
                                                style={{
                                                    backgroundColor: `${m?.sender?._id === user?._id ? "#e5e5e5" : "#4caf50"
                                                        }`,
                                                    marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                                                    marginTop: isSameUser(messages, m, i, user?._id) ? "3px" : "10px",
                                                    borderRadius: "10px 0px",
                                                    padding: "5px 15px",
                                                    color: "black",
                                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.2)"

                                                    // maxWidth: "75%",
                                                }}
                                            >
                                                {m?.content}
                                            </span>

                                        </SentMessage>
                                    </>
                                ))
                            }
                        </>
                    )}
                   
                </MessageContainer>
            </Content>
            <InputContainer>
            {isTyping ? <div>Typing....</div> : <></> }
                <Input
                    type="text"
                    placeholder="Enter a message..."
                    onChange={typingHandler}
                    value={newMessage}
                />
                <SendButton onClick={sendMessage}>Send</SendButton>
            </InputContainer>
        </Container>
    );
};

export default ChatPage;
