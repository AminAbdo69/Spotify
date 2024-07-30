using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Spotify.Classes.DTO;
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
    public class AuthController(DataBase db, IConfiguration config ,IUserService userService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserRegisterDTO request)
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


            if (db.Users.FirstOrDefault(u => u.UserName == request.Username) != null)
            {
                return Conflict("Username is already exists. Please choose a different username.");
            }

            CreatePasswordHash(request.Password, out byte[] PasswordHash, out byte[] PasswordSalt);

            User user = new()
            {
                UserName = request.Username,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = PasswordHash,
                PasswordSalt = PasswordSalt,
            };

            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();

            return Ok(user);

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

                string? Token = CreateToken(request.UserName, Role: "User");
                var refreshToken = GenrateRefreshToken();
                SetRefreshToken(request.UserName, refreshToken);
                if (Token == null)
                {
                    return StatusCode(500, "An error occurred while generating the token.");
                }

                return Ok(Token);            
        }

        [HttpPost("refreshToken") , Authorize]
        public  ActionResult<string> RefrshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var userName = userService.GetMyName();
            var ROLE = userService.GetMyRole();
            
           
            User? user =  db.Users.FirstOrDefault(u => u.UserName == userName);
            if (user == null)
            {
                return NotFound("Invalid user");
            }

            if (!user.RefreshToken.Equals(refreshToken))
            {
                return Unauthorized("Invalid RefreshToken.");
            }
            else if (user.TokenExpires < DateTime.Now)
            {
                return Unauthorized("Token Expired.");
            }

            string token = CreateToken(user.UserName, ROLE);
            var newRefrshToken = GenrateRefreshToken();
            SetRefreshToken(user.UserName, newRefrshToken);

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

        private string getmyname()
        {
            var userName = userService.GetMyName();
            return userName;
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
                    expires: DateTime.Now.AddMinutes(15),
                    signingCredentials: credentials);

                var jwtToken = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

                return jwtToken; 
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

        private void SetRefreshToken(String Username  , RefreshToken refreshToken)
        {
            var cookieOption = new CookieOptions
            {
                HttpOnly = true,
                Expires = refreshToken.Expires
            };
            Response.Cookies.Append("refreshToken", refreshToken.Token , cookieOption);
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
