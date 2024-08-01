// SELECTED Album
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

// SELECTED playlist
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

// create playlist buttons and browse podcasts
document
  .getElementById("createPlaylist")
  .addEventListener("click", function () {
    var hintContainer = document.querySelector(".hint-container");
    hintContainer.style.display = "block"; // Show the hint-container
  });

document
  .getElementById("Browsepodcasts")
  .addEventListener("click", function () {
    var hintContainer = document.querySelector(".hint-container2");
    hintContainer.style.display = "block"; // Show the hint-container
  });

document.getElementById("notnow").addEventListener("click", function () {
  var hintContainer = document.querySelector(".hint-container");
  hintContainer.style.display = "none"; // Show the hint-container
});

document.getElementById("notnow2").addEventListener("click", function () {
  var hintContainer = document.querySelector(".hint-container2");
  hintContainer.style.display = "none"; // Show the hint-container
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

document.addEventListener("click", function (event) {
  var hintContainer = document.querySelector(".hint-container2");
  var createPlaylistButton = document.getElementById("Browsepodcasts");

  // Check if the click is outside the hint-container and the createPlaylist button
  if (
    !hintContainer.contains(event.target) &&
    event.target !== createPlaylistButton
  ) {
    hintContainer.style.display = "none"; // Hide the hint-container
  }
});

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
        artistCard.href = "./artist.html";

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
        albumCard.href = "./album.html";

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
        playlistCard.href = "./playlistBeforeLogin.html";

        playlistCard.innerHTML = `
                  <img class="album-image" src="assets/images/the last peace of art4.png" />
                  <div class="play">
                      <span class="fa fa-play"></span>
                  </div>
                  <h4 class="album-title" id="playlist-name">
                      ${playlist.name} <span id="count">(${playlist.count} songs)</span>
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

// test

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
