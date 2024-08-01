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

// Get the modal
var modal = document.getElementById("myModal");

// Get the elements that open the modal
var playIcon = document.getElementById("playicon");
var followwBtn = document.getElementById("followBtn");
var ellipsisIcon = document.getElementById("ellipsisicon");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on any of the elements, open the modal
playIcon.onclick = function () {
  modal.style.display = "block";
};
followwBtn.onclick = function () {
  modal.style.display = "block";
};
ellipsisIcon.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

var songslist = document.querySelectorAll("#song-list li");

// Add click event listeners to each song
songslist.forEach(function (songg) {
  songg.addEventListener("click", function () {
    modal.style.display = "block";
  });
});

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
        albumCard.href = "./album.html";

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
