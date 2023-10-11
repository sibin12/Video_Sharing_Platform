
import React, { useEffect, useState } from 'react';
import './VideoDetails.scss'; // Import the SCSS file for styling
import { toast } from 'react-toastify';
import { adminInstance } from '../../../utils/axios';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ReportsModal from '../../../components/admin/modal/Reports';
import { block } from '../../../redux/videoSlice';
import { useDispatch } from 'react-redux';
function VideoDetails() {
  const dispatch = useDispatch()
 const [videos, setVideos] = useState([])
 const [viewReport, setViewReport] = useState(false)
 const [selectedVideoReports, setSelectedVideoReports] = useState([]);
 const [isReportsModalOpen, setReportsModalOpen] = useState(false); // State for the modal

  useEffect( ()=>{
     const fetchData = async ()=>{

         try {
             const response = await adminInstance.get('/videos')
             if(!response.status === 200){
                 throw new Error('Network response was not ok.')
                }
                const result = await response.data
                setVideos(result)
                console.log(videos,"response of videos");
            } catch (error) {
                toast.error(error.message ||"an error occured")
            }
        }
        fetchData();
  },[]) 


  const toggleBlock = async (videoId) => {
    try {
      const videoToToggle = videos.find((video) => video._id === videoId);
      const isBlocked = videoToToggle?.isBlocked;

      if (isBlocked) {
        await adminInstance.put(`/videos/${videoId}/unblock`);
      } else {
        await adminInstance.put(`/videos/${videoId}/block`);
      }

      dispatch(block()) ;

      setVideos((prevDetails) =>
        prevDetails.map((video) =>
          video._id === videoId ? { ...video, isBlocked: !isBlocked } : video
        )
      );

    } catch (error) {
      // Handle errors, such as displaying an error message
      console.error('Error toggling block/unblock:', error);
    }
  };
  const viewReports = (reports) => {
    setSelectedVideoReports(reports);
    setReportsModalOpen(true);
  };

  const closeReportsModal = () => {
    setReportsModalOpen(false);
  };

  const viewVideo = (id)=>{
     window.open(`http://localhost:3000/video/${id}`)
  }


  return (
    <div className="video-details">
      <table>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Description</th>
            <th>Author</th>
            <th>Views</th>
            <th>Date</th>
            <th>Reports</th>
            <th>Blocked</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video._id}>
              <td>
                <img src={video.imgUrl} alt={video.title} width="120" height="80"
                  onClick={(()=> viewVideo(video._id))}
                />
              </td>
              <td>{video.title}</td>
              <td className='desc'>{video.desc}</td>
              <td>{video?.userId?.username || "sibin"}</td>
              <td>{video?.views?.length}</td>
              <td>{new Date(video?.createdAt).toLocaleDateString()}</td>
              <td>
                {video?.reports?.length}{' '}
                <ExpandCircleDownIcon onClick={() => viewReports(video.reports)} />
              </td>
               <td>
                <button onClick={() => toggleBlock(video._id)} style={{background: video?.isBlocked ? "blue":"red"}}>
                  {video?.isBlocked ? 'Unblock' : 'Block'} 
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReportsModal
        isOpen={isReportsModalOpen}
        onClose={closeReportsModal}
        reports={selectedVideoReports}
      />
    </div>
  );
}

export default VideoDetails;
