namespace Spotify
{
    public class Song
    {
        public int SongId { get; set; }
        public int AlbumId { get; set; }
        public string SongName { get; set; }
        public float Duration { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string path { get; set; } = string.Empty;
        public string? picture { get; set; } = string.Empty;


        public List<Playlist> playlists { get; set; }
        public Album Songalbum { get; set; }

        public int ArtistId { get; set; }
        public Artist artist { get; set; }
        public List<User> Likedusers { get; set; }

    }
}
