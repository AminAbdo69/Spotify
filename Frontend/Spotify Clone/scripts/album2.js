// get page data
const albumName = sessionStorage.getItem("albumName");
const albumPic = sessionStorage.getItem("albumPic");
const albumArtist = sessionStorage.getItem("artistname");
const Username = sessionStorage.getItem("username");

var theusername = document.querySelector(".topbar .navbar .username");
theusername.innerHTML = Username;

theusername.addEventListener("click", function () {
  document.querySelector(".topbar .navbar .Btn").style.display = "flex";
});

// var Token = sessionStorage.getItem("myToken");
// console.log(" Token:", Token);

console.log(Username);

document.querySelectorAll("#username").forEach((element) => {
  element.textContent = Username;
});
document.querySelectorAll("#artist-name").forEach((element) => {
  element.textContent = albumArtist;
});

// show create playlist form
document
  .getElementById("createPlaylist")
  .addEventListener("click", function () {
    var hintContainer = document.querySelector(".hint-container");
    hintContainer.style.display = "block";
  });
// hide create playlist form
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

// use create playlist form
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
      location.href = "/playlist.html";
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle login error (e.g., show an error message to the user)
    }
  });

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
            // Authorization: `Bearer ${Token}`, // Include your authorization token if needed
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
        <div class="playlist-container" >
          <div class="image">
            <img src="/assets/icons/LogosSpotifyIcon.svg" alt="">
          </div>
          <div class="playlist-info">
            <p id="playlistName">${playlist.name} <span id="count">.${playlist.count} songs</span></p>
            
            <p class="creator-info">playlist <span id="playlistCreator">${playlist.creator}</span></p>
          </div>
          <div> <button id="Deleteplaylist" style="background-color:red ; border-radius:15px ; width:60px;" data-playlist-name="${playlist.name}">Delete</button> </div>
        </div>
      `;
        playlistsElement.appendChild(playlistElement);
        const deleteButtons = document.querySelectorAll(
          ".playlist-container #Deleteplaylist"
        );

        deleteButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const playlistName = this.getAttribute("data-playlist-name");
            const playlistCreator =
              document.getElementById("playlistCreator").textContent;

            if (
              confirm(
                `Are you sure you want to delete the playlist: ${playlistName}?`
              )
            ) {
              deletePlaylist(playlistName, playlistCreator);
            }
          });
        });

        function deletePlaylist(playlistName, playlistCreator) {
          fetch(`https://localhost:7259/api/User/DeletePlaylist`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              playlistname: playlistName,
              playlistcreator: playlistCreator,
            }),
          })
            .then((response) => {
              if (response.ok) {
                alert(
                  `Playlist '${playlistName}' has been deleted successfully.`
                );
                // Optionally remove the playlist from the UI
                location.reload(); // or use a more dynamic method to remove the element
              } else {
                return response.text().then((text) => {
                  throw new Error(text);
                });
              }
            })
            .catch((error) => {
              console.error("Failed to delete the playlist:", error);
              alert("Failed to delete the playlist.");
            });
        }
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

