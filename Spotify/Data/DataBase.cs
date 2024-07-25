
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Spotify.Data
{

    //(DbContextOptions<DataBase> options)
    public class DataBase : IdentityDbContext<IdentityUser>
    {
        public DataBase(DbContextOptions<DataBase> options) :base(options) {
        
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Artist> Artists { get; set; }
        public DbSet<Album> Albums { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<Song> Songs { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<User>()
          .HasMany(u => u.CreatedPlaylists)
          .WithOne(p => p.User)
          .HasForeignKey(p => p.UserId)
          .OnDelete(DeleteBehavior.ClientSetNull);


           modelBuilder.Entity<User>()
         .HasMany(u => u.LikedSons)
         .WithMany(s => s.Likedusers)
         .UsingEntity(j => j.ToTable("UserLikedSongs"));


            modelBuilder.Entity<User>()
             .HasMany(u => u.LikedPlaylists)
             .WithMany(p => p.PLaylistLovers)
             .UsingEntity(j => j.ToTable("UserSavedPlaylist"));

            

            modelBuilder.Entity<Song>()
                .HasOne(s => s.artist)
                .WithMany(a => a.Songs)
                .HasForeignKey(s => s.ArtistId)
                .OnDelete(DeleteBehavior.ClientSetNull);
            //Many To Many With User
            //  modelBuilder.Entity<User>()
            //      .HasMany(u => u.LikedPlaylists)
            //      .WithMany(p => p.PLaylistLovers)
            //      .UsingEntity(j =>
            //      {
            //          j.ToTable("UserPlaylist");
            //      });


            //  modelBuilder.Entity<User>()
            //      .HasMany(u => u.LikedSons)
            //      .WithMany(s => s.Likedusers)
            //      .UsingEntity(j => j.ToTable("UserSong"));

            //  modelBuilder.Entity<User>()
            //      .HasMany(u => u.FollowedArtists)
            //      .WithMany(a => a.Followers)
            //      .UsingEntity(j => j.ToTable("UserArtist"));

            //  modelBuilder.Entity<User>()
            //      .HasMany(u => u.LikedAlbums)
            //      .WithMany(b => b.ALmubLikers)
            //      .UsingEntity(j => j.ToTable("UserAlbum"));

            //  //Many To Many With Song

            //  modelBuilder.Entity<Song>()
            //      .HasMany(s => s.playlists)
            //      .WithMany(p => p.PlaylistSongs)
            //      .UsingEntity(j => j.ToTable("SongPlaylist"));
            //  modelBuilder.Entity<Song>()
            //      .HasMany(s => s.artists)
            //      .WithMany(a => a.Songs)
            //      .UsingEntity(j => j.ToTable("SongArtist"));


            //  //one To Many Relations

            //  modelBuilder.Entity<Album>()
            // .HasMany(s => s.AlbumSongs) // One-to-many relationship
            // .WithOne(a => a.Songalbum)
            // .HasForeignKey(f => f.AlbumId);

            //  modelBuilder.Entity<Artist>()
            // .HasMany(a => a.CreatedAlbums) // One-to-many relationship
            // .WithOne(a => a.Artist)
            // .HasForeignKey(f => f.ArtistId);

            //  modelBuilder.Entity<User>()
            //.HasMany(u => u.CreatedPlaylists) // One-to-many relationship
            //.WithOne(p => p.PlaylistCreator)
            //.HasForeignKey(f => f.UserId)
            //.OnDelete(DeleteBehavior.ClientSetNull);


            base.OnModelCreating(modelBuilder);
        }
    }
}



