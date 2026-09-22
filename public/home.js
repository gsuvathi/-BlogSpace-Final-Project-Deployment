document.addEventListener("DOMContentLoaded", function () {

    loadLatestBlogs();

});


async function loadLatestBlogs() {

    const blogContainer =
        document.getElementById("latestBlogs");

    if (!blogContainer) {

        console.error(
            "latestBlogs element not found."
        );

        return;
    }


    blogContainer.innerHTML =
        "<p>Loading blogs...</p>";


    try {

        const response =
            await fetch("/api/blogs");


        const data =
            await response.json();


        console.log(
            "Blogs API response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load blogs"
            );

        }


        // API may return an array
        // or an object containing blogs

        const blogs =
            Array.isArray(data)
                ? data
                : data.blogs || data.data || [];


        blogContainer.innerHTML = "";


        if (blogs.length === 0) {

            blogContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No blogs yet</h3>

                    <p>
                        Be the first to share your story.
                    </p>

                    <a
                        href="create-blog.html"
                        class="btn">
                        Create Blog
                    </a>
                </div>
            `;

            return;
        }


        // Show latest 6 blogs

        blogs
            .slice(0, 6)
            .forEach(function (blog) {

                const card =
                    document.createElement("article");

                card.className =
                    "blog-card";


                const title =
                    escapeHTML(
                        blog.title || "Untitled Blog"
                    );


                const content =
                    escapeHTML(
                        blog.content || ""
                    );


                const author =
                    typeof blog.author === "object"
                        ? (
                            blog.author.name ||
                            "Unknown"
                        )
                        : (
                            blog.author ||
                            "Unknown"
                        );


                const date =
                    blog.createdAt
                        ? new Date(
                            blog.createdAt
                        ).toLocaleDateString()
                        : "";


                const category =
                    blog.category ||
                    "General";


                card.innerHTML = `

                    <span class="category">
                        ${escapeHTML(category)}
                    </span>

                    <h2>
                        ${title}
                    </h2>

                    <p class="author">
                        By ${escapeHTML(author)}
                    </p>

                    <p class="content">
                        ${content.substring(0, 150)}
                        ${content.length > 150 ? "..." : ""}
                    </p>

                    <small>
                        ${date}
                    </small>

                    <br>

                    <a
                        href="blog-details.html?id=${encodeURIComponent(blog._id || blog.id)}"
                        class="read-more">
                        Read More →
                    </a>

                `;


                blogContainer.appendChild(card);

            });


    } catch (error) {

        console.error(
            "Error loading blogs:",
            error
        );


        blogContainer.innerHTML = `

            <div class="error">

                <h3>
                    Unable to load blogs
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}