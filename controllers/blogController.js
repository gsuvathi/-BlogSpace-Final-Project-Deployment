const Blog = require("../models/Blog");

// ==========================================
// GET ALL BLOGS
// ==========================================

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .sort({ createdAt: -1 });

        res.status(200).json(blogs);

    } catch (error) {
        console.error("Get blogs error:", error);

        res.status(500).json({
            message: "Failed to fetch blogs",
            error: error.message
        });
    }
};


// ==========================================
// GET SINGLE BLOG
// ==========================================

const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.status(200).json(blog);

    } catch (error) {
        console.error("Get blog error:", error);

        res.status(500).json({
            message: "Failed to fetch blog",
            error: error.message
        });
    }
};


// ==========================================
// CREATE BLOG
// ==========================================

const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const blog = new Blog({
            title: title,
            content: content
        });

        const savedBlog = await blog.save();

        res.status(201).json({
            message: "Blog created successfully",
            blog: savedBlog
        });

    } catch (error) {
        console.error("Create blog error:", error);

        res.status(500).json({
            message: "Failed to create blog",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE BLOG
// ==========================================

const updateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        blog.title = title;
        blog.content = content;

        await blog.save();

        res.status(200).json({
            message: "Blog updated successfully",
            blog: blog
        });

    } catch (error) {
        console.error("Update blog error:", error);

        res.status(500).json({
            message: "Failed to update blog",
            error: error.message
        });
    }
};


// ==========================================
// DELETE BLOG
// ==========================================

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.status(200).json({
            message: "Blog deleted successfully"
        });

    } catch (error) {
        console.error("Delete blog error:", error);

        res.status(500).json({
            message: "Failed to delete blog",
            error: error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
};