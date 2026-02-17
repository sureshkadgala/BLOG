import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog,
    );

    const imageFile = req.file;

    // check if all fields are present
    if (!title || !description || !category || !imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    //upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blog",
    });

    // optimization through image transformation
    const optimizedImageUrl = imagekit.url({
      path: uploadResponse.filePath, //response
      transformation: [
        { quality: "auto" }, // Auto compression
        { format: "webp" }, // Convert to modern formate
        { width: "1280" }, // Width resizing
      ],
    });

    const image = optimizedImageUrl;

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });

    // Delete temp file (IMPORTANT)
    fs.unlink(imageFile.path, () => {}); /// this one

    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//GET ALL BLOGS
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({
      createdAt: -1,
    });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//GET BY ID
export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res
        .status(400)
        .json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE BY ID
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res
        .status(400)
        .json({ success: false, message: "Blog not found" });
    }

    //delete all comments associated with this blog
    await Comment.deleteMany({ blog: id });

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Toggle Published
export const togglePublished = async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.json({ success: true, message: "Blog published status toggled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;

    if (!blog || !name || !content) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const addedComment = await Comment.create({ blog, name, content });
    res.json({
      success: true,
      message: "Comment added for review",
      addedComment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//GET ALL COMMENTS OF INDIVIDUAL BLOG
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params; //req.body

    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({
      createdAt: -1,
    });

    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
