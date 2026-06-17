import { Router } from "express";
import { getMain } from "../controllers/main.js";
import tryCatch from "../utils/tryCatch.js";

const router = Router();

router.get("/", tryCatch(getMain));

export default router;

/*
    display folders and files
    CRUD folder
    Upload file

        ******
    Get Folder
        query( folderID )

*/
