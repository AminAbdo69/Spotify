using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Spotify.Migrations
{
    /// <inheritdoc />
    public partial class updateArtistTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ArtistFullName",
                table: "Artists");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Artists",
                newName: "Username");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Artists",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "PasswordHash",
                table: "Artists",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "PasswordSalt",
                table: "Artists",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Artists");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Artists");

            migrationBuilder.DropColumn(
                name: "PasswordSalt",
                table: "Artists");

            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Artists",
                newName: "Password");

            migrationBuilder.AddColumn<string>(
                name: "ArtistFullName",
                table: "Artists",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
