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

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the data from localStorage
  const albumName = localStorage.getItem("albumName");
  const albumPic = "assets/images/the last peace of art4.png";
  const albumArtist = localStorage.getItem("albumArtist");
  console.log(albumName);
  console.log(albumArtist);
  // Display the data
  document.getElementById("artist-name").textContent = albumArtist;
  document.getElementById("album-title").textContent = albumName;


  fetch(`https://localhost:7259/api/Artist/AlbumSongs?albunmname=${albumName}`)
          .then(response => response.json())
          .then(songs => {
            const songList = document.getElementById('albumSongs');
            songList.innerHTML = ''; // Clear existing content

            songs.forEach(song => {
              const songItem = document.createElement('li');
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
          .catch(error => console.error('Error fetching songs:', error));
});
