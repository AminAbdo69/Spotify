namespace Spotify
{
    public class Artist
    {
        public int ArtistId { get; set; }
        public string ArtistFullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? ProfilePicture { get; set; }

        public List<Song > Songs { get; set; }
        public List<User> Followers { get; set; }
        public List<Album> CreatedAlbums { get; set; }
    }
}
