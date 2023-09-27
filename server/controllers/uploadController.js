import multer from "multer";
import User from "../models/User.js";

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/profile');

    },
    filename: (req, file, cb) => {
        cb(null, req.body.filename);
    }
});

const uploadImage = multer({
    storage: imageStorage
}).single('image');



export const uploadProfileImage = async (req, res) => {
    try {
        uploadImage(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Image upload failed' });
            }
            const userId = req.user.id;

            try {
                let data;
                if (req.body.input == 'profile') {
                    data = { image: req.body.filename }
                } else {
                    data = { coverImage: req.body.filename }
                }

                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    data,
                    { new: true }
                );

                if (!updatedUser) {
                    return res.status(404).json({ message: 'User not found' });
                }

                return res.status(200).json({ msg: 'Image successfully uploaded', user: updatedUser });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error saving image path to user profile' });
            }

        });
    } catch (error) {
        console.log(error);
    }
}

