namespace Spotify.Classes.DTO.AlbumDTO
{
    public class AlbumDTO
    {
        public string ArtistName { get; set; }

        public string AlbumName { get; set; }
        public required IFormFile Image { get; set; }
    }
}
