const registerForm =
    document.getElementById("registerForm");

registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();

        const message =
            document.getElementById("message");

        try {

            const response = await fetch(
                "/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                message.textContent =
                    "Registration successful!";

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1000);

            } else {

                message.textContent =
                    data.message ||
                    "Registration failed";

            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to server";

        }

    }
);