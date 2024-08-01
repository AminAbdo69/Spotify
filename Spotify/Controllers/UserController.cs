using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Spotify.Classes.DTO.AlbumDTO;
using Spotify.Classes.DTO.PlaylistDTO;
using Spotify.Data;
using System;
using System.Linq;

namespace Spotify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(DataBase db , IWebHostEnvironment environment) : ControllerBase
    {

        #region Playlists

        [HttpPost("AddPlaylist") ]
        public ActionResult<string> AddPlaylist([FromForm]AddPlaylistDTO request)
        {
            if (String.IsNullOrEmpty(request.playlistname))
            {
                return BadRequest("invalid playlist name , choose another one.");
            }
            User user = db.Users.FirstOrDefault(u=>u.UserName ==  request.playlistcreator);
            if (user == null)
            {
                return NotFound("user dosen't exists .");
            }



            if (request.Image == null || request.Image.Length == 0)
            {
                return BadRequest("No image for yourprofile was uploaded.");
            }

            var extention = Path.GetExtension(request.Image.FileName).ToLowerInvariant();
            var allowedExtentions = new string[] { ".png", ".jpeg", ".jpg", ".avif" };

            if (!allowedExtentions.Contains(extention))
            {
                return BadRequest("Unsupport image format.");
            }
            var filePath = SaveProfileImage(request.playlistname, request.Image);


            Playlist playlist = new()
            {
                PlaylistName = request.playlistname,
                PlaylistDate = DateTime.Now,
                UserId = user.UserId,
                picpath = filePath,
            };



            bool playlistExists = db.Playlists.Any(p => p.UserId == user.UserId && p.PlaylistName == request.playlistname);
            if (playlistExists)
            {
                return Conflict($"This playlist has already been created by {user.UserName}.");
            }
            user.CreatedPlaylists.Add(playlist);
            db.Users.Update(user);
            db.Playlists.Add(playlist);
            
            db.SaveChanges();
            return Ok($" {request.playlistname} Has Been Created Successfully");
        }

        [HttpGet("UserPlayllists")]
        public ActionResult<List<PlaylistOutDTO>> getUserPlayllists(string username)
        {
            if (String.IsNullOrEmpty(username))
            {
                return BadRequest("Invalid username.");
            }
            var user = db.Users
                .Include(u => u.CreatedPlaylists)
                .SingleOrDefault(u => u.UserName == username);

            if (user == null)
            {
                return NotFound("user doesn't exist.");
            }

            List<PlaylistOutDTO> UserPlayllists = [];

            foreach (Playlist playlist in user.CreatedPlaylists)
            {
                UserPlayllists.Add(new PlaylistOutDTO()
                {
                    PlaylistName = playlist.PlaylistName,
                    PlaylistDate = playlist.PlaylistDate,
                    PlaylistsoungCount = playlist.PlaylistsoungCount,
                    PLaylistLovers = playlist.PLaylistLovers,
                    PlaylistSongs =playlist.PlaylistSongs 
                });
            }
            return Ok(UserPlayllists);

        }

        [HttpGet("UserPlayllists2")]
        public ActionResult<List<PlaylistOutDTO2>> getUserPlayllists2(string username)
        {
            if (String.IsNullOrEmpty(username))
            {
                return BadRequest("Invalid username.");
            }
            var user = db.Users
                .Include(u => u.CreatedPlaylists)
                .SingleOrDefault(u => u.UserName == username);

            if (user == null)
            {
                return NotFound("user doesn't exist.");
            }

            List<PlaylistOutDTO2> UserPlayllists = [];

            foreach (Playlist playlist in user.CreatedPlaylists)
            {

                UserPlayllists.Add(new PlaylistOutDTO2()
                {
                    name = playlist.PlaylistName,
                    creator = user.UserName,
                    count = playlist.PlaylistsoungCount,
                });
            }
            return Ok(UserPlayllists);

        }

        [HttpPost("AddPlaylistSong") , Authorize]
        public ActionResult<string> AddPlaylistSong(AddPlaylistSongDTO request)
        {
            Playlist playlist = db.Playlists.FirstOrDefault(p=>p.PlaylistName == request.playlistName);
            if(playlist == null)
            {
                return NotFound("Not Found this playlist.");
            }

            Song song = db.Songs.FirstOrDefault(s=>s.SongName ==  request.songName);
            if(song == null)
            {
                return NotFound("Not Found this Song.");
            }
            bool songExists = playlist.PlaylistSongs.Any(s => s.SongId == song.SongId);
            if (songExists)
            {
                return Conflict($"{song.SongName} is already in the playlist {playlist.PlaylistName}.");
            }

            playlist.PlaylistSongs.Add(song);
            playlist.PlaylistsoungCount = playlist.PlaylistsoungCount + 1; // Corrected typo
            db.Playlists.Update(playlist);
            db.SaveChanges();
            return Ok($"{song.SongName} Has been added to {playlist.PlaylistName}");
        }

        [HttpGet("GetPlaylistSongs")]
        public ActionResult<List<PlaylistSongOut>> GetPlaylistSongs(string playlistName)
        {
            if (String.IsNullOrEmpty(playlistName))
            {
                return BadRequest("Invalid username.");
            }
            var playlist = db.Playlists
                .Include(u => u.PlaylistSongs)
                .SingleOrDefault(u => u.PlaylistName == playlistName);

            if (playlist == null)
            {
                return NotFound("user doesn't exist.");
            }

            List<PlaylistSongOut> PlaylistSongs = [];

            foreach (Song song in playlist.PlaylistSongs)
            {
                var artistId = song.ArtistId;
                Artist artist = db.Artists.FirstOrDefault(a=>a.ArtistId == artistId);

                PlaylistSongs.Add(new PlaylistSongOut()
                {
                    SongName = song.SongName,
                    Duration = song.Duration,
                    artistName = artist.Username,
                    count = playlist.PlaylistsoungCount,
                });
            }

            return Ok(PlaylistSongs);
        }


        [HttpGet("AllPlaylists")]
        public ActionResult<List<PlaylistOutDTO3>> GetAllPlaylists()
        {
            var playlists = db.Playlists
                .Include(p => p.User)
                .ToList();

            List<PlaylistOutDTO3> allPlaylists = new List<PlaylistOutDTO3>();

            foreach (Playlist playlist in playlists)
            {
                allPlaylists.Add(new PlaylistOutDTO3()
                {
                    name = playlist.PlaylistName,
                    creator = playlist.User.UserName,
                    count = playlist.PlaylistsoungCount,
                    picture = playlist.picpath
                });
            }
            return Ok(allPlaylists);
        }

        [HttpPost("LikePlaylist")]
        public ActionResult<string> LikeAlbum(LikedPlaylistDTO likedPlaylist)
        {
            var playlist = db.Playlists
                .Include(p => p.PLaylistLovers)
                .SingleOrDefault(p => p.PlaylistName == likedPlaylist.playlistname);

            if (playlist == null)
            {
                return NotFound("Playlist not found.");
            }

            User user = db.Users.FirstOrDefault(u => u.UserName == likedPlaylist.username);
            if (user == null)
            {
                return NotFound("User not found.");
            }


            if (playlist.PLaylistLovers.Contains(user))
            {
                return BadRequest($"{likedPlaylist.username} is already liked {likedPlaylist.playlistname}.");
            }

            user.LikedPlaylists.Add(playlist);
            playlist.PLaylistLovers.Add(user);
            db.SaveChanges();
            return Ok($"{likedPlaylist.username} has liked {likedPlaylist.playlistname} successfully.");
        }

        #endregion



        private string SaveProfileImage(string Username, IFormFile Image)
        {
            var uploadFolder = Path.Combine(environment.ContentRootPath, "ProfileArtistImages");

            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            var extention = Path.GetExtension(Image.FileName).ToLowerInvariant();

            var imagePath = Path.Combine(uploadFolder, $"{Username}{extention}");

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                Image.CopyTo(fileStream);
            }

            return Path.Combine("ProfileArtistImages", $"{Username}{extention}");
        }

        private string SaveAudioFile(string username, IFormFile audioFile)
        {
            var uploadFolder = Path.Combine(environment.ContentRootPath, "ArtistAudioFiles");

            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            var extension = Path.GetExtension(audioFile.FileName).ToLowerInvariant();
            var audioPath = Path.Combine(uploadFolder, $"{username}{extension}");

            using (var fileStream = new FileStream(audioPath, FileMode.Create))
            {
                audioFile.CopyTo(fileStream);
            }

            return Path.Combine("ArtistAudioFiles", $"{username}{extension}");
        }


    }
}
