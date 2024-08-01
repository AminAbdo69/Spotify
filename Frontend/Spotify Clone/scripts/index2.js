var theusername = document.querySelector(".topbar .navbar .username");
theusername.innerHTML = sessionStorage.getItem("username");
var Token = sessionStorage.getItem("myToken");
console.log(" Token:", Token);

var username = sessionStorage.getItem("username");
console.log(username);

//create playlist

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

//user create playlist
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

// retrieve all user playlist

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

// new

const albumCards = document.querySelectorAll(".album-card");
albumCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    e.preventDefault();

    const title = card.querySelector(".album-title").innerText;
    const image = card.querySelector(".album-image").src;
    const artist = card.dataset.artist;
    const artistPic = card.dataset.artistPic;

    const data = {
      title,
      image,
      artist,
      artistPic,
    };

    localStorage.setItem("selected-album", JSON.stringify(data));

    location.href = card.href;
  });
});

//Retrieve All Artists
document.addEventListener("DOMContentLoaded", function () {
  fetch("https://localhost:7259/api/Artist/AllArtists")
    .then((response) => response.json())
    .then((data) => {
      const artistList = document.getElementById("Popular-artists");
      artistList.innerHTML = ""; // Clear existing content

      data.forEach((artist) => {
        const artistCard = document.createElement("a");
        artistCard.className = "item artist-card";
        artistCard.dataset.artist = artist.name;
        artistCard.dataset.artistPic = artist.pic;
        artistCard.href = "/artistAfterlogin.html";

        artistCard.innerHTML = `
          <img id="artistImage" class="artist-image" src="assets/images/the last peace of art.png" />
          <div class="play">
            <span class="fa fa-play"></span>
          </div>
          <h4 class="artist-title" id="artistName">${artist.name}</h4>
          <p>Artist.</p>
        `;

        artistCard.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent the default link behavior

          // Store the data in localStorage
          localStorage.setItem("artist", artist.name);
          localStorage.setItem("artistPic", artistCard.dataset.artistPic);

          // Redirect to the new page
          window.location.href = artistCard.getAttribute("href");
        });

        artistList.appendChild(artistCard);
      });
    })
    .catch((error) => console.error("Error fetching artists:", error));

  const showAllButton = document.getElementById("showAll1");
  showAllButton.addEventListener("click", function () {
    const playlistList = document.getElementById("Popular-artists");
    playlistList.style.overflowX = "auto";
  });
});

//Retrieve All Albums

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://localhost:7259/api/Artist/AllAlbums")
    .then((response) => response.json())
    .then((data) => {
      const albumList = document.getElementById("Popular-Albums");
      albumList.innerHTML = ""; // Clear existing content

      data.forEach((album) => {
        const albumCard = document.createElement("a");
        albumCard.className = "item album-card";
        albumCard.dataset.album = album.albumname;
        albumCard.dataset.artist = album.artistname;
        albumCard.dataset.albumPic = album.picture;
        albumCard.href = "./albumAfterLogin.html";

        albumCard.innerHTML = `
                  <img id="albumImage" class="album-image" src="assets/images/the last peace of art.png" />
                  <div class="play">
                      <span class="fa fa-play"></span>
                  </div>
                  <h4 class="album-title" id="album-name">${album.albumname}</h4>
                  <p id="album-creator">by ${album.artistname}</p>
              `;
        albumCard.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent the default link behavior

          // Store the data in localStorage
          localStorage.setItem("albumName", album.albumname);
          localStorage.setItem("Username", username);
          // localStorage.setItem("albumPic", albumPic);
          localStorage.setItem("albumArtist", album.artistname);

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

//Retrieve All playlists

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://localhost:7259/api/User/AllPlaylists")
    .then((response) => response.json())
    .then((data) => {
      const playlistList = document.getElementById("Popular-Playlist");
      playlistList.innerHTML = ""; // Clear existing content

      data.forEach((playlist) => {
        const playlistCard = document.createElement("a");
        playlistCard.className = "item playlist-card";

        playlistCard.dataset.playlistName = playlist.name;
        playlistCard.dataset.playlistCreator = playlist.creator;
        playlistCard.dataset.playlistPic = playlist.picture;
        playlistCard.href = "/playlist.html";

        playlistCard.innerHTML = `
                  <img class="album-image" src="assets/images/the last peace of art4.png" />
                  <div class="play">
                      <span class="fa fa-play"></span>
                  </div>
                  <h4 class="album-title" id="playlist-name">
                      ${playlist.name} <span id="count">${playlist.count} songs</span>
                  </h4>
                  <p id="playlist-creator">by ${playlist.creator}</p>
              `;

        playlistCard.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent the default link behavior

          // Store the data in localStorage
          localStorage.setItem("playlistName", playlist.name);
          localStorage.setItem("playlistCreator", playlist.creator);
          localStorage.setItem("playlistCount", playlist.count);
          // localStorage.setItem("playlistPic", playlistPic);

          // Redirect to the new page
          window.location.href = playlistCard.getAttribute("href");
        });

        playlistList.appendChild(playlistCard);
      });
    })
    .catch((error) => console.error("Error fetching playlists:", error));

  const showAllButton = document.getElementById("showAll3");
  showAllButton.addEventListener("click", function () {
    const playlistList = document.getElementById("Popular-Playlist");
    playlistList.style.overflowX = "auto";
  });
});

