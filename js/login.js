document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const output = document.getElementById("output");

    // Handle Form Submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent page refresh on form submission

        try {
            // Call the login function from main.js
            const result = await login(username.value, password.value);

            // Handle unsuccessful login
            if (!result || !result.hasOwnProperty("statusCode") || result.statusCode !== 200) {
                output.innerText = "Login Failed. Please check your credentials.";
                return;
            }

            // Successful login
            output.innerText = "Login successful! Redirecting...";
            setTimeout(() => {
                window.location.href = "messages.html"; // Redirect to the messages page
            }, 2000);
        } catch (error) {
            console.error("Error during login:", error);
            output.innerText = "An error occurred. Please try again.";
        }
    });
});
