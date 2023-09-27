import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { styled } from 'styled-components'
import loop from '../../../assets/loop.png'
import {format} from "timeago.js";
import { userInstance, videoInstance } from '../../../utils/axios';
import { useSelector } from 'react-redux';


const Container = styled.div`
width:270px;
// background-color:whitesmoke;
margin-bottom: ${(props)=> props.type === "sm" ? "10px" : "45px"};
cursor:pointer;
display: ${(props)=> props.type === "sm" &&"flex"};
border-radius:10px

@media (min-width: 768px) {
 width:200px;
}
`;

const Image = styled.img`
width: 100%;
height: ${(props)=> props.type === "sm" ? "120px" : "180px"};
background-color:grey;
border-radius:10px;
`;

const Details = styled.div`
display: flex;
margin-top: ${(props)=> props.type !== "sm" && "16px"};
margin:${(props)=>props.type ==="sm" && "5px"};
gap:12px;
padding:10px;
`;

const UserImage = styled.img`
width:36px;
height:36px;
border-radius:50%;
background-color:grey;
display: ${(props)=> props.type === "sm" && "none"};
`;

const Texts = styled.div`
`;

const Title = styled.h1`
font-size: 16px;
font-weight: 500;
color: ${({theme}) => theme.text}
`;

const UserName = styled.h2`
font-size: 14px;
color: ${({theme})=> theme.text};
margin: 9px 0px; 
`;

const Info = styled.div`
font-size: 11px;
color: ${({theme})=>theme.text}
`

function Card({type , video}) {
  const block = useSelector((state)=>state.video.block)
  // const [user, setUser]=useState({})
  const {user}= useSelector((state)=>state.auth)


  // useEffect(()=>{
  //   userInstance.get(`/find/${video?.userId}`)
  //   .then((res)=>{
      
  //     setUser(res.data)
  //   })
  //   .catch((err)=>{
  //     console.log(err.message);
  //   })
  // },[])


  const handleViews =()=>{
     if(user){
       videoInstance.put( `/view/${video._id}`,{userId : user._id})
       .then((res)=>{
         console.log(res,"res of views😎😎😎😎😎");
        })
        .catch((err)=>{
          console.log(err.message);
        })
      }else{
        console.log("user not login");
      }
      
  }

  return (
    <Link to={`/video/${video?._id}`} style={{textDecoration:"none"}}>
    <Container type={type}   onClick={handleViews}>
     <Image type={type} 
     src={video?.imgUrl} />
     <Details  type={type}>
      <UserImage type={type} src={`http://localhost:5000/images/profile/${video?.userId?.image}`} />
      <Texts>
        <Title>{video?.title}</Title>
        <UserName>{video?.userId?.username}</UserName>
        <Info>{video?.views?.length} views   • {format(video?.createdAt)}</Info>
      </Texts>
      </Details>
    </Container>
     </Link>
  )
}

export default Card
