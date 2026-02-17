import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  togglePublished,
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

// blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.post("/add", upload.single("image"), addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
// blogRouter.post("/delete", auth, deleteBlogById);
// blogRouter.post("/:id", auth, deleteBlogById);
blogRouter.post("/:id", deleteBlogById);
// blogRouter.post("/toggle-publish", auth, togglePublished);
blogRouter.post("/toggle-publish", togglePublished);

// blogRouter.post("/comments", getBlogComments);
blogRouter.post("/:blogId/comments", getBlogComments);
blogRouter.post("/add-comment", addComment);

export default blogRouter;
