using System.Security.Claims;

namespace Spotify.Services.UserServices
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserService(IHttpContextAccessor httpContextAccessor) {
            _httpContextAccessor = httpContextAccessor;
        }
        public string GetMyName()
        {
            var name = string.Empty;
              if (_httpContextAccessor != null)
              {
                name = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
              }
              Console.WriteLine("===========================");
              Console.WriteLine(name);
              Console.WriteLine("==================================");
            return name;
        }
        public string GetMyRole()
        {
            var role = string.Empty;
            if (_httpContextAccessor != null)
            {
                role = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);
            }
            return role;
        }
    }
}
