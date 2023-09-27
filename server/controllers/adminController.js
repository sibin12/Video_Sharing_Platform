import User from '../models/User.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { createError } from '../error.js'
import Video from '../models/Video.js'
dotenv.config()




// login
export const adminLogin = (async (req, res, next) => {
    console.log("backend of admin login");
    try {

        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            console.log("email not found");
            // throw new Error("Invalid credentials")
            return next(createError(404, "admin not found!"))
        } else if (user.isAdmin) {
            const comparePass = await bcrypt.compare(req.body.password, user.password)
            if (!comparePass) {
                console.log("wrong password");
                return next(createError(404, "Wrong credentials"))
                // throw new Error("Invalid credentials")
            }

            const { password, ...others } = user._doc
            const token = jwt.sign({ id: user._id }, process.env.ADMIN_JWT_SECRET, { expiresIn: '5h' });
            console.log(token, "tokennnnnnnn");

            res.cookie("access_token_admin", token, {
                httpOnly: true,
                // maxAge: 24 * 60 * 60 * 1000,
                secure: false,
                signed: false
            })
                .status(200)
                .json({ others, token })

        } else {
            return next(createError(403, "You are not an Admin"))
        }

        // return res.status(200).json({ others, token })
    } catch (error) {
        next(error)
        // return res.status(500).json(error.message)
    }
})



export const UserDetails = async (req, res, next) => {
    console.log(
        "userdetails fetching "
    );
    try {
        const users = await User.find()
        // console.log(users, "userdetails");
        res.status(200).json(users)
    } catch (error) {
        console.log(error.message);
    }

}

export const VideoDetails = async (req, res, next) => {
    try {
        const videos = await Video.find()
        res.status(200).json(videos)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });

    }
}

export const BlockVideo = async (req, res) => {
    const { videoId } = req.params;
    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        video.isBlocked = true;
        await video.save();

        return res.status(200).json({ message: 'Video blocked successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const UnblockVideo = async (req, res) => {
    const { videoId } = req.params;

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        video.isBlocked = false;
        await video.save();

        return res.status(200).json({ message: 'Video unblocked successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const BlockUser = async (req, res) => {
    const { userId } = req.params;
 console.log(userId,"😊😊😊😊");
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isBlocked = true;
        await user.save();

        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const UnblockUser = async (req, res) => {
    const { userId } = req.params;
    console.log(userId,"😊😊😊😊");

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isBlocked = false;
        await user.save();

        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

