var theusername = document.querySelector(".topbar .navbar .username");
theusername.innerHTML = sessionStorage.getItem("username");
var Token = sessionStorage.getItem("myToken");
console.log(" Token:", Token);

var username = sessionStorage.getItem("username");
console.log(username);

theusername.addEventListener("click", function () {
  document.querySelector(".topbar .navbar .Btn").style.display = "flex";
});

// Resume song

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
    sessionStorage.setItem("playlistCreator", username);
    sessionStorage.setItem("playlistCount", 0);
    document
      .getElementById("addplaylist")
      .addEventListener("click", function (event) {
        const file = event.target.files[0]; // Get the selected file

        if (file) {
          const reader = new FileReader();

          reader.onload = function (e) {
            // const imgElement = document.getElementById("displayedImage");
            // imgElement.src = e.target.result; // Set the src of the img tag to the base64 string
            console.log("test");

            console.log(e.target.result);
          };

          reader.readAsDataURL(file); // Convert the file to a base64 string
        }
      });

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

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const dataa = await response.text();
      console.log(dataa);
      // location.href = "/playlist.html";

      // display all again
      fetch("https://localhost:7259/api/User/AllPlaylists") // Adjust URL if needed
        .then((response) => response.json())
        .then((data) => {
          const listContainer = document.getElementById("Popular-Playlist");
          listContainer.innerHTML = ""; // Clear existing content

          data.forEach((playlist) => {
            const playlistCard = document.createElement("a");
            playlistCard.className = "item playlist-card";
            playlistCard.setAttribute("data-playlist-name", playlist.name);
            playlistCard.setAttribute(
              "data-playlist-creator",
              playlist.creator
            );
            playlistCard.setAttribute("data-playlist-pic", playlist.picture);
            playlistCard.href = "/playlist.html"; // URL to the playlist details page

            const img = document.createElement("img");
            img.className = "playlist-image";
            img.src = playlist.picture; // URL to the playlist cover image
            playlistCard.appendChild(img);

            const playDiv = document.createElement("div");
            playDiv.className = "play";
            playDiv.innerHTML = '<span class="fa fa-play"></span>';
            playlistCard.appendChild(playDiv);

            const title = document.createElement("h4");
            title.className = "album-title";
            title.id = "playlist-name";
            title.innerHTML = `${playlist.name} <span id="count">${playlist.count}</span>`; // Playlist name and song count
            playlistCard.appendChild(title);

            const creator = document.createElement("p");
            creator.id = "playlist-creator";
            creator.textContent = playlist.creator; // Playlist creator
            playlistCard.appendChild(creator);

            listContainer.appendChild(playlistCard);

            //choose one
            playlistCard.addEventListener("click", (event) => {
              event.preventDefault(); // Prevent the default link behavior

              // Store the data in localStorage
              sessionStorage.setItem("playlistName", playlist.name);
              sessionStorage.setItem("playlistCreator", playlist.creator);
              sessionStorage.setItem("playlistCount", playlist.count);
              sessionStorage.setItem("playlistPic", playlist.picture);

              // Redirect to the new page
              window.location.href = playlistCard.getAttribute("href");
            });
          });
        })
        .catch((error) => console.error("Error fetching playlists:", error));
    } catch (error) {
      console.error("Error logging in:", error);
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

// function sendData(element, identifier) {

//onclick="sendData(this, ${playlist.count})"
//   const playlistName = element.querySelector("#playlistName").innerText;
//   const playlistCreator = element.querySelector("#playlistCreator").innerText;
//   const counter = element.querySelector("#count").innerText;
//   // const count = counter.substring(counter.indexOf("("), counter.indexOf(")"));
//   // const userPlaylistImage = element.querySelector('#userplaylistimage').src;

//   localStorage.setItem("playlistName", playlistName);
//   localStorage.setItem("playlistCreator", playlistCreator);
//   localStorage.setItem("playlistCount", counter);

//   window.location.href = "/playlist.html"; // Replace with your target page
// }

// start test delete playlist

document.addEventListener("DOMContentLoaded", function () {});

// end test delete playlist

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
  fetch("https://localhost:7259/api/Artist/AllArtists") // Adjust URL if needed
    .then((response) => response.json())
    .then((data) => {
      const listContainer = document.getElementById("Popular-artists");
      listContainer.innerHTML = ""; // Clear existing content

      data.forEach((artist) => {
        console.log(artist.pic);

        const artistCard = document.createElement("a");
        artistCard.className = "item artist-card";
        artistCard.setAttribute("data-artist", artist.name);
        artistCard.setAttribute("data-artist-pic", artist.pic);
        artistCard.href = "/artistAfterlogin.html";

        const img = document.createElement("img");
        img.className = "artist-image";
        img.src = artist.pic; // URL to the artist's profile image
        artistCard.appendChild(img);

        const playDiv = document.createElement("div");
        playDiv.className = "play";
        playDiv.innerHTML = '<span class="fa fa-play"></span>';
        artistCard.appendChild(playDiv);

        const title = document.createElement("h4");
        title.className = "artist-title";
        title.textContent = artist.name; // Display artist's username
        artistCard.appendChild(title);

        const description = document.createElement("p");
        description.textContent = "Artist.";
        artistCard.appendChild(description);

        listContainer.appendChild(artistCard);
        //choose one
        artistCard.addEventListener("click", (event) => {
          event.preventDefault();
          sessionStorage.setItem("artistname", artist.name);
          sessionStorage.setItem("artistpic", artist.pic);
          window.location.href = artistCard.getAttribute("href");
        });
      });
    })
    .catch((error) => console.error("Error fetching artists:", error));
});

