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
document.addEventListener("click", function (event) {
  var hintContainer = document.querySelector(".hint-container");
  var createPlaylistButton = document.getElementById("createPlaylist");

  // Check if the click is outside the hint-container and the createPlaylist button
  if (
    !hintContainer.contains(event.target) &&
    event.target !== createPlaylistButton
  ) {
    hintContainer.style.display = "none"; // Hide the hint-container
  }
});

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
// refresh token



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






var TheArtistName = document.getElementById("artist-name");
var TheArtistpic = document.getElementById("artist-pic");

const artist = localStorage.getItem("artist");
// const artistPic = localStorage.getItem('artistPic');
const artistPic = "assets/images/the last peace of art.png";

TheArtistName.innerText = artist;
TheArtistpic.src = artistPic;

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the data from localStorage
  const artist = localStorage.getItem("artist");

  // Make a request to get the artist's songs
  fetch(`https://localhost:7259/api/Artist/ArtistSongs?artistName=${artist}`)
    .then((response) => response.json())
    .then((songs) => {
      const songList = document.getElementById("song-list");
      songList.innerHTML = ""; // Clear existing content

      songs.forEach((song) => {
        const songItem = document.createElement("li");
        songItem.innerHTML = `
          <span class="song-title">
            ${song.songName} <br />
            <span class="artistName">${artist}</span>
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

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the data from localStorage
  const artist = localStorage.getItem("artist");

  // Make a request to get the artist's albums
  fetch(`https://localhost:7259/api/Artist/ArtistAlbums?artistName=${artist}`)
    .then((response) => response.json())
    .then((albums) => {
      const albumList = document.getElementById("Popular-Albums");
      albumList.innerHTML = ""; // Clear existing content

      albums.forEach((album) => {
        const albumCard = document.createElement("a");
        albumCard.className = "item album-card";
        albumCard.dataset.artist = artist;
        albumCard.dataset.artistPic = album.albumPic; // Assuming albumPic is part of AlbumOutDTO
        albumCard.href = "/albumAfterLogin.html";

        albumCard.innerHTML = `
          <img class="album-image" src="assets/images/the last peace of art.png" />
          <div class="play">
            <span class="fa fa-play"></span>
          </div>
          <h4 class="album-title" id="album-name">${album.albumname}</h4>
          <p id="album-creator">${artist} - ${album.nsongs} songs</p>
        `;

        albumCard.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent the default link behavior

          // Store the data in localStorage
          localStorage.setItem("albumName", album.albumname);
          localStorage.setItem("albumPic", album.albumPic);
          localStorage.setItem("albumArtist", artist);

          // Redirect to the new page
          window.location.href = albumCard.getAttribute("href");
        });

        albumList.appendChild(albumCard);
      });
    })
    .catch((error) => console.error("Error fetching albums:", error));

  const showAllButton = document.getElementById("showAll2");
  showAllButton.addEventListener("click", function () {
    const playlistList = document.getElementById("Popular-Albums");
    playlistList.style.overflowX = "auto";
  });
});

// following artist

const followBtn = document.getElementById("followBtn");

followBtn.addEventListener("click", function () {
  const followArtistDTO = {
    ArtistName: artist, // Replace with the actual artist username
    UserName: username, // Replace with the actual user username
  };

  fetch("https://localhost:7259/api/Artist/followArtist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(followArtistDTO),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      alert(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while following the artist.");
    });
});
