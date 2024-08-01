//show page data

var Token = sessionStorage.getItem("myToken");
console.log(Token);

// Retrieve the data from localStorage
const playlistNamet = localStorage.getItem("playlistName");
var playlistName = playlistNamet.substring(0, playlistNamet.indexOf(" ."));
const playlistPic = "assets/images/the last peace of art4.png";
const playlistCreator = localStorage.getItem("playlistCreator");
const playlistCountt = localStorage.getItem("playlistCount");
const playlistCount = playlistCountt.substring(0, playlistCountt.indexOf(" s"));
console.log(playlistName);
console.log(playlistCount);
// console.log(playlistPic);
console.log(playlistCreator);
// Display the data

document.querySelectorAll("#username").forEach((element) => {
  element.textContent = playlistCreator;
});

document.querySelectorAll("#playlistName").forEach((element) => {
  element.textContent = playlistName;
});
var Soungscount = document.getElementById("numSongs");
Soungscount.innerText = playlistCount;

document.getElementById("albumImage").src = playlistPic;

if (
  localStorage.getItem("userplaylistData") === null ||
  localStorage.getItem("userplaylistData") === ""
) {
  document.addEventListener("DOMContentLoaded", () => {
    // Make a request to get the playlist's songs
    fetch(
      `https://localhost:7259/api/User/GetPlaylistSongs?playlistName=${playlistName}`
    )
      .then((response) => response.json())
      .then((songs) => {
        const songList = document.getElementById("playlistSongs");
        songList.innerHTML = ""; // Clear existing content

        songs.forEach((song) => {
          const songItem = document.createElement("li");
          songItem.innerHTML = `
                <span class="song-title">
                  ${song.songName} <br>
                  <span class="artistName">${song.artistName}</span>
                </span>
                <span class="duration">
                  <i class="fa-regular fa-heart"></i>
                  <span class="time">${song.duration}</span>
                  <i class="fa-solid fa-ellipsis"></i>
                </span>
              `;
          songList.appendChild(songItem);
        });
      })
      .catch((error) => console.error("Error fetching songs:", error));
  });
} else {
  document.addEventListener("DOMContentLoaded", () => {
    fetch(
      `https://localhost:7259/api/User/GetPlaylistSongs?playlistName=${playlistName}`
    )
      .then((response) => response.json())
      .then((songs) => {
        const songList = document.getElementById("playlistSongs");
        songList.innerHTML = ""; // Clear existing content

        songs.forEach((song) => {
          const songItem = document.createElement("li");
          songItem.innerHTML = `
                <span class="song-title">
                  ${song.songName} <br>
                  <span class="artistName">${song.artistName}</span>
                </span>
                <span class="duration">
                  <i class="fa-regular fa-heart"></i>
                  <span class="time">${song.duration}</span>
                  <i class="fa-solid fa-ellipsis"></i>
                </span>
              `;
          songList.appendChild(songItem);
        });
      })
      .catch((error) => console.error("Error fetching songs:", error));
  });
}

//create playlist show form
document
  .getElementById("createPlaylist")
  .addEventListener("click", function () {
    var hintContainer = document.querySelector(".hint-container");
    hintContainer.style.display = "block"; // Show the hint-container
  });

// hide form
document.addEventListener("click", function (event) {
  var hintContainer = document.querySelector(".hint-container");
  var createPlaylistButton = document.getElementById("createPlaylist");

  if (
    !hintContainer.contains(event.target) &&
    event.target !== createPlaylistButton
  ) {
    hintContainer.style.display = "none";
  }
});

// use form

document
  .getElementById("playlistForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const playlistname = document.getElementById("playlistname").value;
    sessionStorage.setItem("playlistName", playlistname);
    const playlistcreator = username;

    const formData = new FormData();
    formData.append(
      "playlistname",
      document.getElementById("playlistname").value
    );
    formData.append("image", document.getElementById("playlistImage").files[0]);
    formData.append("playlistcreator", username); // Replace with the actual username

    try {
      // Make an HTTP POST request to your API endpoint
      const response = await fetch(
        "https://localhost:7259/api/User/AddPlaylist",
        {
          method: "POST",
          body: formData,
        }
      );

      // await fetch(
      //   "https://localhost:7259/api/User/AddPlaylist",
      //   {
      //     method: "POST",
      //     // headers: {
      //     //   "Content-Type": "application/json",
      //     // },
      //     // // Authorization: `Bearer ${Token}`,
      //     body: formData,
      //   }
      // );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const dataa = await response.text();
      console.log(dataa);
      // location.href = "/playlist.html";
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle login error (e.g., show an error message to the user)
    }
  });

// show all playlists
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
      playlistsElement.style.opacity = 1;
      playlistsElement.innerHTML = ""; // Clear any existing playlists

      playlists.forEach((playlist) => {
        const playlistElement = document.createElement("li");
        playlistElement.innerHTML = `
        <div class="playlist-container" onclick="sendData(this, ${playlist.count})">
          <div class="image">
            <img src="/assets/icons/LogosSpotifyIcon.svg" alt="">
          </div>
          <div class="playlist-info">
            <p id="playlistName">${playlist.name} <span id="count">.${playlist.count} songs</span></p>
            
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

function sendData(element, identifier) {
  const playlistName = element.querySelector("#playlistName").innerText;
  const playlistCreator = element.querySelector("#playlistCreator").innerText;
  const counter = element.querySelector("#count").innerText;
  // const count = counter.substring(counter.indexOf("("), counter.indexOf(")"));
  // const userPlaylistImage = element.querySelector('#userplaylistimage').src;

  localStorage.setItem("playlistName", playlistName);
  localStorage.setItem("playlistCreator", playlistCreator);
  localStorage.setItem("playlistCount", counter);

  window.location.href = "/playlist.html"; // Replace with your target page
}

// add song to playlist
document
  .getElementById("AddSongtoPlaylist")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const playlistName = localStorage.getItem("playlistName");
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
        document.getElementById("numSongs").innerText = ". " + song.count;
        console.log(song.count);
        playlistSongsElement.appendChild(songElement);
      });
    })
    .catch((error) => console.error("Error:", error));
}

// user like playlist

const loveBtn = document.getElementById("likeBtn");
loveBtn.addEventListener("click", function () {
  const username = localStorage.getItem("playlistCreator");
  const playlistnamee = localStorage.getItem("playlistName");

  const likedPlaylist = {
    username: username,
    playlistname: playlistnamee,
  };
  fetch("https://localhost:7259/api/User/LikePlaylist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(likedPlaylist),
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);
    })
    .catch((error) => {
      log.error("Error :", error);
      alert("An error occurred while liking the playlist.");
    });
});
