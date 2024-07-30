using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Spotify
{
    public class Playlist
    {
        public int PlaylistId { get; set; }

        
        public string PlaylistName { get; set;}
        public DateTime PlaylistDate { get; set; }
        public int PlaylistsoungCount { get; set; } = 0;
        public string picpath { get; set; } = string.Empty;


        [Required]
        public required int UserId { get; set; }
        
        public  User? User { get; set; }
        public List<User> PLaylistLovers { get; set; } = [];
        public List<Song> PlaylistSongs { get; set; } = [];
    }
}
