import User from '../models/User.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { createError } from '../error.js'
dotenv.config()


//register
export const register = (async (req, res, next) => {
    try {
        console.log("register a user",req.body);
        const username = await User.findOne({ username: req.body.username })
        if (username) {
            console.log("user exists");
            return next(createError(404, "This username is taken"))
        }
        const isExisting = await User.findOne({ email: req.body.email })
        if (isExisting) {
            return next(createError(401, "This email is taken"))
        }
        const hashPassword = await bcrypt.hash(req.body.password, 10)

        const newUser = await User.create({ ...req.body, password: hashPassword })
        const { password, ...others } = newUser._doc
        const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, { expiresIn: '5h' })

        console.log(token,"tokennnnn", others);
        
        res.cookie("access_token", token,{
            httpOnly: false,
        })
        .status(200)
        .json({others, token})
        // return res.status(201).json({ others})
    } catch (error) {
        next(error)
        // return res.status(500).json(error.message)
    }

})

// login
export const login = (async (req, res, next) => {
    try {
        
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            console.log("email not found");
            // throw new Error("Invalid credentials")
            return next(createError(404, "User not found!"))
        }

        if(user.isBlocked){
            return next(createError(403,"your account is blocked by admin"))
        }
        const comparePass = await bcrypt.compare(req.body.password, user.password)
        if (!comparePass) {
            console.log("wrong password");
            return next(createError(404, "Wrong credentials"))
            // throw new Error("Invalid credentials")
        }

        const { password, ...others } = user._doc
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
        console.log(token, "tokennnnnnnn");
        
        res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            signed: false
        })
        .status(200)
        .json({others,token})
    
        // return res.status(200).json({ others, token })
    } catch (error) {
        next(error)
        // return res.status(500).json(error.message)
    }
})

//signup with google
export const googleAuth = (async (req, res) => {
    try {

        const isExisting = await User.findOne({ email: req.body.email })
        if (isExisting) {
            const token = jwt.sign({ id: isExisting._id, isAdmin: isExisting.isAdmin }, process.env.JWT_SECRET, { expiresIn: '5h' })
            return res.status(201).json({ isExisting, token })
        } else {
            const newUser = new User({
                ...req.body,
                fromGoogle: true
            })
            const savedUser = await newUser.save()
            const token = jwt.sign({ id: savedUser._id, isAdmin: savedUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: '5h' })
            return res.status(201).json({ savedUser, token })
        }

    } catch (error) {
        return res.status(500).json(error.message)
    }

})

