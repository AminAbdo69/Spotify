namespace Spotify
{
    public class Album
    {
        public int AlbumId { get; set; }

        public int ArtistId { get; set; }

        public string AlbumName { get; set; }
        public int Nsongs { get; set; } = 0;

        public DateTime ReleaseDate { get; set; }

        public List<User> ALmubLikers { get; set; } = [];
        public Artist Artist { get; set; }
        public List<Song> AlbumSongs { get; set; } = [];

    }
}
