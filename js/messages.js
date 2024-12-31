/*
{
    "_id": "675c852615fee0925c8d2e52",
    "text": "First Post",
    "username": "GurjotS",
    "createdAt": "2024-12-13T19:04:06.252Z",
    "likes": [
      {
        "_id": "675c8a3715fee0925c8d2e9e",
        "postId": "675c852615fee0925c8d2e52",
        "username": "buttercupx",
        "createdAt": "2024-12-13T19:25:43.034Z"
      }
    ]
  },
*/
// function getMessage(m) {
//     return `
//         <div data-post_id="${m._id}" class="message">
//             FROM:  ${m.username}<br>\n    
//             WHEN:  ${m.createdAt}<br>\n    
//             TEXT:  ${m.text}<br>\n
//             LIKES: ${m.likes.length}

//         </div>
//     `;
// }
function createMessageElement(message) {
    const container = document.createElement("div");
    container.setAttribute("class", "message");
    container.dataset.post_id = message._id;
  
    container.innerHTML = `
      <hr>
      <div class="message-header">
        <strong class="message-username">${message.username}</strong>
        <div class="message-time">
          ${new Date(message.createdAt).toLocaleString()}
        </div>
      </div>
      <p>${message.text}</p>
      <div class="message-footer">
        <button class="like-button"></button>
        <span id="like-count-${message._id}">${message.likes.length}</span>
      </div>
    `;
  
    const likeButton = container.querySelector(".like-button");
    let isLiked = message.likes.some(
      (like) => like.username === localStorage.username
    );
    likeButton.innerHTML = isLiked ? "❤️" : "🤍";
  
    likeButton.addEventListener("click", async () => {
      try {
        isLiked = message.likes.some(
          (like) => like.username === localStorage.username
        );
  
        if (isLiked) {
          const like = message.likes.find(
            (like) => like.username === localStorage.username
          );
          if (!like) {
            console.error("Like not found for this user.");
            return;
          }
          console.log("Like ID to delete:", like._id);
          const result = await deleteLike(like._id);
          if (!result) {
            console.error("Failed to delete like.");
            return;
          }
        } else {
          const result = await sendLike(message._id);
          if (!result) {
            console.error("Failed to send like.");
            return;
          }
        }
  
        const updatedMessage = await fetchUpdatedMessage(message._id);
        message = updatedMessage;
        updateMessageLikes(updatedMessage);
      } catch (error) {
        console.error("Error updating like/unlike:", error);
      }
    });
  
    const footer = container.querySelector(".message-footer");
    footer.appendChild(likeButton);
    return container;
  }
  
  function updateMessageLikes(updatedMessage) {
    const likeCountElement = document.getElementById(
      `like-count-${updatedMessage._id}`
    );
    const likeButton = document.querySelector(
      `div[data-post_id="${updatedMessage._id}"] .like-button`
    );
  
    if (likeCountElement && likeButton) {
      likeCountElement.innerText = updatedMessage.likes.length;
      const isLiked = updatedMessage.likes.some(
        (like) => like.username === localStorage.username
      );
      likeButton.innerHTML = isLiked ? "❤️" : "🤍";
    }
  }
  
  async function fetchUpdatedMessage(messageId) {
    try {
      const messages = await getMessageList();
      return messages.find((m) => m._id === messageId);
    } catch (error) {
      console.error("Error fetching updated message:", error);
      return null;
    }
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const output = document.getElementById("output");
      const messages = await getMessageList();
  
      if (!messages || messages.length === 0) {
        console.error("No messages found or API returned an empty array.");
        output.innerHTML = "<p>No messages to display.</p>";
        return;
      }
  
      console.log("Fetched messages:", messages);
      output.innerHTML = "";
      messages.forEach((message) => {
        output.appendChild(createMessageElement(message));
      });
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn"); // or "logout" if that's your ID
  
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        // Remove user-related data from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("profilePic");
        // ... Remove any other saved items if relevant
  
        // Redirect to login page
        window.location.href = "index.html";
      });
    }
  });
  