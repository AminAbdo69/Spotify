using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Spotify.Classes.DTO;
using Spotify.Data;
using Spotify.Services.UserServices;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Spotify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistController(DataBase db, IConfiguration config) : ControllerBase
    {

        [HttpPost("Artistregister")]
        public  ActionResult<string> Register(ArtistRegisterDTO request)
        {
            if (!IsValidUsername(request.Username))
            {
                return BadRequest("Invalid Username");
            }
            if (!IsValidEmail(request.Email))
            {
                return BadRequest("Invalid Email");
            }

            if (db.Artists.FirstOrDefault(u => u.Username == request.Username) != null)
            {
                return Conflict("Username is already exists. Please choose a different username.");
            }
            string password = request.Username + "111";
            CreatePasswordHash(password, out byte[] PasswordHash, out byte[] PasswordSalt);

            Artist artist = new()
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = PasswordHash,
                PasswordSalt = PasswordSalt,
            };

             db.Artists.Add(artist);
             db.SaveChanges();

            return Ok("your request has been send successfully");

        }
        [HttpPost("Artistlogin")]
        public async Task<ActionResult<Artist>> Login(ArtistLoginDTO request)
        {

            if (
              String.IsNullOrEmpty(request.Username) ||
              String.IsNullOrEmpty(request.Password)
            )
            {
                return BadRequest("Please provide the required info.");
            }

            Artist? artist = await db.Artists.FirstOrDefaultAsync(u => u.Username == request.Username);

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

        [HttpPost("ChangeData")]

        public ActionResult<string> ChangeData(ChangedataDTO request)
        {
            if (!IsValidPassword(request.NewPassword))
            {
                return BadRequest("Invalid Password Structue");
            }
            if(request.NewPassword != request.ConfirmPassword)
            {
                return BadRequest("NewPassword not matched with ConfirmPassword , Try again.");
            }
            Artist artist = db.Artists.FirstOrDefault(a  => a.Username == request.Username);
            if(artist == null)
            {
                return NotFound("Not Found this Artist");
            }
            UpdatePassword(artist.Username, request.NewPassword);
            
            return Ok("Data has been changed successfully");
        }




        [HttpPost("AddAlbum")]

        public ActionResult<string> AddAlbum(AlbumDTO albumDTO)
        {
            Artist artist = db.Artists.FirstOrDefault(a =>a.Username ==  albumDTO.ArtistName);
            if(artist == null)
            {
                return NotFound("Invalid Artist.");
            }

            if(String.IsNullOrEmpty(albumDTO.AlbumName))
            {
                return BadRequest("invalid Album Name.");
            }
            Album album1 = new()
            {
                ArtistId = artist.ArtistId,
                AlbumName = albumDTO.AlbumName,
                ReleaseDate = DateTime.Now
            };

            //foreach (Album album in artist.CreatedAlbums)
            //{
            //    if (album.AlbumName == albumDTO.AlbumName)
            //    {
            //        return Conflict($"this Album Already Created By {artist.Username}");
            //    }
            //}

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

        



        [HttpPost("AddSong")]
        public ActionResult<string> AddSong(AddSongDTO songDTO)
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
            if(songDTO.Duration<0 || songDTO.Duration >10.0)
            {
                return BadRequest("Invalid song Duration.");
            }
            Song song1 = new()
            {
                AlbumId = album.AlbumId,
                ArtistId = artist.ArtistId,
                SongName = songDTO.Songname,
                Duration = songDTO.Duration,
                ReleaseDate = DateTime.Now,
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

            //foreach (Song song in artist.Songs)
            //{
            //    if (song.SongName.Equals(songDTO.Songname))
            //    {
            //        return Conflict($"this song Already Created by {artist.Username}");
            //    }
            //}



            artist.Songs.Add(song1);
            album.AlbumSongs.Add(song1);
            album.Nsongs = album.Nsongs + 1;
            db.Songs.Add(song1);

            db.Artists.Update(artist);
            db.Albums.Update(album);
            db.SaveChanges();

            return Ok($"{songDTO.Songname} has been created successfully.");

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
