console.log("create-blog.js loaded successfully");

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM loaded");

    const form = document.getElementById("createBlogForm");

    if (!form) {
        console.error("Create Blog form NOT found");
        return;
    }

    console.log("Create Blog form found");

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("CREATE BLOG SUBMIT STARTED");

        const title = document.getElementById("blogTitle").value.trim();
        const category = document.getElementById("blogCategory").value;
        const content = document.getElementById("blogContent").value.trim();

        console.log("Title:", title);
        console.log("Category:", category);
        console.log("Content:", content);

        const token = localStorage.getItem("token");

        console.log("Token exists:", !!token);

        if (!token) {
            alert("Please login first.");
            window.location.href = "/login.html";
            return;
        }

        try {

            const response = await fetch("/api/blogs", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify({
                    title: title,
                    category: category,
                    content: content
                })
            });

            console.log("Response status:", response.status);

            const data = await response.json();

            console.log("Server response:", data);

            if (!response.ok) {
                alert(data.message || "Failed to create blog");
                return;
            }

            alert("Blog published successfully!");

            window.location.href = "/dashboard.html";

        } catch (error) {

            console.error("Create blog error:", error);

            alert("Server error. Check the console.");
        }
    });
});