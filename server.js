const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

/* =========================
   STATIC FILES
========================= */

app.use(express.static(path.join(__dirname, "public")));


/* =========================
   USER MODEL
========================= */

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);


/* =========================
   BLOG MODEL
========================= */

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        content: {
            type: String,
            required: true
        },

        author: {
            type: String,
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Blog = mongoose.model("Blog", blogSchema);


/* =========================
   JWT AUTHENTICATION
========================= */

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            message: "Authorization token is required"
        });
    }

    const parts = authHeader.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer"
    ) {

        return res.status(401).json({
            message: "Invalid authorization format"
        });
    }

    const token = parts[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        console.error(
            "JWT error:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}


/* =========================
   HOME PAGE
========================= */

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "home.html"
        )
    );

});


/* =========================
   REGISTER
========================= */

app.post("/api/auth/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });
        }


        const existingUser =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });
        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const user = new User({

            name,

            email:
                email.toLowerCase(),

            password:
                hashedPassword

        });


        await user.save();


        res.status(201).json({

            message:
                "Registration successful"

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        res.status(500).json({

            message:
                "Registration failed"

        });
    }

});


/* =========================
   LOGIN
========================= */

app.post("/api/auth/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required"

            });
        }


        const user =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (!user) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });
        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });
        }


        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing"
            );

            return res.status(500).json({

                message:
                    "JWT_SECRET is not configured"

            });
        }


        const token =
            jwt.sign(

                {
                    userId:
                        user._id.toString(),

                    name:
                        user.name,

                    email:
                        user.email
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "24h"
                }
            );


        res.json({

            message:
                "Login successful",

            token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email
            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        res.status(500).json({

            message:
                "Login failed"

        });
    }

});


/* =========================
   GET ALL BLOGS
========================= */

app.get("/api/blogs", async (req, res) => {

    try {

        const blogs =
            await Blog.find()
                .sort({
                    createdAt: -1
                });


        res.json(blogs);


    } catch (error) {

        console.error(
            "Get blogs error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to get blogs"

        });
    }

});


/* =========================
   GET SINGLE BLOG
========================= */

app.get("/api/blogs/:id", async (req, res) => {

    try {

        const blog =
            await Blog.findById(
                req.params.id
            );


        if (!blog) {

            return res.status(404).json({

                message:
                    "Blog not found"

            });
        }


        res.json(blog);


    } catch (error) {

        console.error(
            "Get blog error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to get blog"

        });
    }

});


/* =========================
   CREATE BLOG
========================= */

app.post(
    "/api/blogs",
    authenticateToken,
    async (req, res) => {

        try {

            console.log(
                "================================="
            );

            console.log(
                "CREATE BLOG REQUEST RECEIVED"
            );

            console.log(
                "User:",
                req.user
            );

            console.log(
                "Body:",
                req.body
            );

            console.log(
                "================================="
            );


            const {
                title,
                category,
                content
            } = req.body;


            if (
                !title ||
                !category ||
                !content
            ) {

                return res.status(400).json({

                    message:
                        "Title, category and content are required"

                });
            }


            const user =
                await User.findById(
                    req.user.userId
                );


            if (!user) {

                return res.status(404).json({

                    message:
                        "User not found"

                });
            }


            const blog =
                new Blog({

                    title:
                        title.trim(),

                    category:
                        category.trim(),

                    content:
                        content.trim(),

                    author:
                        user.name,

                    userId:
                        user._id

                });


            await blog.save();


            console.log(
                "BLOG SAVED SUCCESSFULLY"
            );

            console.log(
                "Blog ID:",
                blog._id
            );


            res.status(201).json({

                message:
                    "Blog created successfully",

                blog:
                    blog

            });


        } catch (error) {

            console.error(
                "CREATE BLOG ERROR:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to create blog",

                error:
                    error.message

            });
        }

    }
);


/* =========================
   UPDATE BLOG
========================= */

app.put(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                title,
                content
            } = req.body;


            /* -------------------------
               VALIDATE DATA
            ------------------------- */

            if (!title || !content) {

                return res.status(400).json({

                    message:
                        "Title and content are required"

                });
            }


            /* -------------------------
               FIND BLOG
            ------------------------- */

            const blog =
                await Blog.findById(
                    req.params.id
                );


            if (!blog) {

                return res.status(404).json({

                    message:
                        "Blog not found"

                });
            }


            /* -------------------------
               CHECK BLOG OWNER
            ------------------------- */

            if (
                blog.userId.toString() !==
                req.user.userId.toString()
            ) {

                return res.status(403).json({

                    message:
                        "You can update only your own blog"

                });
            }


            /* -------------------------
               UPDATE BLOG
            ------------------------- */

            blog.title =
                title.trim();

            blog.content =
                content.trim();


            await blog.save();


            /* -------------------------
               RESPONSE
            ------------------------- */

            res.status(200).json({

                message:
                    "Blog updated successfully",

                blog:
                    blog

            });


        } catch (error) {

            console.error(
                "Update blog error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to update blog",

                error:
                    error.message

            });
        }

    }
);


/* =========================
   DELETE BLOG
========================= */

app.delete(
    "/api/blogs/:id",
    authenticateToken,
    async (req, res) => {

        try {

            /* -------------------------
               FIND BLOG
            ------------------------- */

            const blog =
                await Blog.findById(
                    req.params.id
                );


            if (!blog) {

                return res.status(404).json({

                    message:
                        "Blog not found"

                });
            }


            /* -------------------------
               CHECK BLOG OWNER
            ------------------------- */

            if (
                blog.userId.toString() !==
                req.user.userId.toString()
            ) {

                return res.status(403).json({

                    message:
                        "You can delete only your own blog"

                });
            }


            /* -------------------------
               DELETE BLOG
            ------------------------- */

            await Blog.findByIdAndDelete(
                req.params.id
            );


            res.json({

                message:
                    "Blog deleted successfully"

            });


        } catch (error) {

            console.error(
                "Delete blog error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to delete blog",

                error:
                    error.message

            });
        }

    }
);


/* =========================
   ERROR HANDLER
========================= */

app.use(
    (err, req, res, next) => {

        console.error(
            "Server error:",
            err
        );


        res.status(500).json({

            message:
                "Internal server error"

        });

    }
);


/* =========================
   ENVIRONMENT CHECK
========================= */

if (!process.env.MONGO_URI) {

    console.error(
        "ERROR: MONGO_URI is missing in .env"
    );

    process.exit(1);
}


if (!process.env.JWT_SECRET) {

    console.error(
        "ERROR: JWT_SECRET is missing in .env"
    );

    process.exit(1);
}


/* =========================
   MONGODB CONNECTION
========================= */

mongoose
    .connect(
        process.env.MONGO_URI
    )

    .then(() => {

        console.log(
            "MongoDB connected successfully"
        );


        const PORT =
            process.env.PORT || 3000;


        app.listen(
            PORT,
            () => {

                console.log(
                    `Blog Application running on port ${PORT}`
                );

                console.log(
                    `Open: http://localhost:${PORT}/home.html`
                );

            }
        );

    })

    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error.message
        );

        process.exit(1);

    });