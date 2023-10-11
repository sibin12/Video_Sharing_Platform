import React, { useState } from 'react';
import styled from 'styled-components';
import { videoInstance } from '../../../utils/axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const ReportPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Adjust the z-index as needed to ensure it's above other content */
`;

const ReportForm = styled.form`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const ReportInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const ReportReasons = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const ReportButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`;

function VideoReportButton({videoId}) {
    const {user}= useSelector((state)=>state.auth)
    const [isReportOpen, setReportOpen] = useState(true);
    const [reportReason, setReportReason] = useState('')
    const closeReportPopup = () => {
        setReportOpen(false);
    };

    const handleSubmitReport = (e) => {
        e.preventDefault();
        // Ensure required fields are filled
        if (!reportReason) {
            // Handle error when report reason is not selected
            return;
        }
        videoInstance.post('/report',{videoId,reportReason,user})
        .then((res)=>{
            setReportOpen(false);
            toast.success(res.data)
        })
        .catch((err)=>{
            toast.error(err.message)
        })
    }

    return (
        <>
            {isReportOpen && (
                <ReportPopup>
                    <ReportForm onSubmit={handleSubmitReport}>
                        <h2>Report Video</h2>
                        <p>Please provide a reason for reporting this video:</p>
                        <ReportReasons
                            name="reportReason"
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                        >
                            <option value="inappropriate">Inappropriate content</option>
                            <option value="spam">Spam</option>
                            <option value="violence">Violence</option>
                            {/* Add more report reasons as needed */}
                        </ReportReasons>
                        <ReportInput type="text" placeholder="Any other reason" 
                          onChange={(e)=> setReportReason(e.target.value)}
                        />
                        <ReportButton type="submit">Submit Report</ReportButton>
                        <Button onClick={closeReportPopup}>Close</Button>
                    </ReportForm>
                </ReportPopup>
            )}
        </>
    );
}

export default VideoReportButton;
