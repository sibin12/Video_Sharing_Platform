 import { toast } from "react-toastify";

export  const validateImageFile = (file) => {
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
    return true;
  };