//global
// var Artist = sessionStorage.getItem("Artist");
// console.log(Artist);

// var artistname = Artist.username;
// var artistEmail = Artist.email;
// var artistProfilePicture = Artist.profilePicture;
// var artistIsActive = Artist.isActive;

var artistname = sessionStorage.getItem("ArtistName");
var artistEmail = sessionStorage.getItem("Artistemail");
var artistProfilePicture = sessionStorage.getItem("Artistimage");
var artistIsActive = sessionStorage.getItem("Artistisactive");

if (artistIsActive === false) {
  location.href = "/artist/changepassword.html";
}

document.querySelectorAll("#artistname").forEach((element) => {
  element.textContent = artistname;
});

//select sections
document.getElementById("btn1").addEventListener("click", function () {
  showSection("section1");
  document.getElementById("btn1").style.backgroundColor = " #f6f6f6";
  document.getElementById("btn2").style.backgroundColor = "white";
  document.getElementById("btn3").style.backgroundColor = "white";
});
document.getElementById("btn2").addEventListener("click", function () {
  showSection("section2");
  document.getElementById("btn1").style.backgroundColor = "white";
  document.getElementById("btn2").style.backgroundColor = "#f6f6f6";
  document.getElementById("btn3").style.backgroundColor = "white";
});
document.getElementById("btn3").addEventListener("click", function () {
  showSection("section3");
  document.getElementById("btn1").style.backgroundColor = "white";
  document.getElementById("btn2").style.backgroundColor = "white";
  document.getElementById("btn3").style.backgroundColor = "#f6f6f6";
});

function showSection(sectionId) {
  document.querySelectorAll("main section").forEach((section) => {
    section.classList.remove("activesection");
  });
  document.getElementById(sectionId).classList.add("activesection");
}

// add album

document
  .getElementById("albumbtn")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("albumName", document.getElementById("albumName2").value);
    formData.append("image", document.getElementById("AlbumImage").files[0]);
    formData.append("artistName", artistname); // Replace with the actual artist name

    try {
      // Add the album
      const addAlbumResponse = await fetch(
        "https://localhost:7259/api/Artist/AddAlbum",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!addAlbumResponse.ok) {
        const errorText = await addAlbumResponse.text();
        console.error(errorText);
        alert(`Error: ${errorText}`);
        return;
      }

      alert(await addAlbumResponse.text());

      // Fetch all albums for the artist
      const getAlbumsResponse = await fetch(
        `https://localhost:7259/api/Artist/ArtistAlbums?artistName=${artistname}`
      );

      if (!getAlbumsResponse.ok) {
        const errorText = await getAlbumsResponse.text();
        alert(`Error: ${errorText}`);
        return;
      }

      const albums = await getAlbumsResponse.json();
      populateAlbumsTable(albums);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    }
  });

function populateAlbumsTable(albums) {
  const tab = document.getElementById("albumsTable");
  tab.style.opacity = "1";
  const tbody = document.getElementById("albumsTable").querySelector("tbody");
  tbody.innerHTML = ""; // Clear existing rows

  albums.forEach((album) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${album.albumname}</td>
            <td>${new Date(album.releaseDate).toLocaleDateString()}</td>
            <td>${album.nsongs}</td>
        `;
    tbody.appendChild(row);
  });
}

// add song

document
  .getElementById("songbtn")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("songname", document.getElementById("songName").value);
    formData.append("albumname", document.getElementById("albumName").value);
    formData.append("duration", document.getElementById("duration").value);
    formData.append("image", document.getElementById("songImage").files[0]);
    formData.append("audio", document.getElementById("songAudio").files[0]);
    formData.append("artistusename", artistname);

    // const songDTO = {
    //   Songname: document.getElementById("songName").value,
    //   Albumname: document.getElementById("albumName").value,
    //   artistusename: artistname,
    //   Duration: parseFloat(document.getElementById("duration").value),
    // };

    try {
      // Add the song
      const addSongResponse = await fetch(
        "https://localhost:7259/api/Artist/AddSong",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!addSongResponse.ok) {
        const errorText = await addSongResponse.text();
        alert(`Error: ${errorText}`);
        return;
      }

      alert(await addSongResponse.text());

      // Fetch all songs for the artist
      const getSongsResponse = await fetch(
        `https://localhost:7259/api/Artist/ArtistSongs?artistName=${artistname}`
      );

      if (!getSongsResponse.ok) {
        const errorText = await getSongsResponse.text();
        alert(`Error: ${errorText}`);
        return;
      }

      const songs = await getSongsResponse.json();
      populateSongsTable(songs);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    }
  });

function populateSongsTable(songs) {
  const tab2 = document.getElementById("songsTable");
  tab2.style.opacity = "1";
  const tbody = document.getElementById("songsTable").querySelector("tbody");
  tbody.innerHTML = ""; // Clear existing rows

  songs.forEach((song) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${song.songName}</td>
          <td>${song.duration}</td>
          <td>${new Date(song.releaseDate).toLocaleDateString()}</td>
      `;
    tbody.appendChild(row);
  });
}

// retrieve artist image
function fetchArtistProfileImage(username) {
  // Replace with your actual API endpoint
  const apiUrl = `https://localhost:7259/api/Artist/ArtistImage/${username}`;

  fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "image/jpg",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching image: ${response.status}`);
      } 
      return response.blob();
    })
    .then((blob) => {
      // Create an object URL from the blob
      const imageUrl = URL.createObjectURL(blob);
      console.log(imageUrl);
      

      // Display the image (e.g., set it as the source of an <img> tag)
      // const imgElement = document.getElementById("Artist-image");
      // imgElement.src = imageUrl;
      document.querySelectorAll("#Artist-image").forEach((element) => {
        element.src = imageUrl;
      });
    })
    .catch((error) => {
      console.error("Error fetching image:", error);
    });
}

// Call the function with the artist's username
fetchArtistProfileImage(artistname); // Replace with the actual username
// async function fetchAlbumImage() {
//   try {
//     const response = await fetch(
//       `https://localhost:7259/api/ArtistImage/${username}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "image/jpg",
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const blob = await response.blob();
//     const imageUrl = URL.createObjectURL(blob);
//     const imgElement = document.getElementById("Artist-image");
//     imgElement.src = imageUrl;
//   } catch (e) {
//     console.log(e);
//   }
// }

// function fetchArtistImage(username) {
//   // Replace with your actual API endpoint
//   const apiUrl = `https://localhost:7259/api/ArtistImage/${username}`;

//   fetch(apiUrl)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`Error fetching image: ${response.status}`);
//       }
//       return response.blob();
//     })
//     .then((blob) => {
//       // Create an object URL from the blob
//       const imageUrl = URL.createObjectURL(blob);

//       // Display the image (e.g., set it as the source of an <img> tag)
//       const imgElement = document.getElementById("Artist-image");
//       imgElement.src = imageUrl;
//     })
//     .catch((error) => {
//       console.error("Error fetching image:", error);
//     });
// }

// Call the function with the artist's username
// fetchArtistImage(artistname); // Replace with the actual username
