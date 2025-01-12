/** @format */

import express from "express";
import { imageUpload } from "../controllers/imageController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";


const router = express.Router();

router.post("/image-upload",verifyToken, imageUpload);

export default router;
