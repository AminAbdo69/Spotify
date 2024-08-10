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
var heartIcon = document.getElementById("hearticon");
var ellipsisIcon = document.getElementById("ellipsisicon");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on any of the elements, open the modal
playIcon.onclick = function () {
  modal.style.display = "block";
};
heartIcon.onclick = function () {
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

var songss = document.querySelectorAll("#albumSongs li");

// Add click event listeners to each song
songss.forEach(function (song) {
  song.addEventListener("click", function () {
    modal.style.display = "block";
  });
});

// refresh token

// function refreshToken() {
//   fetch("https://localhost:7259/api/Auth/refreshToken", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include", // Include cookies in the request
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.status === "ok") {
//         console.log("Token refreshed successfully:", data.message);
//       } else {
//         console.error("Error refreshing token:", data.message);
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

// // Call refreshToken function every 15 minutes (900,000 milliseconds)
// setInterval(refreshToken, 300000);

// // Optionally, call it immediately on page load
// refreshToken();

// const data = JSON.parse(localStorage.getItem("selected-album"));

// document.querySelector(".album-title").innerHTML = data.title;
// const albumImage = document.getElementById("albumImage");
// albumImage.src = data.image;

// document.querySelector(".album-info .artist-name").innerHTML = data.artist;

// console.log(data.image);
// const artistImage = document.getElementById("artistImage");
// artistImage.src = data.artistPic;

// document.title = data.title;

const albumName = sessionStorage.getItem("albumName");
const albumPic = sessionStorage.getItem("albumPic");
const albumArtist = sessionStorage.getItem("albumArtist");
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the data from localStorage
  console.log(albumName);
  console.log(albumArtist);
  // Display the data
  document.getElementById("artist-name").textContent = albumArtist;
  document.getElementById("album-title").textContent = albumName;
  document.getElementById("albumImage").src = albumPic;

  fetch(`https://localhost:7259/api/Artist/AlbumSongs?albunmname=${albumName}`)
    .then((response) => response.json())
    .then((songs) => {
      const songList = document.getElementById("albumSongs");
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
// get artist image
function loadArtistImage(artistName) {
  if (!artistName) {
      console.error('Artist name is required.');
      return;
  }

  fetch(`https://localhost:7259/api/Artist/ArtistImage/${artistName}`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.blob(); // Get the response as a blob
      })
      .then(imageBlob => {
          const imageUrl = URL.createObjectURL(imageBlob); // Create a local URL for the image blob
          const imgElement = document.getElementById('artistImage'); // Ensure you have an element with this ID in your HTML
          imgElement.src = imageUrl; // Set the image source to the local URL
      })
      .catch(error => console.error('Error fetching artist image:', error));
}

// Example usage: load image for a specific artist
window.onload = function() {
  loadArtistImage(albumArtist);
};

