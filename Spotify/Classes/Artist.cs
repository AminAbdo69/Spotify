namespace Spotify
{
    public class Artist
    {
        public int ArtistId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string? ProfilePicture { get; set; } =string.Empty;
        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }
        public bool? IsActive { get; set; } = false;

        public List<Song > Songs { get; set; }
        public List<User> Followers { get; set; }
        public List<Album> CreatedAlbums { get; set; }
    }
}
