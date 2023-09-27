import multer from "multer";
import path from "path";


const ProfileImageUpload = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "server/public/images/profiles");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const CoverPhotoUpload = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "server/public/images/coverPhoto");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  },
});


export const ProfileImage = multer({ storage: ProfileImageUpload });
export const CoverPhoto = multer({ storage: CoverPhotoUpload });




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file,"😊😊😊😊middleware");
      // Determine the destination folder based on the fieldname
      if (file.fieldname === 'ProfileImage') {
        cb(null, 'server/public/images/profile/');
      } else if (file.fieldname === 'coverImage') {
        cb(null, 'server/public/images/coverImage/');
      } else {
        cb('Invalid fieldname', null);
      }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  




  
 export const upload = multer({ storage: storage });