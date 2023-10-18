import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { videoInstance } from '../../../utils/axios';
import { toast } from 'react-toastify';

// Styled components for modals
const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.h2`
  margin: 0;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const Button = styled.button`
  margin-left: 10px;
  `;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  `;

const EditLabel = styled.label`
  margin: 5px 0;
  `;

const EditInput = styled.input`
  padding: 5px;
  margin: 5px 0;
  `;

const EditTextArea = styled.textarea`
  padding: 5px;
  margin: 5px 0;
  `;

const EditVideo = ({ video, updateVideo }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editedVideo, setEditedVideo] = useState({ ...video }); // Local state for edited video data


    const openEditModal = () => setShowEditModal(true);
    const closeEditModal = () => setShowEditModal(false);

    const openDeleteModal = () => setShowDeleteModal(true);
    const closeDeleteModal = () => setShowDeleteModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedVideo({
            ...editedVideo,
            [name]: value,
        });
    }

    
    const handleSave = () => {
        videoInstance.put(`/${editedVideo?._id}`, editedVideo)
            .then((response) => {
                if (response.status === 200) {
                    toast.success("Video data saved successfully");
                    updateVideo(response.data)
                } else {
                    toast.error('Failed to save video data');
                }
                closeEditModal();
            })
            .catch((error) => {
                console.error('Error while saving video data:', error);
            });
    };
    
    const handleDelete = () => {
        videoInstance.delete(`/${editedVideo?._id}`)
        .then((response)=>{
            if(response.status == 200){
                toast.success("video deleted successfully")
                updateVideo({delete :editedVideo})
            }else{
                toast.error("An error occured")
            }
            closeDeleteModal()
        })
        .catch((err)=>{
            toast.error(err.message)
        })
    }

    return (
        <div>
            <button onClick={openEditModal}>Edit </button>
            <button onClick={openDeleteModal}>Delete </button>

            {showEditModal && (
                <ModalWrapper>
                    <ModalContent>
                        <ModalHeader>Edit Video Details</ModalHeader>
                        <EditForm>
                            <EditLabel>Title:</EditLabel>
                            <EditInput
                                type="text"
                                name="title"
                                value={editedVideo.title}
                                onChange={handleInputChange}
                            />
                            <EditLabel>Description:</EditLabel>
                            <EditTextArea
                                name="desc"
                                value={editedVideo.desc}
                                onChange={handleInputChange}
                            />

                        </EditForm>            <ModalButtons>
                            <Button onClick={closeEditModal}>Cancel</Button>
                            <Button onClick={handleSave}>Save</Button>
                        </ModalButtons>
                    </ModalContent>
                </ModalWrapper>
            )}

            {showDeleteModal && (
                <ModalWrapper>
                    <ModalContent>

                        <ModalHeader>Delete Video</ModalHeader>
                        <p>Are you sure you want to delete this video?</p>
                        <ModalButtons>
                            <Button onClick={closeDeleteModal}>Cancel</Button>
                            <Button onClick={handleDelete}>Delete</Button>
                        </ModalButtons>
                    </ModalContent>
                </ModalWrapper>
            )}
        </div>
    );
};

export default EditVideo;