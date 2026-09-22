document.addEventListener("DOMContentLoaded", async () => {

    const editForm = document.getElementById("editForm");

    const titleInput = document.getElementById("blogTitle");
    const categoryInput = document.getElementById("blogCategory");
    const contentInput = document.getElementById("blogContent");

    const message = document.getElementById("editMessage");

    // Get blog ID from URL
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get("id");

    if (!blogId) {
        message.textContent = "Blog ID is missing.";
        message.style.color = "red";
        return;
    }

    // Get token
    const token = localStorage.getItem("token");

    if (!token) {
        message.textContent = "Please login first.";
        message.style.color = "red";
        return;
    }

    // --------------------------------
    // LOAD EXISTING BLOG
    // --------------------------------

    try {

        const response = await fetch(`/api/blogs/${blogId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message || "Failed to load blog.";
            message.style.color = "red";
            return;
        }

        const blog = data.blog || data;

        titleInput.value = blog.title || "";
        categoryInput.value = blog.category || "";
        contentInput.value = blog.content || "";

    } catch (error) {

        console.error("Error loading blog:", error);

        message.textContent = "Error loading blog.";
        message.style.color = "red";
    }


    // --------------------------------
    // UPDATE BLOG
    // --------------------------------

    editForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const title = titleInput.value.trim();
        const category = categoryInput.value;
        const content = contentInput.value.trim();

        if (!title || !category || !content) {

            message.textContent = "Please fill all fields.";
            message.style.color = "red";

            return;
        }

        try {

            const response = await fetch(`/api/blogs/${blogId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    title,
                    category,
                    content
                })
            });

            const data = await response.json();

            if (!response.ok) {

                message.textContent =
                    data.message || "Failed to update blog.";

                message.style.color = "red";

                return;
            }

            message.textContent = "Blog updated successfully!";
            message.style.color = "green";

            // Go back to dashboard after update
            setTimeout(() => {
                window.location.href = "/dashboard.html";
            }, 1000);

        } catch (error) {

            console.error("Update error:", error);

            message.textContent = "Error updating blog.";
            message.style.color = "red";
        }

    });

});