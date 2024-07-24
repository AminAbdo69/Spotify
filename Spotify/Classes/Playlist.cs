using System.ComponentModel.DataAnnotations.Schema;

namespace Spotify
{
    public class Playlist
    {
        public int PlaylistId { get; set; }

        
        public string PlaylistName { get; set;}
        public DateTime PlaylistDate { get; set; }

        public List<User> PLaylistLovers { get; set; }

        public int UserId { get; set; }
        public User PlaylistCreator { get; set; }
        public List<Song> PlaylistSongs { get; set; }
    }
}
