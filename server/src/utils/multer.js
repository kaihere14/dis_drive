import multer from "multer";
import fs from "fs";
import path from "path";
import os from "os";

// Use /tmp for serverless environments, otherwise use local uploads folder
const uploadDir = process.env.AWS_LAMBDA_FUNCTION_NAME
  ? path.join(os.tmpdir(), "uploads")
  : path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
