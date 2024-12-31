// main.js

const BASE_URL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
const NO_AUTH_HEADERS = { 'accept': 'application/json', 'Content-Type': 'application/json' };

// Sign-Up Function
async function signUp(username, fullName, password) {
    const payload = JSON.stringify({
        username: username, // Typically the email or unique username
        fullName: fullName,
        password: password,
    });

    const response = await fetch(BASE_URL + "/api/users", {
        method: "POST",
        headers: NO_AUTH_HEADERS,
        body: payload,
    });

    // Check for "Conflict" status (username already taken)
    if (response.status === 409) {
        console.error("Sign-Up Conflict: Username or email already taken.");
        return "Conflict";
    }

    // Handle any other non-success response
    if (response.status !== 201) {
        console.error("Sign-Up Error:", response.statusText);
        return null;
    }

    // Parse and return the successful response object
    const object = await response.json();
    return object;
}

// Login Function
async function login(username, password) {
    const payload = JSON.stringify({ username, password });
    const response = await fetch(BASE_URL + "/auth/login", {
        method: "POST",
        headers: NO_AUTH_HEADERS,
        body: payload,
    });

    if (response.status !== 200) {
        console.error("Login Error:", response.status, response.statusText);
        return { error: "Invalid credentials or server error." };
    }

    const object = await response.json();
    localStorage.token = object.token; // Save token
    localStorage.username = object.username; // Save username
    return object;
}

// Headers With Authorization
function headersWithAuth() {
    if (!localStorage.token) {
        console.error("Authorization token missing.");
        return NO_AUTH_HEADERS; // Fallback to no auth headers
    }
    return {
        ...NO_AUTH_HEADERS,
        Authorization: `Bearer ${localStorage.token}`,
    };
}

// Fetch Secure List of Messages
async function getMessageList() {
    const LIMIT_PER_PAGE = 1000;
    const OFFSET_PAGE = 0;
    const queryString = `?limit=${LIMIT_PER_PAGE}&offset=${OFFSET_PAGE}`;

    try {
        const response = await fetch(
            BASE_URL + "/api/posts" + queryString,
            {
                method: "GET",
                headers: headersWithAuth(),
            }
        );
        if (!response.ok) {
            console.error("Error fetching messages:", response.statusText);
            return [];
        }
        const object = await response.json();
        return object;
    } catch (error) {
        console.error("Network error while fetching messages:", error);
        return [];
    }
}

// Send a New Post
async function sendText(text) {
    try {
        const response = await fetch(
            BASE_URL + "/api/posts",
            {
                method: "POST",
                headers: headersWithAuth(),
                body: JSON.stringify({ text }),
            }
        );
        if (!response.ok) {
            console.error("Error sending post:", response.statusText);
            return null;
        }
        const object = await response.json();
        return object;
    } catch (error) {
        console.error("Network error while sending post:", error);
        return null;
    }
}

// Delete Like
async function deleteLike(likeId) {
    const response = await fetch(`${BASE_URL}/api/likes/${likeId}`, {
        method: "DELETE",
        headers: headersWithAuth(),
    });

    if (!response.ok) {
        console.error("Failed to delete like:", response.status, response.statusText);
        return null;
    }
    return response.ok;
}

// Send Like
async function sendLike(postId) {
    const response = await fetch(`${BASE_URL}/api/likes`, {
        method: "POST",
        headers: headersWithAuth(),
        body: JSON.stringify({ postId }),
    });

    if (!response.ok) {
        console.error("Failed to send like:", response.status, response.statusText);
        return null;
    }
    return response.ok;
}
