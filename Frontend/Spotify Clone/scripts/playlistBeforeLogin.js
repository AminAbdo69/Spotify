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
var listIcon = document.getElementById("listicon");

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
listIcon.onclick = function () {
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

// Retrieve the data from localStorage
const playlistName = localStorage.getItem("playlistName");
const playlistPic = "assets/images/the last peace of art4.png";
const playlistCreator = localStorage.getItem("playlistCreator");
const playlistCount = localStorage.getItem("playlistCount");
console.log(playlistName);
console.log(playlistCount);
// console.log(playlistPic);
console.log(playlistCreator);
// Display the data
document.getElementById("playlistName2").innerText = playlistName;
document.getElementById("albumImage").src = playlistPic;
document.getElementById("username").textContent = playlistCreator;
document.getElementById("numSongs").innerText = playlistCount;

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the data from localStorage
  const playlistName = localStorage.getItem("playlistName");
  // const playlistPic = localStorage.getItem('playlistPic');
  const playlistCreator = localStorage.getItem("playlistCreator");

  // Display the data
  if (playlistName && playlistPic && playlistCreator) {
    document.getElementById("playlistName2").textContent = playlistName;
    // document.getElementById('playlistImage').src = playlistPic;
    document.getElementById("username").textContent = playlistCreator;

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
  }
});
