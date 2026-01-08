import { Router } from "express";
import upload from "../utils/multer.js";
import {
  downloadFile,
  initaliseFileUpload,
  uploadChunk,
  listALlFiles,
} from "../controllers/file.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

router.post("/upload/init",verifyJWT, initaliseFileUpload);
router.post("/upload/chunk", upload.single("chunk"), uploadChunk);
router.get("/download/:fileId", downloadFile);
router.get("/list",verifyJWT, listALlFiles);

export default router;
