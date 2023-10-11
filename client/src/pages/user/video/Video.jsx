import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ShareIcon from '@mui/icons-material/Share';
import FlagIcon from '@mui/icons-material/Flag';
import { IconButton, Menu, MenuItem } from '@mui/material';
import Comments from '../../../components/user/coments/Comments';
import Card from '../../../components/user/card/Card';
import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { dislike, fetchSuccess, like } from "../../../redux/videoSlice";
import { userInstance, videoInstance } from '../../../utils/axios';
import { toast } from 'react-toastify';
import { login, subscription } from '../../../redux/authSlice';
import VideoReportButton from '../../../components/user/report/Report';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 56px auto;
  padding: 10px 0px 5px 15px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Content = styled.div`
  flex: 80%;
  padding: 0 16px 0 10px;

  @media (min-width: 768px) {
    padding: 0;
  }
`;

const VideoWrapper = styled.div`
  // position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio for responsive video */
  width: 100%;
  height: 0;
  overflow: hidden;

  // iframe,
  // video {
  //   // position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  // }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const User = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UserInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const UserDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const UserName = styled.span`
  font-weight: 500;
`;

const UserCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: lightblue;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Recommendation = styled.div`
  flex: 20%;
  padding: 0 16px;

  @media (min-width: 768px) {
    padding: 0;
  }
`;

const Wrapper = styled.div`
max-width:400px;
margin:5px;
`;

function Video() {
  const { user } = useSelector((state) => state.auth);
  const { currentVideo } = useSelector((state) => state.video);
  const block = useSelector((state) => state.video.block);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState({})
  const [videobyTag, setVideobyTag] = useState([])


  const [anchorEl, setAnchorEl] = useState(null);
  const [reportModal, setReportModal] = useState(false)

  const path = useLocation().pathname.split("/")[2];

  useEffect(() => {
    videoInstance.get(`/find/${path}`)
      .then((res) => {
        console.log(res.data, 'current video');
        dispatch(fetchSuccess(res.data))
      })
      .catch((err) => {
        toast.error(err.message)
        console.log(err);
      })

    videoInstance.get(`/tags?tags=${currentVideo?.tags}`)
      .then((res) => {
        console.log(res.data, "😍😍😍😍😍😍😍😍😍😍😍😍😍😍😍");
        setVideobyTag(res.data)
      })
      .catch((err) => {
        console.log(err.message);
      })
  }, [path, dispatch, block])

  const handleLike = async () => {
    await userInstance.put(`/like/${currentVideo._id}`)

    dispatch(like(user._id))
  }

  const handleDislike = async () => {
    await userInstance.put(`/dislike/${currentVideo._id}`)
    dispatch(dislike(user._id))
  }


  //share video 

  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    var url = `http://localhost:3000/video/${currentVideo?._id}`
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success("Link Copied to Clipboard")
        handleClose();
      })
      .catch((error) => {
        toast.error('Failed to copy link: ', error);
        handleClose();
      });
  };

  const handleShareOnSocialMedia = (platform) => {
    // Initialize the Facebook SDK (replace 'YOUR_APP_ID' with your App ID)
    var url = `http://localhost:3000/video/${currentVideo?._id}`

    window.FB.init({
      appId: '',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v13.0',
    });

    // Create a Facebook share dialog
    window.FB.ui({
      method: 'share',
      href: url, // Replace with the URL of the video you want to share
    });

    // Close the menu when sharing is initiated
    handleClose();
  };

  // handling subscription ,,

  const handleSubscribe = () => {
    
 
    console.log(user?.subscribedUser, "userName?._Diid", currentVideo?.userId?._id);
    user?.subscribedUser?.includes(currentVideo?.userId?._id)
      ? userInstance.put(`/unsub/${currentVideo?.userId?._id}`)

      : userInstance.put(`/sub/${currentVideo?.userId?._id}`)

      dispatch(subscription(currentVideo?.userId?._id));
      

  }


  const handleReport = () => {
    setReportModal(!reportModal)
  }



  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo?.videoUrl} controls />
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>{currentVideo?.views?.length}views   {format(currentVideo?.createdAt)}</Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo?.likes?.includes(user?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo?.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo?.dislikes?.includes(user?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "}
              Dislike
            </Button>
            {/* <Button><LibraryAddIcon /> Save </Button> */}
            <Button onClick={handleReport}><FlagIcon /> Report </Button>
            {reportModal && <VideoReportButton videoId={currentVideo._id} />}
            <Button onClick={handleShareClick}><ShareIcon /> Share </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleCopyLink}>Copy Link</MenuItem>
              <MenuItem onClick={() => handleShareOnSocialMedia('facebook')}>Share on Facebook</MenuItem>
              <MenuItem onClick={() => handleShareOnSocialMedia('twitter')}>Share on Twitter</MenuItem>
              {/* Add more sharing options as needed */}
            </Menu>



          </Buttons>
        </Details>
        <Hr />
        <User>
          <UserInfo>
            <Image src={`http://localhost:5000/images/profile/${currentVideo?.userId?.image}`} />
            <UserDetail>
              <UserName>{currentVideo?.userId?.username}</UserName>
              <UserCounter>{currentVideo?.userId?.subscribers}subscribers</UserCounter>
            </UserDetail>
            {currentVideo?.userId?._id !== user?._id && (
              <Subscribe onClick={handleSubscribe}
                style={{
                  backgroundColor: user?.subscribedUser?.includes(currentVideo?.userId?._id)
                    ? "#28a745"
                    : "#007bff",
                  color: "#ffffff",
                }}
              > 
                {user?.subscribedUser?.includes(currentVideo?.userId?._id)
                  ? "SUBSCRIBED"
                  : "SUBSCRIBE"}
              </Subscribe>
            )}
          </UserInfo>
        </User>
        < Hr />
        <Comments videoId={currentVideo?._id} />
      </Content>
      <Recommendation tags={currentVideo?.tags}>
      <Wrapper>
          {videobyTag ? (
            videobyTag.map((video) => {
              return (
                <Card key={video?._id} video={video} type='sm' />
              )
            })
          ) : (
            <>
              <Card type="sm" />
              <Card type="sm" />
              <Card type="sm" />
              <Card type="sm" />
              <Card type="sm" />
              <Card type="sm" />
            </>
          )}

        </Wrapper>
      </Recommendation>
    </Container>
  )
}

export default Video;
