// page data

const artist = sessionStorage.getItem("artistname");
const artistPic = sessionStorage.getItem("artistpic");

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

TheArtistName.innerText = artist;
TheArtistpic.src = artistPic;

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the data from localStorage

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

// document.addEventListener("DOMContentLoaded", () => {
//   // Make a request to get the artist's albums
//   fetch(`https://localhost:7259/api/Artist/ArtistAlbums?artistName=${artist}`)
//     .then((response) => response.json())
//     .then((albums) => {
//       const albumList = document.getElementById("Popular-Albums");
//       albumList.innerHTML = ""; // Clear existing content

//       albums.forEach((album) => {
//         const albumCard = document.createElement("a");
//         albumCard.className = "item album-card";
//         albumCard.dataset.artist = artist;
//         albumCard.dataset.artistPic = album.albumPic; // Assuming albumPic is part of AlbumOutDTO
//         albumCard.href = "/albumAfterLogin.html";

//         albumCard.innerHTML = `
//           <img class="album-image" src="assets/images/the last peace of art.png" />
//           <div class="play">
//             <span class="fa fa-play"></span>
//           </div>
//           <h4 class="album-title" id="album-name">${album.albumname}</h4>
//           <p id="album-creator">${artist} - ${album.nsongs} songs</p>
//         `;

//         albumCard.addEventListener("click", (event) => {
//           event.preventDefault(); // Prevent the default link behavior

//           // Store the data in localStorage
//           localStorage.setItem("albumName", album.albumname);
//           localStorage.setItem("albumPic", album.albumPic);
//           localStorage.setItem("albumArtist", artist);

//           // Redirect to the new page
//           window.location.href = albumCard.getAttribute("href");
//         });

//         albumList.appendChild(albumCard);
//       });
//     })
//     .catch((error) => console.error("Error fetching albums:", error));

//   const showAllButton = document.getElementById("showAll2");
//   showAllButton.addEventListener("click", function () {
//     const playlistList = document.getElementById("Popular-Albums");
//     playlistList.style.overflowX = "auto";
//   });
// });

function loadArtistAlbums() {
  // Retrieve artist name from sessionStorage
  const artistName = sessionStorage.getItem("artistname");

  if (!artistName) {
    console.error("No artist name found in sessionStorage.");
    return;
  }

  fetch(`https://localhost:7259/api/Artist/ArtistAlbums?artistName=${artist}`)
    .then((response) => response.json())
    .then((data) => {
      const listContainer = document.getElementById("Popular-Albums");
      listContainer.innerHTML = ""; // Clear existing content

      data.forEach((album) => {
        const albumCard = document.createElement("a");
        albumCard.className = "item album-card";
        albumCard.setAttribute("data-artist", artistName);
        albumCard.setAttribute("data-artist-pic", album.picture);
        albumCard.href = "./album.html"; // URL to the album details page

        const img = document.createElement("img");
        img.className = "album-image";
        img.src = album.picture; // URL to the album cover image
        albumCard.appendChild(img);

        const playDiv = document.createElement("div");
        playDiv.className = "play";
        playDiv.innerHTML = '<span class="fa fa-play"></span>';
        albumCard.appendChild(playDiv);

        const title = document.createElement("h4");
        title.className = "album-title";
        title.id = "album-name";

        title.textContent = album.albumname; // Album name
        albumCard.appendChild(title);

        const creator = document.createElement("p");
        creator.id = "album-creator";
        creator.textContent = `${album.nsongs} songs`; // Number of songs
        albumCard.appendChild(creator);

        albumCard.addEventListener("click", (event) => {
          event.preventDefault(); // Prevent the default link behavior

          // Store the data in localStorage
          sessionStorage.setItem("albumName", album.albumname);
          sessionStorage.setItem("albumPic", album.picture);
          sessionStorage.setItem("albumArtist", album.artistname);

          // Redirect to the new page
          window.location.href = albumCard.getAttribute("href");
        });

        listContainer.appendChild(albumCard);
      });
    })
    .catch((error) => console.error("Error fetching artist albums:", error));
}

// Call the function to load albums
loadArtistAlbums();

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

// choose any song

