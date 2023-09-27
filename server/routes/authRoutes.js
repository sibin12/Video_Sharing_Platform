import express from "express";
import { googleAuth, login, register } from "../controllers/authController.js";

const router = express.Router();

//create a user
router.post("/register", register)

//login a user
router.post('/login', login)

//login with google
router.post('/google',googleAuth)

export default router;

