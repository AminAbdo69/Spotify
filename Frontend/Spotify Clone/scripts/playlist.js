var Token = sessionStorage.getItem("myToken");
console.log(Token);

document.querySelectorAll("#username").forEach((element) => {
  element.textContent = sessionStorage.getItem("username");
});

document.querySelectorAll("#playlistName").forEach((element) => {
  element.textContent = sessionStorage.getItem("playlistName");
});

var theplaylistname = document.getElementById("playlistName");
theplaylistname.innerText = sessionStorage.getItem("playlistName");

var theUsername = document.getElementById("username");
theUsername.innerText = sessionStorage.getItem("username");

var Soungscount = document.getElementById("numSongs");

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

// Call refreshToken every 5 minutes (100000 milliseconds)
setInterval(refreshToken, 100000);

// document
//   .getElementById("AddSongtoPlaylist")
//   .addEventListener("submit", async function (event) {
//     event.preventDefault(); // Prevent the default form submission behavior
//     var theplaylistname = document.getElementById("playlistName");
//     theplaylistname.innerText = sessionStorage.getItem("playlistName");

//     var theUsername = document.getElementById("username");
//     theUsername.innerText = sessionStorage.getItem("username");

//     const playlistName = sessionStorage.getItem("playlistName");
//     const songName = document.getElementById("songName2").value;
//     console.log(songName);
//     const data = {
//       playlistName,
//       songName,
//     };

//     try {
//       // Make an HTTP POST request to your API endpoint
//       const response = await fetch(
//         "https://localhost:7259/api/User/AddPlaylistSong",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${Token}`,
//           },
//           body: JSON.stringify(data),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status} ${response.statusText}`);
//       }

//       const dataa = await response.text();
//       console.log(dataa);
//       console.log("success");

//       // Fetch and display the updated playlist songs
//       fetchPlaylistSongs(playlistName);
//     } catch (error) {
//       console.error("Error logging in:", error);
//       // Handle login error (e.g., show an error message to the user)
//     }
//   });

// function fetchPlaylistSongs(playlistName) {
//   fetch(
//     `https://localhost:7259/api/User/GetPlaylistSongs?playlistName=${encodeURIComponent(
//       playlistName
//     )}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${Token}`, // Include your authorization token if needed
//       },
//     }
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       const playlistSongsElement = document.getElementById("playlistSongs");
//       playlistSongsElement.innerHTML = ""; // Clear any existing songs

//       data.forEach((song) => {
//         const songElement = document.createElement("li");
//         songElement.innerHTML = `
//         <span class="song-title">${song.songName} <br>
//           <span class="artistName">${song.artistName}</span>
//         </span>
//         <span class="duration">
//           <i class="fa-regular fa-heart"></i>
//           <span class="time">${song.duration}</span>
//           <i class="fa-solid fa-ellipsis"></i>
//         </span>
//       `;
//         Soungscount.innerText = ". " + song.count;
//         console.log(song.count);
//         playlistSongsElement.appendChild(songElement);
//       });
//     })
//     .catch((error) => console.error("Error:", error));
// }

// function formatDuration(duration) {
//   const minutes = Math.floor(duration / 60);
//   const seconds = duration % 60;
//   return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
// }

// // Call the function with the desired playlist name
// fetchPlaylistSongs(sessionStorage.getItem("playlistName"));

//test

document.addEventListener("DOMContentLoaded", async function () {
  await fetchAndDisplayPlaylists();
  const playlistName = sessionStorage.getItem("playlistName");
  if (playlistName) {
    fetchPlaylistSongs(playlistName);
  }
});

async function fetchAndDisplayPlaylists() {
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
          Authorization: `Bearer YOUR_AUTH_TOKEN`, // Include your authorization token if needed
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
            <p id="playlistName">${playlist.name}<span id="count">(${playlist.count})</span></p>
            <p class="creator-info">playlist <span id="playlistCreator">${playlist.creator}</span></p>
          </div>
        </div>
      `;
      playlistsElement.appendChild(playlistElement);
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);
  }
}

document
  .getElementById("AddSongtoPlaylist")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    var theplaylistname = document.getElementById("playlistName");
    theplaylistname.innerText = sessionStorage.getItem("playlistName");

    var theUsername = document.getElementById("username");
    theUsername.innerText = sessionStorage.getItem("username");

    const playlistName = sessionStorage.getItem("playlistName");
    const songName = document.getElementById("songName2").value;
    console.log(songName);
    const data = {
      playlistName,
      songName,
    };

    try {
      // Make an HTTP POST request to your API endpoint
      const response = await fetch(
        "https://localhost:7259/api/User/AddPlaylistSong",
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
      console.log("success");

      // Fetch and display the updated playlist songs
      fetchPlaylistSongs(playlistName);
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle login error (e.g., show an error message to the user)
    }
  });

function fetchPlaylistSongs(playlistName) {
  fetch(
    `https://localhost:7259/api/User/GetPlaylistSongs?playlistName=${encodeURIComponent(
      playlistName
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`, // Include your authorization token if needed
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const playlistSongsElement = document.getElementById("playlistSongs");
      playlistSongsElement.innerHTML = ""; // Clear any existing songs

      data.forEach((song) => {
        const songElement = document.createElement("li");
        songElement.innerHTML = `
        <span class="song-title">${song.songName} <br>
          <span class="artistName">${song.artistName}</span>
        </span>
        <span class="duration">
          <i class="fa-regular fa-heart"></i>
          <span class="time">${song.duration}</span>
          <i class="fa-solid fa-ellipsis"></i>
        </span>
      `;
        Soungscount.innerText = ". " + song.count;
        console.log(song.count);
        playlistSongsElement.appendChild(songElement);
      });
    })
    .catch((error) => console.error("Error:", error));
}

// show all playlists

// user playlists

document
  .getElementById("showAllPlaylists")
  .addEventListener("click", async function () {
    var theplaylistname = document.getElementById("playlistName");
    theplaylistname.innerText = sessionStorage.getItem("playlistName");

    var theUsername = document.getElementById("username");
    theUsername.innerText = sessionStorage.getItem("username");
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
