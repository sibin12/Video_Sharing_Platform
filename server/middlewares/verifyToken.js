import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import dotenv from 'dotenv'
dotenv.config()


// export const verifyToken = (req, res, next) => {
//     console.log("verifytoken checking");
// //   const token = req.cookies.access_token;
//   const token = req.token;
//   console.log(token,"token ");
//   if (!token) return next(createError(401, "You are not authenticated!"));

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return next(createError(403, "Token is not valid!"));
//     req.user = user;
//     next()
//   });
// };

 export const verifyToken = (req, res, next) => {
   
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};



export const verifyAdminToken = (req,res,next)=>{
     if(!req.headers.authorization) return res.status(403).json({msg: "not authorized "})

     if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        const token = req.headers.authorization.split(' ')[1]

        jwt.verify(token, process.env.ADMIN_JWT_SECRET, (err,data)=>{
            if(err) return res.status(403).json({msg:" wrong or expired token "})
            
                req.user = data
                next()
        })
     }
}