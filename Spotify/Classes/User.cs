using System.Security.Cryptography;
using System.Text;

namespace Spotify
{
    public class User
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Email { get; set; }
        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }

        public string Lisence { get; set; }
        public bool? IsActive { get; set; } = false;

        public List<Playlist> LikedPlaylists { get; set; }

        public List<Playlist> CreatedPlaylists { get; set; }

        public List<Song> LikedSons { get; set; }
        public List<Album> LikedAlbums { get; set; }
        public List<Artist> FollowedArtists { get; set; }





        private static void CreatePasswordHash(string Password, out byte[] PasswordHash, out byte[] PasswordSalt)
        {
            using var hmac = new HMACSHA512();
            PasswordSalt = hmac.Key;
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(Password));
        }

        private static bool VerifyPasswordHash(string Password, byte[] PasswordHash, byte[] PasswordSalt)
        {
            using var hmac = new HMACSHA512(PasswordSalt);
            byte[] ComputedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(Password));
            return ComputedHash.SequenceEqual(PasswordHash);
        }
    }
}
