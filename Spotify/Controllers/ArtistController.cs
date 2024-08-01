using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Spotify.Classes.DTO.AlbumDTO;
using Spotify.Classes.DTO.ArtistDTO;
using Spotify.Classes.DTO.SongDTO;
using Spotify.Data;
using Spotify.Services.UserServices;
using System;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Spotify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistController(DataBase db, IConfiguration config ,IWebHostEnvironment environment) : ControllerBase
    {


        #region Artist Functions



        [HttpPost("Artistregister")]
        public ActionResult<string> Register([FromForm]ArtistRegisterDTO request)
        {
            if (!IsValidUsername(request.Username))
            {
                return BadRequest("Invalid Username");
            }
            if (!IsValidEmail(request.Email))
            {
                return BadRequest("Invalid Email");
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

            if (db.Artists.FirstOrDefault(u => u.Username == request.Username) != null)
            {
                return Conflict("Username is already exists. Please choose a different username.");
            }
            string password = request.Username + "111";
            CreatePasswordHash(password, out byte[] PasswordHash, out byte[] PasswordSalt);

            var filePath = SaveProfileImage(request.Username, request.Image);

            Artist artist = new()
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = PasswordHash,
                PasswordSalt = PasswordSalt,
                ProfilePicture = filePath
            };

            db.Artists.Add(artist);
            db.SaveChanges();

            return Ok("your request has been send successfully");

        }
        

        [HttpGet("ArtistImage/{Username}")]
        public IActionResult GetArtistImage(string Username)
        {
            if (string.IsNullOrEmpty(Username))
            {
                return BadRequest("USername is invalid.");
            }

            Artist? artist = db.Artists.SingleOrDefault(u => u.Username == Username);

            if (artist == null)
            {
                return NotFound("Artist not found.");
            }

            if (string.IsNullOrEmpty(artist.ProfilePicture))
            {
                return NotFound("Image not found.");
            }

            var filePath = Path.Combine(environment.ContentRootPath, artist.ProfilePicture);
            var extention = Path.GetExtension(artist.ProfilePicture).ToLowerInvariant();

            var image = System.IO.File.OpenRead(filePath);

            return File(image, $"image/{extention.TrimStart('.')}");
        }

        [HttpPost("Artistlogin")]
        public ActionResult<Artist> Login(ArtistLoginDTO request)
        {

            if (
              String.IsNullOrEmpty(request.Username) ||
              String.IsNullOrEmpty(request.Password)
            )
            {
                return BadRequest("Please provide the required info.");
            }

            Artist? artist =  db.Artists.FirstOrDefault(u => u.Username == request.Username);

            if (artist == null)
            {
                return NotFound("Artist not found. Please check your username and password.");
            }

            if (!VerifyPasswordHash(request.Password, artist.PasswordHash, artist.PasswordSalt))
            {
                return BadRequest("Wrong Password Entered");
            }
            Response.Cookies.Append("Username", request.Username, new CookieOptions
            {
                Secure = true,
                HttpOnly = false,
                SameSite = SameSiteMode.None,
            });

            Response.Cookies.Append("Role", "Artist", new CookieOptions
            {
                Secure = true,
                HttpOnly = false,
                SameSite = SameSiteMode.None,
            });

            return Ok(artist);
        }


        [HttpGet("ArtistSongs")]
        public ActionResult<List<SongoutDTO>> getArtistsongs(string artistName)
        {
            if (String.IsNullOrEmpty(artistName))
            {
                return BadRequest("Invalid username.");
            }
            var artist = db.Artists
                .Include(u => u.Songs)
                .SingleOrDefault(u => u.Username == artistName);

            if (artist == null)
            {
                return NotFound("artist doesn't exist.");
            }
            if (!artist.IsActive)
            {
                return Unauthorized("Please activate the account by changing your default password.");
            }
            List<SongoutDTO> ArtistSongs = [];

            foreach (Song song in artist.Songs)
            {
                ArtistSongs.Add(new SongoutDTO()
                {
                    SongName = song.SongName,
                    Duration = song.Duration,
                    ReleaseDate = song.ReleaseDate
                });
            }
            return Ok(ArtistSongs);
        }


        [HttpGet("ArtistAlbums")]
        public ActionResult<List<AlbumOutDTO>> getArtistAlbums(string artistName)
        {
            if (String.IsNullOrEmpty(artistName))
            {
                return BadRequest("Invalid username.");
            }
            var artist = db.Artists
                .Include(u => u.CreatedAlbums)
                .SingleOrDefault(u => u.Username == artistName);

            if (artist == null)
            {
                return NotFound("artist doesn't exist.");
            }
            if (!artist.IsActive)
            {
                return Unauthorized("Please activate the account by changing your default password.");
            }
            List<AlbumOutDTO> ArtistAlbums = [];

            foreach (Album album in artist.CreatedAlbums)
            {
                ArtistAlbums.Add(new AlbumOutDTO()
                {
                    albumname = album.AlbumName,
                    ReleaseDate = album.ReleaseDate,
                    Nsongs = album.Nsongs
                });
            }
            return Ok(ArtistAlbums);

        }


        [HttpPost("ChangeData")]

        public ActionResult<string> ChangeData(ChangedataDTO request)
        {
            if (!IsValidPassword(request.NewPassword))
            {
                return BadRequest("Invalid Password Structue");
            }
            if (request.NewPassword != request.ConfirmPassword)
            {
                return BadRequest("NewPassword not matched with ConfirmPassword , Try again.");
            }
            Artist artist = db.Artists.FirstOrDefault(a => a.Username == request.Username);
            if (artist == null)
            {
                return NotFound("Not Found this Artist");
            }
            UpdatePassword(artist.Username, request.NewPassword);

            return Ok("Data has been changed successfully");
        }


        [HttpGet("AllArtists")]
        public ActionResult<List<ArtistOutDTO>> GetAllArtists()
        {
            var artists = db.Artists.ToList();

            List<ArtistOutDTO> allArtists = new List<ArtistOutDTO>();

            foreach (Artist artist in artists)
            {
                if (artist.IsActive)
                {
                    allArtists.Add(new ArtistOutDTO()
                    {
                        name = artist.Username,
                        pic = artist.ProfilePicture
                    });
                }
                
            }
            return Ok(allArtists);
        }

        [HttpPost("followArtist")]
        public ActionResult<string> FollowArtist(FollowArtistDTO followArtist)
        {
            var artist = db.Artists
                .Include(p => p.Followers)
                .SingleOrDefault(p => p.Username == followArtist.ArtistName);
            if (artist == null)
            {
                return NotFound("Artist not found.");
            }

            User user = db.Users.FirstOrDefault(u => u.UserName == followArtist.UserName);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            

            if (artist.Followers.Contains(user))
            {
                return BadRequest($"{followArtist.UserName} is already following {followArtist.ArtistName}.");
            }

            user.FollowedArtists.Add(artist);
            artist.Followers.Add(user);
            db.SaveChanges();
            return Ok($"{followArtist.UserName} has followed {followArtist.ArtistName} successfully.");
        }

        #endregion

        #region Album Funcions




        [HttpPost("AddAlbum")]

        public ActionResult<string> AddAlbum([FromForm]AlbumDTO albumDTO)
        {
            Artist artist = db.Artists.FirstOrDefault(a => a.Username == albumDTO.ArtistName);
            if (artist == null)
            {
                return NotFound("Invalid Artist.");
            }
            if (!artist.IsActive)
            {
                return BadRequest("Acctivate your account first.");
            }

            if (String.IsNullOrEmpty(albumDTO.AlbumName))
            {
                return BadRequest("invalid Album Name.");
            }
            if (albumDTO.Image == null || albumDTO.Image.Length == 0)
            {
                return BadRequest("No image for your album was uploaded.");
            }

            var extention = Path.GetExtension(albumDTO.Image.FileName).ToLowerInvariant();
            var allowedExtentions = new string[] { ".png", ".jpeg", ".jpg", ".avif" };

            if (!allowedExtentions.Contains(extention))
            {
                return BadRequest("Unsupport image format.");
            }

            var filePath = SaveProfileImage(albumDTO.AlbumName, albumDTO.Image);
            Album album1 = new()
            {
                ArtistId = artist.ArtistId,
                AlbumName = albumDTO.AlbumName,
                ReleaseDate = DateTime.Now,
                picture = filePath
            };
           


            bool albumExists = db.Albums.Any(a => a.ArtistId == artist.ArtistId && a.AlbumName == albumDTO.AlbumName);
            if (albumExists)
            {
                return Conflict($"This album has already been created by {artist.Username}.");
            }
            

            artist.CreatedAlbums.Add(album1);
            db.Artists.Update(artist);
            db.Albums.Add(album1);
            db.SaveChanges();
            return Ok($" {albumDTO.AlbumName} Has Been Created Successfully");
        }

        [HttpGet("AlbumSongs")]
        public ActionResult<List<SongOutDTO2>> getAlbumSongs(string albunmname)
        {
            if (String.IsNullOrEmpty(albunmname))
            {
                return BadRequest("Invalid username.");
            }


            var album = db.Albums
                .Include(p => p.AlbumSongs)
                .ThenInclude(ps => ps.artist)

                .SingleOrDefault(p => p.AlbumName == albunmname);

            if (album == null)
            {
                return NotFound("artist doesn't exist.");
            }

            List<SongOutDTO2> AlbumSongs = [];

            foreach (Song song in album.AlbumSongs)
            {
                if (song.artist.IsActive)
                {
                    AlbumSongs.Add(new SongOutDTO2()
                    {
                        SongName = song.SongName,
                        Duration = song.Duration,
                        ArtistName = song.artist.Username
                    });
                }
                
            }
            return Ok(AlbumSongs);
        }


        [HttpGet("AllAlbums")]
        public ActionResult<List<AlbumOutDTO2>> GetAllAlbums()
        {
            var albums = db.Albums
                .Include(a => a.Artist)
                .ToList();

            List<AlbumOutDTO2> allAlbums = new List<AlbumOutDTO2>();

            foreach (Album album in albums)
            {
                if(album.Artist.IsActive) {
                    allAlbums.Add(new AlbumOutDTO2()
                    {
                        albumname = album.AlbumName,
                        artistname = album.Artist.Username,
                        picture = album.picture,
                        songs = album.Nsongs
                    });
                }
                
            }
            return Ok(allAlbums);
        }

        [HttpPost("LikeAlbum")]
        public ActionResult<string> LikeAlbum(LikedAlbumDTO likedAlbum)
        {
            var albums = db.Albums
                .Include(p => p.ALmubLikers)
                .SingleOrDefault(p => p.AlbumName == likedAlbum.albumname);

            if (albums == null)
            {
                return NotFound("Album not found.");
            }

            User user = db.Users.FirstOrDefault(u => u.UserName == likedAlbum.username);
            if (user == null)
            {
                return NotFound("User not found.");
            }


            if (albums.ALmubLikers.Contains(user))
            {
                return BadRequest($"{likedAlbum.username} is already liked {likedAlbum.albumname}.");
            }

            user.LikedAlbums.Add(albums);
            albums.ALmubLikers.Add(user);
            db.SaveChanges();
            return Ok($"{likedAlbum.username} has liked {likedAlbum.albumname} successfully.");
        }

        #endregion

        #region Song Functions 


        [HttpPost("AddSong")]
        public ActionResult<string> AddSong([FromForm]AddSongDTO songDTO)
        {
            if (String.IsNullOrEmpty(songDTO.Songname))
            {
                return BadRequest("invalid song name.");
            }
            Album album = db.Albums.FirstOrDefault(a => a.AlbumName == songDTO.Albumname);
            if (album == null)
            {
                return NotFound("not found this album");
            }
            Artist artist = db.Artists.FirstOrDefault(u => u.Username == songDTO.artistusename);
            if (artist == null)
            {
                return NotFound("not found this artist");
            }
            if (!artist.IsActive)
            {
                return BadRequest("Acctivate your account first.");
            }
            if (songDTO.Duration < 0 || songDTO.Duration > 10.0)
            {
                return BadRequest("Invalid song Duration.");
            }
            if (songDTO.Image == null || songDTO.Image.Length == 0)
            {
                return BadRequest("No image for yourprofile was uploaded.");
            }

            var extention = Path.GetExtension(songDTO.Image.FileName).ToLowerInvariant();
            var allowedExtentions = new string[] { ".png", ".jpeg", ".jpg", ".avif" };

            if (!allowedExtentions.Contains(extention))
            {
                return BadRequest("Unsupport image format.");
            }

            var filePath = SaveProfileImage(songDTO.Songname, songDTO.Image);




            if (songDTO.Audio == null || songDTO.Audio.Length == 0)
            {
                return BadRequest("No audio file was uploaded.");
            }

            var extension2 = Path.GetExtension(songDTO.Audio.FileName).ToLowerInvariant();
            var allowedExtensions2 = new string[] { ".mp3", ".wav" };

            if (!allowedExtensions2.Contains(extension2))
            {
                return BadRequest("Unsupported audio format.");
            }

            var filePath2 = SaveAudioFile(songDTO.Songname, songDTO.Audio);



            Song song1 = new()
            {
                AlbumId = album.AlbumId,
                ArtistId = artist.ArtistId,
                SongName = songDTO.Songname,
                Duration = songDTO.Duration,
                ReleaseDate = DateTime.Now,
                picture = filePath,
                path = filePath2
            };

            bool songExistsInAlbum = db.Songs.Any(s => s.AlbumId == album.AlbumId && s.SongName == songDTO.Songname);
            if (songExistsInAlbum)
            {
                return Conflict($"This song already exists in the {album.AlbumName} album.");
            }

            bool songExistsForArtist = db.Songs.Any(s => s.ArtistId == artist.ArtistId && s.SongName == songDTO.Songname);
            if (songExistsForArtist)
            {
                return Conflict($"This song has already been created by {artist.Username}.");
            }

            artist.Songs.Add(song1);
            album.AlbumSongs.Add(song1);
            album.Nsongs = album.Nsongs + 1;
            db.Songs.Add(song1);

            db.Artists.Update(artist);
            db.Albums.Update(album);
            db.SaveChanges();

            return Ok($"{songDTO.Songname} has been created successfully.");

        }


        #endregion


        #region Helpers 
        private static void CreatePasswordHash(string Password, out byte[] PasswordHash, out byte[] PasswordSalt)
        {
            using var hmac = new HMACSHA512();
            PasswordSalt = hmac.Key;
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(Password));
        }

        private static bool VerifyPasswordHash(string Password, byte[] PasswordHash, byte[] PasswordSalt)
        {
            using var hmac = new HMACSHA512(PasswordSalt);
            byte[] ComputedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(Password));
            return ComputedHash.SequenceEqual(PasswordHash);
        }

        private void UpdatePassword(string username ,  string Password)
        {
            CreatePasswordHash(Password, out byte[] PasswordHash, out byte[] PasswordSalt);
            Artist artist = db.Artists.FirstOrDefault(a =>a.Username == username);

            artist.PasswordHash = PasswordHash;
            artist.PasswordSalt = PasswordSalt;
            artist.IsActive = true;
            db.Update(artist);
            db.SaveChanges();
        }


        private string CreateToken(string Username, string Role)
        {
            List<Claim> claims =
            [
                new Claim(ClaimTypes.Name, Username),
                    new Claim(ClaimTypes.Role, Role)
            ];

            byte[] AppToken = Encoding.UTF8.GetBytes(config.GetSection("AppSettings:Token").Value);

            var Key = new SymmetricSecurityKey(AppToken);

            var credentials = new SigningCredentials(Key, SecurityAlgorithms.HmacSha512);

            var jwtSecurityToken = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials);

            var jwtToken = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

            return jwtToken;
        }

        private RefreshToken GenrateRefreshToken()
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.Now.AddDays(1),
                created = DateTime.Now
            };
            return refreshToken;
        }

        private void SetRefreshToken(String Username, RefreshToken refreshToken)
        {
            var cookieOption = new CookieOptions
            {
                HttpOnly = true,
                Expires = refreshToken.Expires
            };
            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOption);
            User user = db.Users.FirstOrDefault(u => u.UserName == Username);

            user.RefreshToken = refreshToken.Token;
            user.Tokencreated = refreshToken.created;
            user.TokenExpires = refreshToken.Expires;

            db.Update(user);
            db.SaveChanges();
        }


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

        #endregion

        #region Register Validation
        //public bool IsValidEmail(string email)
        //{

        //    const string emailPattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
        //    bool isValid = Regex.IsMatch(email, emailPattern);
        //    return isValid;
        //}
        //public bool IsValidPassword(string password)
        //{

        //    const string passwordPattern = @"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";
        //    return Regex.IsMatch(password, passwordPattern);
        //}
        //public bool IsValidUsername(string username)
        //{

        //    const string usernamePattern = @"^(?!.*[-.]{2})[a-zA-Z0-9][a-zA-Z0-9 .-]{0,58}[a-zA-Z0-9]$";
        //    return Regex.IsMatch(username, usernamePattern);
        //}
        //public bool IsValidName(string name)
        //{
        //    const string namePattern = @"^[a-zA-Z -]+$";
        //    return Regex.IsMatch(name, namePattern) && name.Length > 2;
        //}


        private bool IsValidName(string name)
        {
            // Check if the name contains only letters, spaces, and hyphens
            foreach (char c in name)
            {
                if (!char.IsLetter(c) && c != ' ' && c != '-')
                    return false;
            }

            // Check if the name length is greater than 2
            return name.Length > 2;
        }

        private bool IsValidUsername(string username)
        {
            // Check if the username contains only alphanumeric characters, spaces, dots, and hyphens
            foreach (char c in username)
            {
                if (!char.IsLetterOrDigit(c) && c != ' ' && c != '.' && c != '-')
                    return false;
            }

            // Check if the username length is within the specified range
            return username.Length >= 3 && username.Length <= 60;
        }

        private bool IsValidPassword(string password)
        {
            // Check if the password meets the specified criteria
            bool hasUppercase = false;
            bool hasLowercase = false;
            bool hasDigit = false;
            bool hasSpecialChar = false;

            foreach (char c in password)
            {
                if (char.IsUpper(c))
                    hasUppercase = true;
                else if (char.IsLower(c))
                    hasLowercase = true;
                else if (char.IsDigit(c))
                    hasDigit = true;
                else if ("@$!%*?&".Contains(c))
                    hasSpecialChar = true;
            }

            return password.Length >= 8 && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
        }

        private bool IsValidEmail(string email)
        {
            // Check if the email contains "@" and "."
            int atIndex = email.IndexOf('@');
            int dotIndex = email.LastIndexOf('.');
            return atIndex > 0 && dotIndex > atIndex && dotIndex < email.Length - 1;
        }



        #endregion
    }
}
