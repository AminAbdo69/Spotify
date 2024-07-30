using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Spotify.Classes.DTO;
using Spotify.Data;

namespace Spotify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(DataBase db) : ControllerBase
    {

        [HttpPost("AddPlaylist") , Authorize]
        public ActionResult<string> AddPlaylist(AddPlaylistDTO request)
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
            Playlist playlist = new()
            {
                PlaylistName = request.playlistname,
                PlaylistDate = DateTime.Now,
                UserId = user.UserId,
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

        //[HttpGet("GetPlaylistSongs")]
        //public ActionResult<List<PlaylistSongOut>> GetPlaylistSongs(string playlistName)
        //{
        //    if (String.IsNullOrEmpty(playlistName))
        //    {
        //        return BadRequest("Invalid playlist name.");
        //    }

        //    var playlist = db.Playlists
        //        .Include(p => p.PlaylistSongs)
        //        .ThenInclude(ps => ps.Song)
        //        .ThenInclude(s => s.Artist)
        //        .SingleOrDefault(p => p.PlaylistName == playlistName);

        //    if (playlist == null)
        //    {
        //        return NotFound("Playlist doesn't exist.");
        //    }

        //    List<PlaylistSongOut> playlistSongs = new List<PlaylistSongOut>();

        //    foreach (var playlistSong in playlist.PlaylistSongs)
        //    {
        //        var song = playlistSong.Song;
        //        playlistSongs.Add(new PlaylistSongOut()
        //        {
        //            SongName = song.SongName,
        //            Duration = song.Duration,
        //            artistName = song.Artist.Username
        //        });
        //    }

        //    return Ok(playlistSongs);
        //}

    }
}
