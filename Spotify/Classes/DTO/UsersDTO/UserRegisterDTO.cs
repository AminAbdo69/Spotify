﻿namespace Spotify.Classes.DTO.UsersDTO
{
    public class UserRegisterDTO
    {
        public required string Username { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required IFormFile Image { get; set; }
    }
}
