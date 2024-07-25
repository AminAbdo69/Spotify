using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Spotify
{
    public class Playlist
    {
        public int PlaylistId { get; set; }

        
        public string PlaylistName { get; set;}
        public DateTime PlaylistDate { get; set; }


        [Required]
        public required int UserId { get; set; }
        [Required]
        public required User? User { get; set; }
        public List<User> PLaylistLovers { get; set; }
        public List<Song> PlaylistSongs { get; set; }
    }
}
