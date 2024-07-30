namespace Spotify.Classes.DTO
{
    public class PlaylistOutDTO
    {
        public string PlaylistName { get; set; }
        public DateTime PlaylistDate { get; set; }
        public int PlaylistsoungCount { get; set; }
        public List<User> PLaylistLovers { get; set; }
        public List<Song> PlaylistSongs { get; set; } 
    }
}