// all album's songs

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
                  <i class="fa-regular fa-heart" id="likesong" data-songname=${song.songName}></i>
                  <span class="time">${song.duration}</span>
                  <i class="fa-solid fa-ellipsis"></i>
                </span>
              `;
        songList.appendChild(songItem);
      });
    })
    .catch((error) => console.error("Error fetching songs:", error));
});

// user love album

const loveBtn = document.getElementById("hearticon");
const unloveBtn = document.getElementById("unlikealbum");

loveBtn.addEventListener("click", function () {
  var username = Username;
  var albumname = albumName;

  const likedAlbumDTO = {
    albumname: albumname,
    username: username,
  };
  fetch("https://localhost:7259/api/Artist/LikeAlbum", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(likedAlbumDTO),
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);
      loveBtn.style.display = "none";
      unloveBtn.style.display = "block";
    })
    .catch((error) => {
      console.error("Error :", error);
      alert("An error occurred while liking the album.");
    });
});

// user unlike album
unloveBtn.addEventListener("click", function () {
  var username = Username; // Replace with the actual username variable
  var albumname = albumName; // Replace with the actual album name variable

  const likedAlbumDTO = {
    albumname: albumname,
    username: username,
  };

  fetch("https://localhost:7259/api/Artist/UnlikeAlbum", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(likedAlbumDTO),
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data);
      unloveBtn.style.display = "none";
      loveBtn.style.display = "block";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while unliking the album.");
    });
});
// like and unlike song

document.addEventListener("DOMContentLoaded", function () {
  const username = Username; // Replace with the actual username

  document.querySelectorAll(".like-song").forEach(function (likeIcon) {
    likeIcon.addEventListener("click", function () {
      const songName = this.getAttribute("data-songname");

      const likedSongDTO = {
        songname: songName,
        username: username,
      };

      // Determine if the song is already liked
      if (this.classList.contains("fa-heart")) {
        // Send a POST request to like the song
        fetch("https://localhost:7259/api/Artist/LikeSong", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(likedSongDTO),
        })
          .then((response) => response.text())
          .then((data) => {
            console.log(data);
            alert(data);

            // Change the icon to show it's liked
            this.classList.remove("fa-heart");
            this.classList.add("fa-circle-check");
            this.style.color = "#1db954";
            this.id = "unlikesong"; // Update the id
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while liking the song.");
          });
      } else if (this.classList.contains("fa-circle-check")) {
        // Send a DELETE request to unlike the song
        fetch("https://localhost:7259/api/Artist/UnlikeSong", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(likedSongDTO),
        })
          .then((response) => response.text())
          .then((data) => {
            console.log(data);
            alert(data);

            // Change the icon back to the unliked state
            this.classList.remove("fa-circle-check");
            this.classList.add("fa-heart");
            this.style.color = ""; // Reset color to default
            this.id = "likesong"; // Update the id
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while unliking the song.");
          });
      }
    });
  });
});

// like and unlike from music player

document.addEventListener("DOMContentLoaded", function () {
  const likeSongIcon = document.getElementById("likesongg");
  const songNameElement = document.getElementById("Song-name");
  const unlikeSongIcon = document.getElementById("unlikesongg");

  likeSongIcon.addEventListener("click", function () {
    // Get the username from sessionStorage
    const username = sessionStorage.getItem("username");

    // Get the song name from the song name element
    const songName = songNameElement.textContent;
    console.log(username);
    console.log(songName);

    // Prepare the LikedSongDTO object
    const likedSongDTO = {
      songname: songName,
      username: username,
    };

    // Make the POST request to like the song
    fetch("https://localhost:7259/api/Artist/LikeSong", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(likedSongDTO),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        alert(data);

        // Change the icon to show it's liked
        likeSongIcon.style.display = "none";
        unlikeSongIcon.style.display = "block";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while liking the song.");
      });
  });

  unlikeSongIcon.addEventListener("click", function () {
    // Get the username from sessionStorage
    const username = sessionStorage.getItem("username");

    // Get the song name from the song name element
    const songName = songNameElement.textContent.trim();

    // Prepare the LikedSongDTO object
    const likedSongDTO = {
      songname: songName,
      username: username,
    };

    // Make the DELETE request to unlike the song
    fetch("https://localhost:7259/api/Artist/UnlikeSong", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(likedSongDTO),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        alert(data);

        // Change the icon back to the unliked state
        unlikeSongIcon.style.display = "none";
        likeSongIcon.style.display = "block";
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while unliking the song.");
      });
  });
});

// end like & unlike song
// get artist image
function loadArtistImage(artistName) {
  if (!artistName) {
    console.error("Artist name is required.");
    return;
  }

  fetch(`https://localhost:7259/api/Artist/ArtistImage/${artistName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob(); // Get the response as a blob
    })
    .then((imageBlob) => {
      const imageUrl = URL.createObjectURL(imageBlob); // Create a local URL for the image blob
      const imgElement = document.getElementById("artistImage"); // Ensure you have an element with this ID in your HTML
      imgElement.src = imageUrl; // Set the image source to the local URL
    })
    .catch((error) => console.error("Error fetching artist image:", error));
}

