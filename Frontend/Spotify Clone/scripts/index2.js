var theusername = document.querySelector(".topbar .navbar .username");
theusername.innerHTML = sessionStorage.getItem("username");
var Token = sessionStorage.getItem("myToken");
console.log(" Token:", Token);

var username = sessionStorage.getItem("username");
console.log(username);

document
  .getElementById("createPlaylist")
  .addEventListener("click", function () {
    var hintContainer = document.querySelector(".hint-container");
    hintContainer.style.display = "block"; // Show the hint-container
  });

// document
//   .getElementById("playlistForm")
//   .addEventListener("submit", function (event) {
//     event.preventDefault(); // Prevent the default form submission

//     var playlistname = document.getElementById("playlistname").value;
//     var playlistcreator = sessionStorage.getItem("username"); // Get the username from sessionStorage

//     sessionStorage.setItem("playlistName", playlistname);

//     var requestData = {
//       playlistname: playlistname,
//       playlistcreator: playlistcreator,
//     };

//     fetch("https://localhost:7259/api/User/AddPlaylist", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${Token}`,
//       },
//       body: JSON.stringify(requestData),
//     })
//       .then((response) => response.text())
//       .then((data) => {
//         if (data.status === "ok") {
//           alert(data);

//           // Redirect to playlist.html
//         } else {
//           console.log(data);

//           location.href = "/playlist.html";
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   });

document
  .getElementById("playlistForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const playlistname = document.getElementById("playlistname").value;
    sessionStorage.setItem("playlistName", playlistname);
    const playlistcreator = sessionStorage.getItem("username");
    const data = {
      playlistname,
      playlistcreator,
    };

    try {
      // Make an HTTP POST request to your API endpoint
      const response = await fetch(
        "https://localhost:7259/api/User/AddPlaylist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const dataa = await response.text();
      console.log(dataa);
      location.href = "/playlist.html";
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle login error (e.g., show an error message to the user)
    }
  });
// refresh token

function refreshToken() {
  fetch("https://localhost:7259/api/Auth/refreshToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`, // Include your authorization token if needed
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      console.log("New token:", data);
      // Optionally, update the token in your application
    })
    .catch((error) => console.error("Error:", error));
}

// Call refreshToken every 5 minutes (300000 milliseconds)
setInterval(refreshToken, 300000);

// user playlists

document
  .getElementById("showAllPlaylists")
  .addEventListener("click", async function () {
    const username = sessionStorage.getItem("username"); // Replace with the actual username
    try {
      const response = await fetch(
        `https://localhost:7259/api/User/UserPlayllists2?username=${encodeURIComponent(
          username
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`, // Include your authorization token if needed
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const playlists = await response.json();
      const playlistsElement = document.getElementById("playlists");
      playlistsElement.innerHTML = ""; // Clear any existing playlists

      playlists.forEach((playlist) => {
        const playlistElement = document.createElement("li");
        playlistElement.innerHTML = `
        <div class="playlist-container">
          <div class="image">
            <img src="/assets/icons/LogosSpotifyIcon.svg" alt="">
          </div>
          <div class="playlist-info">
            <p id="playlistName">${playlist.name} <span id="count">(${playlist.count})</span></p>
            <p class="creator-info">playlist <span id="playlistCreator">${playlist.creator}</span></p>
          </div>
        </div>
      `;
        playlistsElement.appendChild(playlistElement);
      });
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  });
