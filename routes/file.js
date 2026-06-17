import { Router } from "express";
import multer from "multer";
import prisma from "../lib/prisma.js";
import {
	GetFile,
	postUploadFile,
	postDownloadFile,
} from "../controllers/file.js";
import tryCatch from "../utils/tryCatch.js";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/:fileId", tryCatch(GetFile));
router.post(
	"/:parentFolderId/upload-file",
	tryCatch(upload.single("file")),
	tryCatch(postUploadFile),
);
router.post("/:fileId/download/:supabaseName", tryCatch(postDownloadFile));
export default router;

/*
    Post file upload




    Get file details
    Post file download
*/
