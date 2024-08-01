namespace Spotify.Classes.DTO.ArtistDTO
{
    public class ArtistRegisterDTO
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public required IFormFile Image { get; set; }
    }
}
