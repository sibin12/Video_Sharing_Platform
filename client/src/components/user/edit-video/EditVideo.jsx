import React, { useEffect, useState, useRef } from 'react'
import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close';
import app from "../../../firebase/config";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { videoInstance } from '../../../utils/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AvatarEditor from 'react-avatar-editor';



const Container = styled.div`
width:100%;
height:100%;
position:fixed;
top:0;
left:0;
background-color:#000000a7;
display:flex;
align-items:center;
justify-content: center;
`
const Wrapper = styled.div`
z-index:2;
width:600px;
height:auto;
// position:sticky;
top:20px;
background-color:white;
// background-color:lightblue;
// background-color:${({ theme }) => theme.bgLighter};
// color:${({ theme }) => theme.text};
padding:20px;
flex-direction:column;
gap:20px;
// position:relative;
 ` ;

const Close = styled.div`
 position: absolute;
 top:10px;
 right:10px;
 cursor:pointer;
 `;

const Title = styled.h1`
 `;

const Input = styled.input`
 display:flex;
 width:96%;
 border: 1px solid ${({ theme }) => theme.soft};
 color: ${({ theme }) => theme.text};
border-radius:3px;
padding:10px;
background-color:transparent;
margin-top:10px;
 `;

const Desc = styled.textarea`
 border: 1px solid ${({ theme }) => theme.soft};
 color: ${({ theme }) => theme.text};
border-radius:3px;
padding:10px;
width:96%;
margin-top:10px;
background-color:transparent;
 `;

const Button = styled.button`
border-radius:8px;
border:none;
padding:10px 20px;
font-weight: 500;
cursor: pointer;
margin-top:10px;
background-color:lightblue;
// background-color:${({ theme }) => theme.soft};
color:${({ theme }) => theme.text};
`;
const Label = styled.label`
padding:10px;
font-weight: 300;
cursor: pointer;
color:${({ theme }) => theme.text};
`;

const Img = styled.img`
width:200px;
height:150px;
`

function EditVideo({ setOpen }) {

  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [img, setImg] = useState(undefined)
  const [video, setVideo] = useState(undefined)
  const [imgPerc, setImgPerc] = useState(0)
  const [videoPerc, setVideoPerc] = useState(0)
  const [inputs, setInputs] = useState({})
  const [tags, setTags] = useState([])
  const [fileValidationErr, setFileValidationErr] = useState('')

  const [selectedImage, setSelectedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [editor, setEditor] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null); // New state for cropped image

const [videos,setVideos] =useState(null)

console.log(setOpen,"😊😊😊");

useEffect(()=>{
    videoInstance.get(`/find/${setOpen}`)
    .then((res)=>{
        setVideos(res.data)
        console.log("😊😊😊😊😊");
        setSelectedImage(res.data?.imgUrl)
        // setCroppedImage(res.data?.imgUrl)
    })
    .catch((err)=>{
        console.log(err.message);
    })
},[])








  // handling the titile,desc
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }
  // handling the tags
  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  }

  //uploading to firebase
  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file?.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //   console.log('Upload is ' + progress + '% done');
        urlType === "imgUrl" ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress))
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            break;
        }
      },
      (err) => {
        toast.error(err.message || 'An error occurred.');
        console.log(err.message)
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL }
          })
        });
      }
    );
  }

  // image validation
  const validateImageFile = (file) => {
    if (!file) {
      toast.error('Please select an image file.')
      return false;
    }
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error('Only JPG, JPEG, PNG, or GIF images are allowed.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return false;
    }
    setFileValidationErr(''); // Clear any previous validation errors
    return true;
  };

  const handleFileChange = (e) => {

    const file = e.target.files[0];
    if (!validateImageFile(file)) {
      return;
    }

    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  const handleSave = () => {
    if (editor) {
      const canvas = editor.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'cropped_image.png', { type: 'image/png' });
          setImg(file); // Update the cropped image state with a File object

          // Create a data URL for the cropped image and set it in a separate state
          const dataURL = URL.createObjectURL(file);
          setCroppedImage(dataURL);
        }
      }, 'image/png');
    }

  }

  useEffect(() => { video && uploadFile(video, "videoUrl") }, [video]);

  useEffect(() => {
    img && uploadFile(img, "imgUrl")
    console.log(img, "cropped imaeg");
  }, [img]);

  const handleUpload = async (e) => {
    console.log(img, "image file");
    e.preventDefault();
    if (!validateImageFile(img)) {
      return; // Don't proceed with the upload if the image is invalid
    }

    videoInstance.post('/', { ...inputs, user, tags })
      .then((res) => {
        console.log(res.data, "response data in uploading");
        setOpen(null)
        if (res.status === 200) {
          navigate(`/video/${res.data._id}`);
        }
      })
      .catch((err) => {
        toast.error(err.message || 'An error occurred.');
      })
  }


  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(null)}><CloseIcon /></Close>
        <Title>Edit the video</Title>
        <Label>video:</Label>
        {videoPerc > 0 ? ("Uploading:" + videoPerc + "%") :
          (
            <Input type='file'
              accept='video/*'
              onChange={(e) => setVideo(e.target.files[0])}
            />
          )} 
        <Input type='text' placeholder='Title'
          name='title' value={videos?.title}
          onChange={handleChange}
        />
        <Desc placeholder='Description' rows={8}
          name='desc' value={videos?.desc}
          onChange={handleChange}
        />
        <Input type='text' placeholder='Separate the tags with commas.' value={videos?.tags}
          onChange={handleTags}
        />
        <Label>thumbail image: {imgPerc > 0 ? ("Uploading:" + imgPerc + "%") : "0%"}</Label>
        <>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {selectedImage && (
            <div>

              <Label>Crop the Image:</Label>
              <Input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={scale}
                onChange={handleScaleChange}
              />
              <AvatarEditor
                ref={(ref) => setEditor(ref)}
                image={selectedImage}
                width={270}
                height={180}
                border={5}
                borderRadius={5}
                scale={scale}
              />
              <Button onClick={handleSave}>Save Crop</Button>
            </div>
          )}
           
          {croppedImage && (
            <div>
              <Label>Cropped Image:</Label>
              <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%' }} />
            </div>
          )}

          {fileValidationErr && (
            <p style={{ color: 'red' }}>{fileValidationErr}</p>
          )}
        </>

        <Button onClick={handleUpload}>Upload</Button>
      </Wrapper>
    </Container>
  )
}

export default EditVideo;
