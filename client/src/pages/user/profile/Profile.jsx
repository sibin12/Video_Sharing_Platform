import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { userInstance, videoInstance } from '../../../utils/axios';
import { toast } from 'react-toastify';
import { updateUser } from '../../../redux/authSlice';
import { validateImageFile } from '../../../utils/Validation'
import EditVideo from '../../../components/user/modals/editVideo';
const Container = styled.div`

@media (max-width: 484px) {
   margin:10px;
   
    margin-top:80px;
}
  
`;
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  margin: 50px 50px 0 10px;
`;

const CoverPhoto = styled.img`
  width: 100%;
  max-height: 300px;
  min-height:180px;
  min-width:260px;
  object-fit: cover;
  cursor: pointer;

`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: -100px;
  border: 5px solid #fff;
  cursor: pointer;
  
  @media (max-width: 484px) {
    max-width: 150px;
    max-height: 150px;
  }
`;

const UserName = styled.h1`
  gap: 10px;
  font-size: 24px;
  margin: 10px 0;
`;

const UserBio = styled.p`
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
`;




const NavBar = styled.div`
  display: flex;
  width:auto;
  max-width:18rem;
  background-color: #007BFF;
  color: #fff;
//   padding: 10px 0;
//   position: fixed;
  left: 0;


`;

const NavItem = styled.div`
  flex: 1;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
  padding: 10px
`;

const Hr = styled.hr`
margin-top:50px;
width:70vw;
`;


const TableContainer = styled.div`
 overflow:auto;
 `

const VideosTable = styled.table`
  width: 80%;
  // width: 900px;
  border-collapse: collapse;
  margin-top: 20px; 
  overflow: auto;
`;

const TableHeader = styled.thead`
  background-color: #007BFF;
  color: #fff;

`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  &:hover {
    background-color: #ddd;
  }
`;

const TableHeaderCell = styled.th`
  padding: 5px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 5px;
  text-align: left;
  
`;

const VideosDisplay = styled.img`
max-width:140px;
max-height:90px;
min-width:110px;
min-height:70px;
`;




const TableVisible = styled.td`
 
@media (max-width:484px){
    display:none;
  }
