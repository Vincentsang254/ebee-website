/** @format */

import express from "express";
import { imageUpload } from "../controllers/imageController.js";


const router = express.Router();

router.post("/image-upload", imageUpload);

export default router;
