//global
var artistname = sessionStorage.getItem("username");

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

// document.getElementById("albumbtn").addEventListener("click", function (event) {
//   event.preventDefault();

//   var ArtistName = artistname;
//   var albumname = document.getElementById("albumName2").value;
//   const albumDTO = {
//     ArtistName: ArtistName,
//     AlbumName: albumname,
//   };

//   fetch("https://localhost:7259/api/Artist/AddAlbum", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(albumDTO),
//   })
//     .then((response) => response.text())
//     .then((data) => {
//       alert(data);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// });

document
  .getElementById("albumbtn")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const albumDTO = {
      AlbumName: document.getElementById("albumName2").value,
      ArtistName: artistname,
    };

    try {
      // Add the album
      const addAlbumResponse = await fetch(
        "https://localhost:7259/api/Artist/AddAlbum",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(albumDTO),
        }
      );

      if (!addAlbumResponse.ok) {
        const errorText = await addAlbumResponse.text();
        alert(`Error: ${errorText}`);
        return;
      }

      alert(await addAlbumResponse.text());

      // Fetch all albums for the artist
      const artistName = artistname;
      const getAlbumsResponse = await fetch(
        `https://localhost:7259/api/Artist/ArtistAlbums?artistName=${artistName}`
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

// document.getElementById("songbtn").addEventListener("click", function (event) {
//   event.preventDefault();

//   const songDTO = {
//     Songname: document.getElementById("songName").value,
//     Albumname: document.getElementById("albumName").value,
//     artistusename: artistname,
//     Duration: parseFloat(document.getElementById("duration").value),
//   };

//   fetch("https://localhost:7259/api/Artist/AddSong", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(songDTO),
//   })
//     .then((response) => response.text())
//     .then((data) => {
//       alert(data);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// });

// document
//   .getElementById("songbtn")
//   .addEventListener("submit", async function (event) {
//     event.preventDefault();

//     const songDTO = {
//       Songname: document.getElementById("songName").value,
//       Albumname: document.getElementById("albumName").value,
//       artistusename: artistname,
//       Duration: parseFloat(document.getElementById("duration").value),
//     };

//     try {
//       // Add the song
//       const addSongResponse = await fetch(
//         "https://localhost:7259/api/Artist/AddSong",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(songDTO),
//         }
//       );

//       if (!addSongResponse.ok) {
//         const errorText = await addSongResponse.text();
//         alert(`Error: ${errorText}`);
//         return;
//       }
//       console.log("added success");

//       // Fetch all songs for the artist
//       const artistName = songDTO.artistusename;
//       const getSongsResponse = await fetch(
//         `https://localhost:7259/api/Artist/ArtistSongs?artistName=${artistName}`
//       );

//       if (!getSongsResponse.ok) {
//         const errorText = await getSongsResponse.text();
//         alert(`Error: ${errorText}`);
//         return;
//       }

//       const songs = await getSongsResponse.json();
//       populateSongsTable(songs);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred while processing your request.");
//     }
//   });

// function populateSongsTable(songs) {
//   const tbody = document.getElementById("songsTable").querySelector("tbody");
//   tbody.innerHTML = ""; // Clear existing rows

//   songs.forEach((song) => {
//     const row = document.createElement("tr");
//     row.innerHTML = `
//           <td>${song.songName}</td>
//           <td>${song.duration}</td>
//           <td>${new Date(song.releaseDate).toLocaleDateString()}</td>
//       `;
//     tbody.appendChild(row);
//   });
// }

document
  .getElementById("songbtn")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const songDTO = {
      Songname: document.getElementById("songName").value,
      Albumname: document.getElementById("albumName").value,
      artistusename: artistname,
      Duration: parseFloat(document.getElementById("duration").value),
    };

    try {
      // Add the song
      const addSongResponse = await fetch(
        "https://localhost:7259/api/Artist/AddSong",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(songDTO),
        }
      );

      if (!addSongResponse.ok) {
        const errorText = await addSongResponse.text();
        alert(`Error: ${errorText}`);
        return;
      }

      alert(await addSongResponse.text());

      // Fetch all songs for the artist
      const artistName = artistname;
      const getSongsResponse = await fetch(
        `https://localhost:7259/api/Artist/ArtistSongs?artistName=${artistName}`
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