`


const Profile = () => {
  const toggle = useSelector((state) => state.auth.toggle);
  const { user } = useSelector((state) => state.auth);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [photo, setPhoto] = useState('')
  const [coverImage, setCoverImage] = useState('')


  const handleUpdateProfile = async (photo, inputName) => {
    let filename = null;

    try {
      if (photo) {
        console.log("image uploading");
        const formData = new FormData()
        filename = crypto.randomUUID() + photo.name
        formData.append('filename', filename)
        formData.append('image', photo)

        formData.append('input', inputName)


        const { data } = await userInstance.post(`/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })


        dispatch(updateUser(data.user))
        console.log(user);

      }
    } catch (error) {
      console.log(error.message);
    }
  }


  const handleProfilePictureChange = (e) => {
    if (!validateImageFile(e.target.files[0])) {
      return
    }
    setPhoto('')
    setPhoto(e.target.files[0])
    handleUpdateProfile(e.target.files[0], e.target.name)
  };

  // handleUpdateCoverImage
  const handleCoverImageChange = (e) => {
    if (!validateImageFile(e.target.files[0])) {
      return
    }
    setCoverImage('')
    setCoverImage(e.target.files[0])
    handleUpdateProfile(e.target.files[0], e.target.name)
  }


  const [selectedTab, setSelectedTab] = useState('uploaded'); // 'uploaded' or 'saved'

  const [videos, setVideos] = useState([])
  useEffect(() => {
    try {
      videoInstance.get(`/find-videos/${user?._id}`)
        .then((res) => {
          setVideos(res.data)
        })
    } catch (error) {
      toast.error(error.message)
    }
  }, [])

  const [videoOpen, setVideoOpen] = useState(null)
  const handleVideos = (videoId) => {
    setVideoOpen(videoId)
  }

  // callback function to update the video details.
  const updateVideo = (newData) => {
    if(newData.delete){
         const updatedVideos = videos.filter((video)=>
         video._id != newData.delete._id 
         )
         setVideos(updatedVideos)
    }else{
      const updatedVideos = videos.map((video) =>
      video._id == newData._id ? { ...newData } : video
    );
    setVideos(updatedVideos);
    }
    
  };

  return (
    < Container style={{ marginLeft: toggle ? '200px' : '60px' }} >
      <ProfileContainer>

        <div data-fieldname="coverImage">
          <label htmlFor='cover-image'>
            <CoverPhoto src={coverImage && URL.createObjectURL(coverImage) ||
              `http://localhost:5000/images/profile/${user?.coverImage}`
            }
              alt="Cover Photo" />
          </label>
          <input
            type='file'
            name='cover-image'
            id='cover-image'
            style={{ display: 'none' }}
            onChange={handleCoverImageChange}
          />

        </div>

        <div data-fieldname="profileImage">
          <label htmlFor='photo'>
            <ProfileImage
              src={photo && URL.createObjectURL(photo) ||

                `http://localhost:5000/images/profile/${user?.image}`

              }
            />
          </label>
          <input
            type='file'
            name='profile'
            id='photo'
            style={{ display: 'none' }}
            onChange={handleProfilePictureChange}
          />
        </div>


        <UserName>
          {user?.username} <BorderColorIcon onClick={() => toast.info("currently you cann't edit🤖")} />
        </UserName>
        <UserBio>subscribers: {user?.subscribers}</UserBio>
      </ProfileContainer>





      <NavBar   >
        <NavItem
          onClick={() => setSelectedTab('uploaded')}
          style={{ backgroundColor: selectedTab === 'uploaded' ? '#0056b3' : '' }}
        >
          Uploaded Videos
        </NavItem>
        <NavItem
          onClick={() => setSelectedTab('saved')}
          style={{ backgroundColor: selectedTab === 'saved' ? '#0056b3' : '' }}
        >
          Liked Videos
        </NavItem>
      </NavBar>
      <Hr />
      <TableContainer>

        {/* Render videos in a table */}
        {selectedTab === 'uploaded' && (

          <VideosTable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Videos</TableHeaderCell>
                <TableHeaderCell>Title</TableHeaderCell>
                {/* <TableVisible> */}
                <TableHeaderCell>desc</TableHeaderCell>
                <TableHeaderCell>Views</TableHeaderCell>
                <TableHeaderCell>Likes</TableHeaderCell>
                <TableHeaderCell>Dislikes</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
                {/* </TableVisible> */}
              </TableRow>
            </TableHeader>
            <tbody>
              {videos.map((video, index) => (
                <TableRow key={index}
                // onClick={() => handleVideos(video?._id)}
                >
                  <TableCell> <VideosDisplay src={video?.imgUrl} /> </TableCell>
                  <TableCell>{video?.title}</TableCell>
                  {/* <TableVisible> */}
                  <TableCell>{video?.desc.slice(0, 17)}..</TableCell>
                  <TableCell>{video?.views?.length}</TableCell>
                  <TableCell>{video?.likes?.length}</TableCell>
                  <TableCell>{video?.dislikes?.length}</TableCell>
                  <TableCell>< EditVideo video={video} updateVideo={updateVideo} /></TableCell>
                  {/* </TableVisible> */}

                </TableRow>
              ))}
            </tbody>
          </VideosTable>
        )}

        {selectedTab === 'saved' && (

          <VideosTable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Videos</TableHeaderCell>
                <TableHeaderCell>Title</TableHeaderCell>
                {/* <TableVisible> */}
                <TableHeaderCell>desc</TableHeaderCell>
                <TableHeaderCell>Views</TableHeaderCell>
                <TableHeaderCell>Likes</TableHeaderCell>
                <TableHeaderCell>Dislikes</TableHeaderCell>
                {/* </TableVisible> */}
              </TableRow>
            </TableHeader>
            <tbody>
              {videos.map((video, index) => (
                <TableRow key={index}
                  onClick={() => handleVideos(video?._id)}
                >
                  <TableCell> <VideosDisplay src={video?.imgUrl} /> </TableCell>
                  <TableCell>{video?.title}</TableCell>
                  {/* <TableVisible> */}
                  <TableCell>{video?.desc.slice(0, 17)}..</TableCell>
                  <TableCell>{video?.views?.length}</TableCell>
                  <TableCell>{video?.likes?.length}</TableCell>
                  <TableCell>{video?.dislikes?.length}</TableCell>
                  {/* </TableVisible> */}

                </TableRow>
              ))}
            </tbody>
          </VideosTable>
        )}
      </TableContainer>
      {videoOpen && (<EditVideo setOpen={videoOpen} />)}
    </Container>
  );
};

export default Profile;
