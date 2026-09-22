const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const message = document.getElementById("message");

    if (!email || !password) {
        message.textContent = "Please enter email and password";
        return;
    }

    try {

        const response = await fetch("/api/auth/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        console.log("Login response:", data);

        if (response.ok) {

            // SAVE TOKEN
            localStorage.setItem("token", data.token);

            // SAVE USER
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            message.textContent = "Login successful!";

            // REDIRECT TO HOME PAGE
            setTimeout(() => {
                window.location.href = "home.html";
            }, 500);

        } else {

            message.textContent =
                data.message || "Login failed";

        }

    } catch (error) {

        console.error("Login error:", error);

        message.textContent =
            "Unable to connect to server";

    }

});