import { Router } from "express";
import upload from "../utils/multer.js";
import {
  downloadFile,
  initaliseFileUpload,
  uploadChunk,
  listALlFiles,
} from "../controllers/file.controller.js";

const router = Router();

router.post("/upload/init", initaliseFileUpload);

// Handle OPTIONS preflight for chunk upload
router.options("/upload/chunk", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

router.post(
  "/upload/chunk",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  },
  upload.single("chunk"),
  uploadChunk
);

router.get("/download/:fileId", downloadFile);
router.get("/list", listALlFiles);

export default router;
