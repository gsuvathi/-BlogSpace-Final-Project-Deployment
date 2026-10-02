document.addEventListener("DOMContentLoaded", function () {

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // Check whether user is logged in
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // Check whether user information exists
    if (!userData) {
        document.getElementById("profileName").textContent = "User information not available";
        document.getElementById("profileEmail").textContent = "User information not available";
        return;
    }

    try {
        const user = JSON.parse(userData);

        document.getElementById("profileName").textContent =
            user.name || "Not available";

        document.getElementById("profileEmail").textContent =
            user.email || "Not available";

    } catch (error) {
        console.error("Error reading user information:", error);

        document.getElementById("profileName").textContent = "Not available";
        document.getElementById("profileEmail").textContent = "Not available";
    }
});


function logoutUser() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "index.html";
}