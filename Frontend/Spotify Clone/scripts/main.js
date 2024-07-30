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

document
  .getElementById("createPlaylist")
  .addEventListener("click", function () {
    var hintContainer = document.querySelector(".hint-container");
    hintContainer.style.display = "block"; // Show the hint-container
  });
