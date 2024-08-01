using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Spotify.Classes.DTO.UsersDTO;
using Spotify.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace Spotify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(DataBase db, IConfiguration config ,IUserService userService, IWebHostEnvironment environment) : ControllerBase
    {

        

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromForm]UserRegisterDTO request)
        {
            if (!IsValidUsername(request.Username))
            {
                return BadRequest("Invalid Username");
            }
            if (!IsValidEmail(request.Email))
            {
                return BadRequest("Invalid Email");
            }
            if (!IsValidPassword(request.Password))
            {
                return BadRequest("Invalid Password");
            }
            if (!IsValidName(request.FirstName))
            {
                return BadRequest("Invalid FirstName");
            }
            if (!IsValidName(request.LastName))
            {
                return BadRequest("Invalid LastName");
            }

            if (request.Image == null || request.Image.Length == 0) {
                return BadRequest("No image for yourprofile was uploaded.");
            }

            var extention = Path.GetExtension(request.Image.FileName).ToLowerInvariant();
            var allowedExtentions = new string[] { ".png", ".jpeg", ".jpg", ".avif" };

            if (!allowedExtentions.Contains(extention))
            {
                return BadRequest("Unsupport image format.");
            }

            if (db.Users.FirstOrDefault(u => u.UserName == request.Username) != null)
            {
                return Conflict("Username is already exists. Please choose a different username.");
            }

            CreatePasswordHash(request.Password, out byte[] PasswordHash, out byte[] PasswordSalt);

            var filePath = SaveProfileImage(request.Username, request.Image);


            User user = new()
            {
                UserName = request.Username,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = PasswordHash,
                PasswordSalt = PasswordSalt,
                picture = filePath
            };

            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();



            return Ok(user);

        }

        private string SaveProfileImage(string Username, IFormFile Image)
        {
            var uploadFolder = Path.Combine(environment.ContentRootPath, "ProfileImages");
            
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

            return Path.Combine("ProfileImages", $"{Username}{extention}");
        }

        [HttpGet("UserImage/{Username}")]
        public IActionResult GetUserImage(string Username)
        {
            if (string.IsNullOrEmpty(Username))
            {
                return BadRequest("USername is invalid.");
            }

            User? user = db.Users.SingleOrDefault(u => u.UserName == Username);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (string.IsNullOrEmpty(user.picture))
            {
                return NotFound("Image not found.");
            }

            var filePath = Path.Combine(environment.ContentRootPath, user.picture);
            var extention = Path.GetExtension(user.picture).ToLowerInvariant();

            var image = System.IO.File.OpenRead(filePath);

            return File(image, $"image/{extention.TrimStart('.')}");
        }


        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserLoginDTO request)
        {
           
                if (
                  String.IsNullOrEmpty(request.UserName)||
                  String.IsNullOrEmpty(request.Password)
                )
                {
                    return BadRequest("Please provide the required info.");
                }

                User? user = await db.Users.FirstOrDefaultAsync(u => u.UserName == request.UserName);

                if (user == null)
                {
                    return NotFound("User not found. Please check your username and password.");
                }

                if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
                {
                    return BadRequest("Wrong Password Entered");
                }
            // create token
            string tokenValue = CreateToken(user.UserId, user.Email);

            if (tokenValue == null)
            {
                return StatusCode(500, "An error occurred while generating the token.");
            }

            // create refresh token
            var refreshToken = GenrateRefreshToken();

            SetRefreshToken(user.UserName, refreshToken);



            return Ok(tokenValue);
                //string? Token = CreateToken(request.UserName, Role: "User");
                //var refreshToken = GenrateRefreshToken();
                //SetRefreshToken(request.UserName, refreshToken);
                //if (Token == null)
                //{
                //    return StatusCode(500, "An error occurred while generating the token.");
                //}

                //return Ok(Token);            
        }
            

        [HttpPost("RefreshToken") ]
        public  ActionResult<string> RefrshToken(string userName )
        {

            //var userName = userService.GetMyName();
            //var ROLE = "User";

            var refreshToken = Request.Cookies["refreshToken"];

            var user = db.Users.FirstOrDefault(u => u.UserName == userName);
            if (user == null)
            {
                return NotFound("Invalid user.");
            }

            if (!user.RefreshToken.Equals(refreshToken))
            {
                return Unauthorized("Invalid RefreshToken.");
            }
            else if (user.TokenExpires < DateTime.Now)
            {
                return Unauthorized("Token Expired.");
            }
            string token = CreateToken(user.UserId, user.Email);// new JWT token
            var newRefrshToken = GenrateRefreshToken();// new refresh token
            SetRefreshToken(user.UserName , newRefrshToken);// udate token ion cookie and db

            return Ok(token);
        }

        [HttpGet , Authorize]
        public ActionResult<string> Getme()
        {

            var userName = userService.GetMyName();
            var ROLE = userService.GetMyRole();
            string result = userName + ROLE;
            //var username = User?.Identity?.Name;
            var usename2 = User.FindFirstValue(ClaimTypes.Name);
            //var role = User.FindFirstValue(ClaimTypes.Role);

            return Ok(result);
        }

        [HttpGet("getUser"), Authorize]
        public ActionResult<User> Getme(int id)
        {

            User user = db.Users.FirstOrDefault(u=>u.UserId == id);


            return Ok(user);
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



        private string CreateToken(int id, string Email)
        {

            //List<Claim> claims =
            //[
            //    new Claim(ClaimTypes.Name, Username),
            //    new Claim(ClaimTypes.Role, Role)
            //];

            //byte[] AppToken = Encoding.UTF8.GetBytes(config.GetSection("AppSettings:Token").Value);

            //var Key = new SymmetricSecurityKey(AppToken);

            //var credentials = new SigningCredentials(Key, SecurityAlgorithms.HmacSha512);

            //var jwtSecurityToken = new JwtSecurityToken(
            //    claims: claims,
            //    expires: DateTime.Now.AddMinutes(15),
            //    signingCredentials: credentials);

            //var jwtToken = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

            //return jwtToken; 

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub , config["Jwt:Subject"]),
                new Claim(JwtRegisteredClaimNames.Jti , Guid.NewGuid().ToString()),
                new Claim("UserId" ,id.ToString()),
                new Claim("Email" ,Email.ToString())

            };

            var Key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            var signIn = new SigningCredentials(Key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                config["Jwt:Issuer"],
                config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMonths(2),
                signingCredentials: signIn
                );
            string tokenValue = new JwtSecurityTokenHandler().WriteToken(token);
            return tokenValue;
        }

        private RefreshToken GenrateRefreshToken()
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.Now.AddDays(7),
                created = DateTime.Now
            };
            return refreshToken;
        }

        private void SetRefreshToken(string Username  , RefreshToken refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = refreshToken.Expires,
                SameSite = SameSiteMode.None,
            };
            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
            

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
