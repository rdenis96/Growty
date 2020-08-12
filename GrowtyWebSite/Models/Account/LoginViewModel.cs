using System.ComponentModel.DataAnnotations;

namespace GrowtyWebSite.Models.Account
{
    public class LoginViewModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