//Retrieve All Albums

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://localhost:7259/api/Artist/AllAlbums") // Adjust URL if needed
    .then((response) => response.json())
    .then((data) => {
      const listContainer = document.getElementById("Popular-Albums");
      listContainer.innerHTML = ""; // Clear existing content

      data.forEach((album) => {
        const albumCard = document.createElement("a");
        albumCard.className = "item album-card";
        albumCard.setAttribute("data-artist", album.artistname);
        albumCard.setAttribute("data-artist-pic", album.picture);
        albumCard.href = "/albumAfterLogin.html"; // URL to the album details page

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
        creator.textContent = `${album.artistname} - ${album.songs} songs`; // Artist name and number of songs
        albumCard.appendChild(creator);
        // choose one
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
    .catch((error) => console.error("Error fetching albums:", error));
});

//Retrieve All playlists

// document.addEventListener("DOMContentLoaded", function () {
//   fetch("https://localhost:7259/api/User/AllPlaylists")
//     .then((response) => response.json())
//     .then((data) => {
//       const playlistList = document.getElementById("Popular-Playlist");
//       playlistList.innerHTML = ""; // Clear existing content

//       data.forEach((playlist) => {
//         const playlistCard = document.createElement("a");
//         playlistCard.className = "item playlist-card";

//         playlistCard.dataset.playlistName = playlist.name;
//         playlistCard.dataset.playlistCreator = playlist.creator;
//         playlistCard.dataset.playlistPic = playlist.picture;
//         playlistCard.href = "/playlist.html";

//         playlistCard.innerHTML = `
//                   <img class="album-image" src="assets/images/the last peace of art4.png" />
//                   <div class="play">
//                       <span class="fa fa-play"></span>
//                   </div>
//                   <h4 class="album-title" id="playlist-name">
//                       ${playlist.name} <span id="count">${playlist.count} songs</span>
//                   </h4>
//                   <p id="playlist-creator">by ${playlist.creator}</p>
//               `;

//         playlistCard.addEventListener("click", (event) => {
//           event.preventDefault(); // Prevent the default link behavior

//           // Store the data in localStorage
//           localStorage.setItem("playlistName", playlist.name);
//           localStorage.setItem("playlistCreator", playlist.creator);
//           localStorage.setItem("playlistCount", playlist.count);
//           // localStorage.setItem("playlistPic", playlistPic);

//           // Redirect to the new page
//           window.location.href = playlistCard.getAttribute("href");
//         });

//         playlistList.appendChild(playlistCard);
//       });
//     })
//     .catch((error) => console.error("Error fetching playlists:", error));

//   const showAllButton = document.getElementById("showAll3");
//   showAllButton.addEventListener("click", function () {
//     const playlistList = document.getElementById("Popular-Playlist");
//     playlistList.style.overflowX = "auto";
//   });
// });

fetch("https://localhost:7259/api/User/AllPlaylists") // Adjust URL if needed
  .then((response) => response.json())
  .then((data) => {
    const listContainer = document.getElementById("Popular-Playlist");
    listContainer.innerHTML = ""; // Clear existing content

    data.forEach((playlist) => {
      const playlistCard = document.createElement("a");
      playlistCard.className = "item playlist-card";
      playlistCard.setAttribute("data-playlist-name", playlist.name);
      playlistCard.setAttribute("data-playlist-creator", playlist.creator);
      playlistCard.setAttribute("data-playlist-pic", playlist.picture);
      playlistCard.href = "/playlist.html"; // URL to the playlist details page

      const img = document.createElement("img");
      img.className = "playlist-image";
      img.src = playlist.picture; // URL to the playlist cover image
      playlistCard.appendChild(img);

      const playDiv = document.createElement("div");
      playDiv.className = "play";
      playDiv.innerHTML = '<span class="fa fa-play"></span>';
      playlistCard.appendChild(playDiv);

      const title = document.createElement("h4");
      title.className = "album-title";
      title.id = "playlist-name";
      title.innerHTML = `${playlist.name} <span id="count">${playlist.count}</span>`; // Playlist name and song count
      playlistCard.appendChild(title);

      const creator = document.createElement("p");
      creator.id = "playlist-creator";
      creator.textContent = playlist.creator; // Playlist creator
      playlistCard.appendChild(creator);

      listContainer.appendChild(playlistCard);

      //choose one
      playlistCard.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default link behavior

        // Store the data in localStorage
        sessionStorage.setItem("playlistName", playlist.name);
        sessionStorage.setItem("playlistCreator", playlist.creator);
        sessionStorage.setItem("playlistCount", playlist.count);
        sessionStorage.setItem("playlistPic", playlist.picture);

        // Redirect to the new page
        window.location.href = playlistCard.getAttribute("href");
      });
    });
  })
  .catch((error) => console.error("Error fetching playlists:", error));

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

