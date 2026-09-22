const express = require("express");
const router = express.Router();

const {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

// Get all blogs
router.get("/", getBlogs);

// Get one blog
router.get("/:id", getBlogById);

// Create a new blog
router.post("/", createBlog);

// Update a blog
router.put("/:id", updateBlog);

// Delete a blog
router.delete("/:id", deleteBlog);

module.exports = router;