// selected cards

document.querySelectorAll(".artist-card").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default link behavior

    // Get the data attributes
    const artist = item.getAttribute("data-artist");
    const artistPic = item.getAttribute("data-artist-pic");

    // Store the data in localStorage
    localStorage.setItem("artist", artist);
    localStorage.setItem("artistPic", artistPic);

    // Redirect to the new page
    window.location.href = item.getAttribute("href");
  });
});

document.querySelectorAll(".album-card").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default link behavior

    // Get the data attributes
    const albumName = item.querySelector(".album-title").textContent;
    const albumPic = item.querySelector(".album-image").src;
    const albumArtist = item.getAttribute("data-artist");

    // Store the data in localStorage
    localStorage.setItem("albumName", albumName);
    localStorage.setItem("albumPic", albumPic);
    localStorage.setItem("albumArtist", albumArtist);

    // Redirect to the new page
    window.location.href = item.getAttribute("href");
  });
});

const playlistCards = document.querySelectorAll("playlist-card");
playlistCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    e.preventDefault();

    const playlistname = card.dataset.playlistName;
    const creatorname = card.dataset.playlistCreator;
    const image = card.querySelector(".playlist-image").src;

    const data = {
      playlistname,
      creatorname,
      image,
    };
    sessionStorage.setItem("selected-playlist", JSON.stringify(data));
    location.href = card.href;
  });
});

/// test Refresh token
// const userName = "aminabdo"; // Replace with the actual username
// const token = sessionStorage.getItem("myToken"); // Replace with your actual JWT token

// function refreshToken() {
//     fetch('https://localhost:7259/api/Auth/RefreshToken', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + token
//         },
//         body: JSON.stringify({ userName: userName })
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('New JWT Token:', data);
//         // Update the JWT token in localStorage or wherever you store it
//         localStorage.setItem('jwtToken', data);
//     })
//     .catch(error => {
//         console.error('There was a problem with the fetch operation:', error);
//     });
// }

// // Call refreshToken every 1 minute (60000 milliseconds)
// setInterval(refreshToken, 30000);

// function refreshToken() {
//   const userName = "aminabdo";
//   // Replace with the actual username
//   fetch("https://localhost:7259/api/Auth/RefreshToken", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       'Authorization': 'Bearer ' + Token // Assuming you store the JWT token in localStorage
//     },
//     body: JSON.stringify({ userName: userName }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       localStorage.setItem("jwtToken", data.token); // Update the JWT token in localStorage
//       document.cookie = `refreshToken=${data.refreshToken}; path=/`; // Update the refresh token in cookies
//     })
//     .catch((error) => {
//       console.error("There was a problem with the fetch operation:", error);
//     });
// }

// // Call refreshToken every 3 minutes (180000 milliseconds)
// setInterval(refreshToken, 18000);
