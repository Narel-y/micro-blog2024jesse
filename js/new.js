document.addEventListener("DOMContentLoaded", () => {
    const signUpButton = document.getElementById("signUpButton");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const output = document.getElementById("output");

    signUpButton.addEventListener("click", async (e) => {
        e.preventDefault();

        if (password.value !== confirmPassword.value) {
            output.innerText = "Passwords do not match.";
            return;
        }

        try {
            const result = await signUp(email.value, fullName.value, password.value);

            if (result === "Conflict") {
                output.innerText = "Username or email already taken.";
                return;
            }

            if (!result) {
                output.innerText = "An error occurred. Please try again.";
                return;
            }

            output.innerText = "Sign-up successful! Redirecting...";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } catch (error) {
            console.error("Error during Sign-Up:", error);
            output.innerText = "An unexpected error occurred. Please try again.";
        }
    });
});
