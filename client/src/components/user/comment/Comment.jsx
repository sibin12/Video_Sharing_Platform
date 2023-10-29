import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { commentInstance, userInstance } from '../../../utils/axios';
import { format } from 'timeago.js'
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
const Container = styled.div`
display : flex;
flex-direction: column;
gap : 10px;
margin : 10px 0px
`;

const Wrapper = styled.div`
display: flex;
flex-direction: row;
padding:5px;
gap: 10px;
background-color:whitesmoke;
border-radius:5px;
`;

const Avatar = styled.div`
display: flex;
flex-direction: row;
width: 50px;
height:45px;
border-radius: 50%;
background-color:grey;
`;

const Details = styled.div`
display: flex;
flex-direction: row;
padding:10px;
gap: 25px;
`;

const Name = styled.span`
font-size: 16px;
font-weight:500;
color: ${({ theme }) => theme.text};

`;

const Date = styled.span`
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
color: ${({ theme }) => theme.text};
font-size:14px;
background-color:whitesmoke;
border-radius:5px;
padding:10px 30px;
margin-bottom:5px;
`;

const Icon = styled.span`
margin-left:auto;
cursor:pointer;
`;

const Inputs = styled.input`
border: none;
outline:none;
padding: 5px;
width:100%;
`;

const Label = styled.label`
padding:10px;
font-weight: 300;
cursor: pointer;
color:${({ theme }) => theme.text};
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;
const Hrl = styled.hr`
width:20vw;
display:flex;
felx-direction:row;
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Show = styled.p`
display:flex;
margin:14px;
font-size:10px;
font-weight:500;
cursor:pointer;
`;

const Div = styled.div`
`;



function Comment({ comment, setComments ,videoId }) {
  const { user } = useSelector((state) => state.auth);
  const [state, setState] = useState(false)
  const [userName, setUserName] = useState({})
  const [replyText, setReplyText] = useState("")
  const [replyState, setReplyState] = useState(false)
  const [showReply, setShowReply] = useState(true)


  useEffect(() => {
    userInstance.get(`/find/${comment.userId}`)
      .then((res) => {
        setUserName(res.data)
      })
      .catch((err)=>{
        toast.error("don't have comment")
      })


  }, [comment.userId, state, replyState])


  const handleDelete = (e) => {
    e.preventDefault()
    commentInstance.delete(`/${comment._id}`)
      .then((res) => {
        setState(true)
        console.log(res.data, "deleted comment");
      }).catch((err) => {
        console.log(err.message);
      })
  }
  if (state) {
    return null;
  }
  const handleReplyDelete = (commentId,replyId) => {
      
    // commentInstance.delete(`${commentId}/reply/${replyId}`)
    //   .then((res) => {
    //     setState(true)
    //     console.log(res.data, "deleted comment");
    //   }).catch((err) => {
    //     console.log(err.message);
    //   })
  }
  // if (state) {
  //   return null;
  // }


  const handleReply = (commentId) => {
    if (replyText.trim() === '') {
      return toast.error("write your reply")
    }
    commentInstance.post('/reply', { replyText, user, videoId, commentId })
      .then((replyResponse) => {
        console.log(replyResponse.data, "add comment reply");
        // setComments(prev => {
        //   return prev.map(comment => {
        //     if(comment._id === commentId){
        //       return comment.replies = replyResponse.data.replies
        //     }
        //     return comment
        //   })
        // })
        // console.log(comment, "😍😍😍😍😍😍😍😍")
        // setComments([...replyResponse.data.replies])
        // setReplyState(true)
        setReplyText('');
      })
      .catch((err) => {
        console.log(err.message);
      })
  }


  const handleReplyButtonClick = () => {
    // Call the handleReply function here
    handleReply(comment._id);
  }


  const ShowReply = ()=>{
    setShowReply(!showReply)
  }

  return (
    <Container>
      <Wrapper >

        {userName?.image  && 
          <Avatar
  src={
    `https://localhost:5000/images/profile/${userName?.image}` ||
    'https://www.pngmart.com/files/22/Spiral-PNG-Photo.png'
  }
/>
        }
        <Details>
          <Name>{userName?.username}</Name> <Date> {format(comment?.createdAt)}</Date>
          {user?.username === userName?.username &&
            (<Icon>
              <DeleteIcon onClick={handleDelete} />
            </Icon>)}
        </Details>
      </Wrapper>
      <Cmnt>
        <Text>{comment?.text}</Text>
        <Details>
          <Inputs
            name="text"
            type="text"
            placeholder="Reply to this comment..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Button style={{ width: '100px' }} onClick={handleReplyButtonClick} >Reply</Button>
        </Details>
         {comment?.replies?.length > 0  &&  ( <> <Hrl /><Show onClick={ShowReply}>{showReply ?  'show reply' : 'hide reply'}</Show> </>) }
        
        {/* Render replies */}
           
         <Div style={{display: showReply ? "none" : "block"}} >
        
        {comment?.replies?.map((reply) => (
          <>
            <Wrapper >
              <Details>
                <Name>{reply?.userId?.username}</Name>
                {/* {user?.username === reply?.userId?.username &&
                  (<Icon>
                    <DeleteIcon onClick={handleReplyDelete (comment._id,reply?._id)} />
                  </Icon>)} */}
              </Details>
            </Wrapper>
            <Text key={reply._id}>{reply?.text}</Text>
          </>
        ))}
         </Div>
      </Cmnt>
      <Hr />
    </Container>

  )
}

export default Comment
