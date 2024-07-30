
  // Retrieve the data from localStorage
  const playlistName = localStorage.getItem('playlistName');
  const playlistPic = "assets/images/the last peace of art4.png";
  const playlistCreator = localStorage.getItem('playlistCreator');
  const playlistCount = localStorage.getItem('playlistCount');
  console.log(playlistName);
  console.log(playlistCount);
  // console.log(playlistPic);
  console.log(playlistCreator);
  // Display the data
  document.getElementById("playlistName2").innerText = playlistName;
  document.getElementById('albumImage').src = playlistPic;
  document.getElementById('username').textContent = playlistCreator;
  document.getElementById('numSongs').innerText = playlistCount;


  // // Make a request to get the playlist's songs
  // fetch(`https://localhost:7259/api/Artist/GetPlaylistSongs?playlistName=${playlistName}`)
  // .then(response => response.json())
  // .then(songs => {
  //   const songList = document.getElementById('playlistSongs');
  //   songList.innerHTML = ''; // Clear existing content

  //   songs.forEach(song => {
  //     const songItem = document.createElement('li');
  //     songItem.innerHTML = `
  //       <span class="song-title">
  //         ${song.songName} <br>
  //         <span class="artistName">${song.artistName}</span>
  //       </span>
  //       <span class="duration">
  //         <i class="fa-regular fa-heart"></i>
  //         <span class="time">${song.duration}</span>
  //         <i class="fa-solid fa-ellipsis"></i>
  //       </span>
  //     `;
  //     songList.appendChild(songItem);
  //   });
  // })
  // .catch(error => console.error('Error fetching songs:', error));

  document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the data from localStorage
    const playlistName = localStorage.getItem('playlistName');
    // const playlistPic = localStorage.getItem('playlistPic');
    const playlistCreator = localStorage.getItem('playlistCreator');

    // Display the data
    if (playlistName && playlistPic && playlistCreator) {
      document.getElementById('playlistName').textContent = playlistName;
      // document.getElementById('playlistImage').src = playlistPic;
      document.getElementById('playlistCreator').textContent = playlistCreator;

      // Make a request to get the playlist's songs
      fetch(`https://localhost:7259/api/User/GetPlaylistSongs?playlistName=${playlistName}`)
        .then(response => response.json())
        .then(songs => {
          const songList = document.getElementById('playlistSongs');
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
    }
  });