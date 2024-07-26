namespace Spotify
{
    public class RefreshToken
    {
        public string Token { get; set; }
        public DateTime created {  get; set; }
        public DateTime Expires { get; set; }
    }
}
