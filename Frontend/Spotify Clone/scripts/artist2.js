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
var selectedSongname = "";
var selectedSongArtist = "";
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
        const songArtistSpan = listItem.querySelector(".artistName");
        if (songTitleSpan && songArtistSpan) {
          const songName = songTitleSpan.textContent
            .trim()
            .split("\n")[0]
            .trim();
          const songArtist = songArtistSpan.textContent;
          selectedSongname = songName;
          selectedSongArtist = songArtist;
          // console.log("Selected song:", selectedSongname);
          // console.log("Selected song artist :", selectedSongArtist);
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
// var audio = "";
// document.addEventListener("DOMContentLoaded", function () {
//   function loadSongAudio(songName) {
//     if (!songName) {
//       console.error("Song name is required.");
//       return;
//     }

//     // Construct the URL to fetch the audio
//     const audioUrl = `https://localhost:7259/api/Artist/SongAudio/${encodeURIComponent(
//       songName
//     )}`;

//     // Fetch the audio file
//     fetch(audioUrl)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.blob(); // Get the audio file as a Blob
//       })
//       .then((blob) => {
//         // Create a URL for the Blob
//         const audioBlobUrl = URL.createObjectURL(blob);
//         audio.src = audioBlobUrl;
//         // // Set the URL as the source for the audio element
//         // const audioElement = document.getElementById("songAudio22");
//         // if (audioElement) {
//         //   audio.src = audioBlobUrl;
//         // }
//       })
//       .catch((error) => console.error("Error fetching song audio:", error));
//   }

//   // Example usage: load audio for a specific song
//   const songName = sessionStorage.getItem("songName"); // Retrieve song name from sessionStorage
//   loadSongAudio(selectedSongname);
// });
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

// test playing the song
document.addEventListener("DOMContentLoaded", function () {
  const playPauseBtn = document.querySelector(".play-pause");
  const progressBar = document.querySelector(".progress-bar .progress");
  const volumeBar = document.querySelector(".volume-bar .progress");

  // start test
  // const songList = document.getElementById("song-list");
  const audio = new Audio();

  // Add click event listener to each song in the list
  // songList.addEventListener("click", function (e) {
  //   const songItem = e.target.closest("li");
  //   if (songItem) {
  //     const songTitleElement = document.querySelector(".song-title");

  //     // Extract the song title by removing the artist's name
  //     const songTitle = songTitleElement.childNodes[0].textContent.trim();
  //     console.log(songTitle);

  //     if (songTitle) {
  //       fetchSongAudio(songTitle);
  //     }
  //   }
  // });
  // Function to handle click events on song list items
  function handleSongClick(event) {
    // Check if the clicked element is a list item
    if (event.target.tagName === "LI" || event.target.closest("li")) {
      // Find the closest <li> element to the clicked target
      const listItem = event.target.closest("li");
      if (listItem) {
        // Extract the song title from the <span> with class 'song-title'
        const songTitleSpan = listItem.querySelector(".song-title");
        const songArtistSpan = listItem.querySelector(".artistName");
        if (songTitleSpan && songArtistSpan) {
          const songName = songTitleSpan.textContent
            .trim()
            .split("\n")[0]
            .trim();
          const songArtist = songArtistSpan.textContent;
          document.getElementById("Song-name").innerText = songName;
          document.getElementById("song-artist").innerText = songArtist;
          fetchSongAudio(songName);
          fetchSongImage(songName);
        }
      }
    }
  }

  // Add click event listener to the song list container
  const songList = document.getElementById("song-list");
  if (songList) {
    songList.addEventListener("click", handleSongClick);
  }

  // Function to make an HTTP request to fetch the song audio
  function fetchSongAudio(songName) {
    fetch(
      `https://localhost:7259/api/Artist/SongAudio/${encodeURIComponent(
        songName
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.blob(); // Fetch the audio as a binary blob
      })
      .then((blob) => {
        const audioUrl = URL.createObjectURL(blob);
        audio.src = audioUrl;
        audio.play(); // Automatically start playing the song
      })
      .catch((error) => {
        console.error("Failed to load the song:", error);
      });
  }
  // Function to make an HTTP request to fetch the song image
  function fetchSongImage(songName) {
    fetch(
      `https://localhost:7259/api/Artist/SongImage/${encodeURIComponent(
        songName
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.blob(); // Fetch the image as a binary blob
      })
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);

        // Find the img element by its ID and update its src attribute
        const imageElement = document.getElementById("song-image");
        if (imageElement) {
          imageElement.src = imageUrl;
        } else {
          console.error("Image element with ID 'song-image' not found");
        }
      })
      .catch((error) => {
        console.error("Failed to load the image:", error);
      });
  }

  // end test
  let isPlaying = true;

  // Play/Pause Toggle
  playPauseBtn.addEventListener("click", function () {
    if (isPlaying) {
      audio.pause();
      playPauseBtn.classList.remove("fa-pause");
      playPauseBtn.classList.add("fa-play");
    } else {
      audio.play();
      playPauseBtn.classList.remove("fa-play");
      playPauseBtn.classList.add("fa-pause");
    }
    isPlaying = !isPlaying;
  });

  // Update progress bar as the audio plays
  audio.addEventListener("timeupdate", function () {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Update the current time display
    const currentTimeDisplay = document.querySelector(
      ".progress-container span:first-child"
    );
    currentTimeDisplay.textContent = formatTime(audio.currentTime);

    // Update the duration display
    const durationDisplay = document.querySelector(
      ".progress-container span:last-child"
    );
    if (!isNaN(audio.duration)) {
      durationDisplay.textContent = formatTime(audio.duration);
    }
  });

  // Function to format time in minutes and seconds
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // Seek functionality
  document
    .querySelector(".progress-bar")
    .addEventListener("click", function (e) {
      const progressContainerWidth = this.clientWidth;
      const clickX = e.offsetX;
      const duration = audio.duration;

      audio.currentTime = (clickX / progressContainerWidth) * duration;
    });

  // Volume Control
  document
    .querySelector(".volume-bar .progress-bar")
    .addEventListener("click", function (e) {
      const volumeBarWidth = this.clientWidth;
      const clickX = e.offsetX;
      const volumeLevel = clickX / volumeBarWidth;

      audio.volume = volumeLevel;
      volumeBar.style.width = `${volumeLevel * 100}%`;
    });
});
