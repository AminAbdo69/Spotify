// refresh token

function refreshToken() {
  fetch("https://localhost:7259/api/Auth/refreshToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies in the request
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok") {
        console.log("Token refreshed successfully:", data.message);
      } else {
        console.error("Error refreshing token:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Call refreshToken function every 15 minutes (900,000 milliseconds)
setInterval(refreshToken, 300000);

// Optionally, call it immediately on page load
refreshToken();

const data = JSON.parse(localStorage.getItem("selected-album"));

document.querySelector(".album-title").innerHTML = data.title;
const albumImage = document.getElementById("albumImage");
albumImage.src = data.image;

document.querySelector(".album-info .artist-name").innerHTML = data.artist;

console.log(data.image);
const artistImage = document.getElementById("artistImage");
artistImage.src = data.artistPic;

document.title = data.title;