// test Refresh token

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

// show all items
// artists

//
const showAllButton = document.getElementById("showAll1");
showAllButton.addEventListener("click", function () {
  const playlistList = document.getElementById("Popular-artists");
  playlistList.style.overflowX = "auto";
});
// albums
const showAllButton2 = document.getElementById("showAll2");
showAllButton2.addEventListener("click", function () {
  const playlistList = document.getElementById("Popular-Albums");
  playlistList.style.overflowX = "auto";
});
// playlist
const showAllButton3 = document.getElementById("showAll3");
showAllButton3.addEventListener("click", function () {
  const playlistList = document.getElementById("Popular-Playlist");
  playlistList.style.overflowX = "auto";
});

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
        if (songTitleSpan && songArtistSpan) {
          const songName = songTitleSpan.textContent
            .trim()
            .split("\n")[0]
            .trim();
          const songArtist = songArtistSpan.textContent;

          var ResumesongName = localStorage.getItem("Resumesongname");
          var ResumeArtistName = localStorage.getItem("Resumeartistname");
          if (ResumesongName && ResumeArtistName) {
            document.getElementById("Song-name").innerText = ResumesongName;
            document.getElementById("song-artist").innerText = ResumeArtistName;
            fetchSongAudio(ResumesongName);
            fetchSongImage(ResumesongName);
          } else {
            document.getElementById("Song-name").innerText = songName;
            document.getElementById("song-artist").innerText = songArtist;
            fetchSongAudio(songName);
            fetchSongImage(songName);
          }
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
    var Resumesongtime = localStorage.getItem("ResumeaduioTime");
    if (Resumesongtime) {
      audio.currentTime = Resumesongtime;
    }
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
