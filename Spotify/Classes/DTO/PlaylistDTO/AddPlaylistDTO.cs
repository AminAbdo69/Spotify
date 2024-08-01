namespace Spotify.Classes.DTO.PlaylistDTO
{
    public class AddPlaylistDTO
    {
        public string playlistname { get; set; }
        public string playlistcreator { get; set; }
        public required IFormFile Image { get; set; }
    }
}
