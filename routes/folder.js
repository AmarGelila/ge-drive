import { Router } from "express";
import {
	postNewFolder,
	getFolder,
	deleteFolder,
} from "../controllers/folder.js";
import { newFolderSanitizer } from "../utils/validators.js";
import tryCatch from "../utils/tryCatch.js";

const router = Router();

router.post(
	"/:parentFolderId/new",
	newFolderSanitizer,
	tryCatch(postNewFolder),
);
router.get("/:folderId", tryCatch(getFolder));
router.get("/:folderId", tryCatch(getFolder));
router.delete("/:parentFolderId/:folderId", tryCatch(deleteFolder));

export default router;
