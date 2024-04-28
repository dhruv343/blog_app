import Comment from "../db/comment.model.mjs"
import { errorHandler } from "../utils/error.mjs"

export const addComment = async (req, res, next) => {

    const { content, userId, postId } = req.body

    if (req.user.id != userId) {
        next(errorHandler(403, "You are not allowed to comment"))
    }
    try {
        let comment = new Comment({
            content, postId, userId
        })
        let result = await comment.save()
        res.send(result);
    } catch (error) {
        next(error)
    }
}

export const getComments=async(req,res,next)=>{
    try {
        const result=await Comment.find({postId:req.params.postId}).sort({ createdAt: -1 })
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}