document.addEventListener("DOMContentLoaded", function () {
  // Function to handle click events on song list items
  function handleSongClick(event) {
    // Check if the clicked element is a list item
    if (event.target.tagName === "LI" || event.target.closest("li")) {
      // Find the closest <li> element to the clicked target
      const listItem = event.target.closest("li");
      if (listItem) {
        // Extract the song title from the <span> with class 'song-title'
        const songTitleSpan = listItem.querySelector(".song-title");
        if (songTitleSpan) {
          const songName = songTitleSpan.textContent
            .trim()
            .split("\n")[0]
            .trim();
          console.log("Selected song:", songName);
          // Example usage: load details for a specific song
          window.onload = function () {
            loadSongDetails(songName);
          };
        }
      }
    }
  }

  // Add click event listener to the song list container
  const songList = document.getElementById("song-list");
  if (songList) {
    songList.addEventListener("click", handleSongClick);
  }
});

function loadSongDetails(songName) {
  if (!songName) {
    console.error("Song name is required.");
    return;
  }

  fetch(`https://localhost:7259/api/Artist/SongDetails/Realsong`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse JSON response
    })
    .then((data) => {
      console.log("Song details:", data);
      // Use data to update your UI
      // Example:
      document.getElementById("songName22").textContent = data.songname;
      document.getElementById("artistName22").textContent = data.artistname;
      document.getElementById("songImage22").src = data.image;
      document.getElementById("songAudio22").src = data.audio;
    })
    .catch((error) => console.error("Error fetching song details:", error));
}

// audio test

document.addEventListener("DOMContentLoaded", function () {
  function loadSongAudio(songName) {
    if (!songName) {
      console.error("Song name is required.");
      return;
    }

    // Construct the URL to fetch the audio
    const audioUrl = `https://localhost:7259/api/Artist/SongAudio/${encodeURIComponent(
      songName
    )}`;

    // Fetch the audio file
    fetch(audioUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob(); // Get the audio file as a Blob
      })
      .then((blob) => {
        // Create a URL for the Blob
        const audioBlobUrl = URL.createObjectURL(blob);

        // Set the URL as the source for the audio element
        const audioElement = document.getElementById("songAudio22");
        if (audioElement) {
          audioElement.src = audioBlobUrl;
        }
      })
      .catch((error) => console.error("Error fetching song audio:", error));
  }

  // Example usage: load audio for a specific song
  const songName = sessionStorage.getItem("songName"); // Retrieve song name from sessionStorage
  loadSongAudio("Realsong");
});
// image

document.addEventListener("DOMContentLoaded", function () {
  function loadSongImage(songName) {
    if (!songName) {
      console.error("Song name is required.");
      return;
    }

    // Construct the URL to fetch the image
    const imageUrl = `https://localhost:7259/api/Artist/SongImage/${encodeURIComponent(
      songName
    )}`;

    // Fetch the image file
    fetch(imageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob(); // Get the image file as a Blob
      })
      .then((blob) => {
        // Create a URL for the Blob
        const imageBlobUrl = URL.createObjectURL(blob);

        // Set the URL as the source for the image element
        const imageElement = document.getElementById("songImag22e");
        if (imageElement) {
          imageElement.src = imageBlobUrl;
        }
      })
      .catch((error) => console.error("Error fetching song image:", error));
  }

  // Example usage: load image for a specific song

  loadSongImage("Realsong");
});
// music player test

// script.js

document.addEventListener("DOMContentLoaded", function () {
  const audioPlayer = document.getElementById("audioPlayer");
  const playButton = document.getElementById("playButton");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const progressBar = document.getElementById("progressBar");
  const currentTimeDisplay = document.getElementById("currentTime");
  const durationDisplay = document.getElementById("duration");
  const albumArt = document.getElementById("albumArt");
  const songTitle = document.getElementById("songTitle");
  const artistName = document.getElementById("artistName");

  let currentSongIndex = 0;
  const songs = [
    {
      title: "Song 1",
      artist: "Artist 1",
      url: "path/to/song1.mp3",
      imageUrl: "path/to/image1.jpg",
    },
    {
      title: "Song 2",
      artist: "Artist 2",
      url: "path/to/song2.mp3",
      imageUrl: "path/to/image2.jpg",
    },
    // Add more songs as needed
  ];

  function loadSong(song) {
    audioPlayer.src = song.url;
    albumArt.src = song.imageUrl;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    audioPlayer.addEventListener("loadeddata", () => {
      durationDisplay.textContent = formatTime(audioPlayer.duration);
    });
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function updateProgress() {
    progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
  }

  playButton.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playButton.textContent = "Pause";
    } else {
      audioPlayer.pause();
      playButton.textContent = "Play";
    }
  });

  prevButton.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    audioPlayer.play();
  });

  nextButton.addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    audioPlayer.play();
  });

  progressBar.addEventListener("input", () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
  });

  audioPlayer.addEventListener("timeupdate", updateProgress);

  // Load the first song
  loadSong(songs[currentSongIndex]);
});
