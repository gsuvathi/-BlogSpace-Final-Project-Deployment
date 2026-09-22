// ========================================
// BLOGSPACE - DASHBOARD.JS
// ========================================


// ========================================
// GET BLOGS
// ========================================

function getBlogs() {

    return JSON.parse(
        localStorage.getItem("blogPosts")
    ) || [];

}


// ========================================
// SAVE BLOGS
// ========================================

function saveBlogs(blogs) {

    localStorage.setItem(
        "blogPosts",
        JSON.stringify(blogs)
    );

}


// ========================================
// LOAD DASHBOARD
// ========================================

function loadDashboard() {

    const blogList =
        document.getElementById(
            "dashboardBlogList"
        );

    if (!blogList) {
        return;
    }


    const currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );


    // Check login

    if (!currentUser) {

        window.location.href =
            "login.html";

        return;
    }


    // Welcome message

    const welcomeUser =
        document.getElementById(
            "welcomeUser"
        );


    if (welcomeUser) {

        welcomeUser.textContent =
            "Welcome back, " +
            currentUser.name +
            "!";

    }


    // Get all blogs

    const allBlogs =
        getBlogs();


    // Get only current user's blogs

    const userBlogs =
        allBlogs.filter(
            function (blog) {

                return (
                    blog.authorEmail ===
                    currentUser.email
                );

            }
        );


    // Total blogs

    const totalBlogs =
        document.getElementById(
            "totalBlogs"
        );


    if (totalBlogs) {

        totalBlogs.textContent =
            userBlogs.length;

    }


    // Display blogs

    displayBlogs(userBlogs);

}


// ========================================
// DISPLAY BLOGS
// ========================================

function displayBlogs(blogs) {

    const blogList =
        document.getElementById(
            "dashboardBlogList"
        );


    if (!blogList) {
        return;
    }


    // Clear old content

    blogList.innerHTML = "";


    // No blogs

    if (blogs.length === 0) {

        blogList.innerHTML = `

            <div class="empty-state">

                <h3>
                    No blogs yet
                </h3>

                <p>
                    Create your first blog and share your story.
                </p>

                <br>

                <a
                    href="create-blog.html"
                    class="primary-btn">

                    Create Blog

                </a>

            </div>

        `;

        return;
    }


    // Display each blog

    blogs.forEach(
        function (blog) {

            const blogElement =
                document.createElement(
                    "div"
                );


            blogElement.className =
                "dashboard-blog";


            blogElement.innerHTML = `

                <div>

                    <span class="category">
                        ${escapeHTML(
                            blog.category || "General"
                        )}
                    </span>


                    <h3>
                        ${escapeHTML(
                            blog.title
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            (blog.content || "").substring(
                                0,
                                120
                            )
                        )}...
                    </p>


                    <small>
                        Published:
                        ${escapeHTML(
                            blog.date || ""
                        )}
                    </small>

                </div>


                <div class="dashboard-blog-actions">

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editBlog(${blog.id})">

                        Edit

                    </button>


                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deleteBlog(${blog.id})">

                        Delete

                    </button>

                </div>

            `;


            blogList.appendChild(
                blogElement
            );

        }
    );

}


// ========================================
// SEARCH BLOGS
// ========================================

function searchBlogs() {

    const searchInput =
        document.getElementById(
            "searchBlogs"
        );


    if (!searchInput) {
        return;
    }


    const searchText =
        searchInput.value
        .toLowerCase()
        .trim();


    const currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );


    if (!currentUser) {
        return;
    }


    const allBlogs =
        getBlogs();


    const userBlogs =
        allBlogs.filter(
            function (blog) {

                return (
                    blog.authorEmail ===
                    currentUser.email
                );

            }
        );


    const filteredBlogs =
        userBlogs.filter(
            function (blog) {

                const title =
                    (blog.title || "")
                    .toLowerCase();


                const category =
                    (blog.category || "")
                    .toLowerCase();


                const content =
                    (blog.content || "")
                    .toLowerCase();


                return (

                    title.includes(
                        searchText
                    )

                    ||

                    category.includes(
                        searchText
                    )

                    ||

                    content.includes(
                        searchText
                    )

                );

            }
        );


    displayBlogs(
        filteredBlogs
    );

}


// ========================================
// DELETE BLOG
// ========================================

function deleteBlog(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this blog?"
        );


    if (!confirmed) {
        return;
    }


    let blogs =
        getBlogs();


    // Remove selected blog

    blogs =
        blogs.filter(
            function (blog) {

                return blog.id !== id;

            }
        );


    // Save updated blogs

    saveBlogs(
        blogs
    );


    // Show success message

    alert(
        "Blog deleted successfully!"
    );


    // Reload dashboard

    loadDashboard();

}


// ========================================
// EDIT BLOG
// ========================================

function editBlog(id) {

    const blogs =
        getBlogs();


    const blog =
        blogs.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!blog) {

        alert(
            "Blog not found."
        );

        return;
    }


    // Edit title

    const newTitle =
        prompt(
            "Enter new blog title:",
            blog.title
        );


    if (newTitle === null) {
        return;
    }


    // Check title

    if (
        newTitle.trim().length < 5
    ) {

        alert(
            "Blog title must contain at least 5 characters."
        );

        return;
    }


    // Edit content

    const newContent =
        prompt(
            "Enter new blog content:",
            blog.content
        );


    if (newContent === null) {
        return;
    }


    // Check content

    if (
        newContent.trim().length < 20
    ) {

        alert(
            "Blog content must contain at least 20 characters."
        );

        return;
    }


    // Update blog

    blog.title =
        newTitle.trim();


    blog.content =
        newContent.trim();


    // Save updated blog list

    saveBlogs(
        blogs
    );


    // Success message

    alert(
        "Blog updated successfully!"
    );


    // Reload dashboard

    loadDashboard();

}


// ========================================
// LOGOUT
// ========================================

function logoutUser() {

    localStorage.removeItem(
        "currentUser"
    );


    window.location.href =
        "index.html";

}


// ========================================
// HTML SECURITY HELPER
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

        console.log(
            "BlogSpace Dashboard loaded successfully!"
        );

    }
);