// Example usage: load image for a specific artist
window.onload = function () {
  loadArtistImage(albumArtist);
};

// test playing the song
document.addEventListener("DOMContentLoaded", function () {
  const playPauseBtn = document.querySelector(".play-pause");
  const progressBar = document.querySelector(".progress-bar .progress");
  const volumeBar = document.querySelector(".volume-bar .progress");

  const audio = new Audio();
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
        localStorage.clear();
        console.log("test");

        if (songTitleSpan && songArtistSpan) {
          const songName = songTitleSpan.textContent
            .trim()
            .split("\n")[0]
            .trim();
          const songArtist = songArtistSpan.textContent;
          document.getElementById("Song-name").innerText = songName;
          document.getElementById("song-artist").innerText = songArtist;
          localStorage.setItem("Resumesongname", songName);
          localStorage.setItem("Resumeartistname", songArtist);
          fetchSongAudio(songName);
          fetchSongImage(songName);
        }
      }
    }
  }

  // Add click event listener to the song list container
  const songList = document.getElementById("albumSongs");
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
        localStorage.setItem("ResumeaudioUrl", audioUrl);

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
        localStorage.setItem("ResumeimageUrl", imageUrl);

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
    localStorage.setItem("ResumeaduioTime", audio.currentTime);

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
// resume
document.addEventListener("DOMContentLoaded", function () {
  const playPauseBtn = document.querySelector(".play-pause");
  const progressBar = document.querySelector(".progress-bar .progress");
  const volumeBar = document.querySelector(".volume-bar .progress");

  const audio = new Audio();

  // Resume song state on page load
  function resumeSongState() {
    const resumeSongName = localStorage.getItem("Resumesongname");
    const resumeArtistName = localStorage.getItem("Resumeartistname");
    const resumeSongTime = localStorage.getItem("ResumeaduioTime");

    if (resumeSongName && resumeArtistName) {
      document.getElementById("Song-name").innerText = resumeSongName;
      document.getElementById("song-artist").innerText = resumeArtistName;

      fetchSongAudio(resumeSongName, resumeSongTime);
      fetchSongImage(resumeSongName);
    }
  }

  // Function to handle click events on song list items
  function handleSongClick(event) {
    if (event.target.tagName === "LI" || event.target.closest("li")) {
      const listItem = event.target.closest("li");
      if (listItem) {
        const songTitleSpan = listItem.querySelector(".song-title");
        const songArtistSpan = listItem.querySelector(".artistName");
        if (songTitleSpan && songArtistSpan) {
          const songName = songTitleSpan.textContent
            .trim()
            .split("\n")[0]
            .trim();
          const songArtist = songArtistSpan.textContent;
          audio.pause();
          audio.currentTime = 0; // Reset the playback time

          document.getElementById("Song-name").innerText = songName;
          document.getElementById("song-artist").innerText = songArtist;

          // Save song info in localStorage
          localStorage.setItem("Resumesongname", songName);
          localStorage.setItem("Resumeartistname", songArtist);

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

  // Function to fetch and play the song audio
  function fetchSongAudio(songName, resumeTime = 0) {
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

        // Set the resume time if available
        audio.currentTime = resumeTime;
        audio.play(); // Automatically start playing the song
      })
      .catch((error) => {
        console.error("Failed to load the song:", error);
      });
  }

  // Function to fetch and display the song image
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

  // Play/Pause Toggle
  playPauseBtn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play();
      playPauseBtn.classList.remove("fa-play");
      playPauseBtn.classList.add("fa-pause");
    } else {
      audio.pause();
      playPauseBtn.classList.remove("fa-pause");
      playPauseBtn.classList.add("fa-play");
    }
  });

  // Update progress bar as the audio plays
  audio.addEventListener("timeupdate", function () {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Save the current time to localStorage
    localStorage.setItem("ResumeaduioTime", audio.currentTime);

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

  // Resume song state on page load
  resumeSongState();
});
