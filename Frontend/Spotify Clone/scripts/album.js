const data = JSON.parse(localStorage.getItem("selected-album"));

document.querySelector(".album-title").innerHTML=data.title;
const albumImage = document.getElementById("albumImage");
albumImage.src = data.image;



document.querySelector(".album-info .artist-name").innerHTML=data.artist;

console.log(data.image)
const artistImage = document.getElementById("artistImage");
artistImage.src = data.artistPic;


document.title = data.title;
