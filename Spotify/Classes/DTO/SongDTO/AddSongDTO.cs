namespace Spotify.Classes.DTO.SongDTO
{
    public class AddSongDTO
    {
        public string Albumname { get; set; }
        public string artistusename { get; set; }
        public string Songname { get; set; }

        public float Duration { get; set; }
        public required IFormFile Image { get; set; }
        public required IFormFile Audio { get; set; }

    }
}
