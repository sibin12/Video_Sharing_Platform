import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
// import Comment from '../comment/Comment';
import { useSelector } from 'react-redux';
import { commentInstance } from '../../../utils/axios';
import Comment from '../../user/comment/Comment';
import { Button } from '@mui/material';

const Container = styled.div`
`;

const NewComment = styled.div`
display:flex;
align-item:center;
gap:10px;
`;

const Avatar = styled.div`
width: 50px;
height:45px;
border-radius: 50%;
background-color:grey;
`;

const Inputs = styled.input`
border: none;
outline:none;
padding: 5px;
width:100%;
`;





const Details = styled.div`
display: flex;
flex-direction: row;
// padding:10px;
// gap: 25px;
margin-left:50px;
`;

const Name = styled.span`
font-size: 16px;
font-weight:500;
color: ${({theme})=>theme.text};

`;

const Date =styled.span`
font-size: 11px;
font-weight:400;
margin-left:auto;
`;

const Cmnt = styled.div`
display: flex;
flex-direction: column;
margin-left:20px;
// gap: 10px;
`;

const Text = styled.span`
display:flex;
color: ${({theme})=>theme.text};
font-size:14px;
`;


function Comments({videoId}) {
  const {user}= useSelector((state)=>state.auth);
  const [text, setText] = useState("")
  const [comments, setComments] = useState([])
  const [replyText, setReplyText] = useState("")



  useEffect(()=>{
    commentInstance.get(`/${videoId}`)
    .then((res)=>{
      setComments(res.data)
    })
    .catch((err)=>{
      console.log(err.message);
    })
  }, [videoId])
   
   const handleAddcomment = (e)=>{
    e.preventDefault();
     
      commentInstance.post('/',{text ,user,videoId})
      .then((res)=>{
        setComments([...comments, res.data]);
        setText(''); 
      })
      .catch((err)=>{
        console.log(err.message);
      })
   }

  
  return (
      <Container> 
        <NewComment>
            <Avatar  src={user?.image ? user?.image :'https://www.pngmart.com/files/22/Spiral-PNG-Photo.png' }  >
            </Avatar >
                      <Inputs name='text' type="text" placeholder='Add a comment...' value={text} onChange={(e) => setText(e.target.value)}/>
                      <Button onClick={handleAddcomment}>add</Button>
        </NewComment>
        
        {
          comments.map((comment)=>{
            return(
            <>
              <Comment key={comment?._id} comment= {comment}  setComments={setComments} videoId ={videoId}/>
              {/* <Details>
          <Inputs
          name="text"
          type="text"
          placeholder="Reply to this comment..."
          value={replyText}
          onChange={(e)=> setReplyText(e.target.value)}
        />
        <Button style={{width:'100px'}} onClick={handleReply} >Reply</Button>
          </Details> */}
            </>
              
            )
          })
        }
      </Container>
  )
}

export default Comments
