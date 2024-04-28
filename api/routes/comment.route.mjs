import express from "express";
import { addComment,getComments} from "../controllers/comment.controller.mjs";
import { verifyToken } from "../utils/verifyUser.mjs";

const router=express.Router();

router.post("/addcomment",verifyToken,addComment);
router.get("/getAllComments/:postId",getComments)

export default router;