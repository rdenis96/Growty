using Microsoft.AspNetCore.Identity;

namespace Domain.Accounts
{
    public class AppUser : IdentityUser<int>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Token { get; set; }
    }
}
