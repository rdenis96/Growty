using Domain.Accounts;
using GrowtyWebSite.Models.Account;
using Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace GrowtyWebSite.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(UserManager<AppUser> usermanager, SignInManager<AppUser> signInManager)
        {
            _userManager = usermanager;
            _signInManager = signInManager;
        }

        [Authorize]
        [HttpGet("[action]")]
        public IActionResult Testtoken()
        {
            return Ok("Works");
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Register(RegisterViewModel registerViewModel)
        {
            AppUser user = new AppUser
            {
                UserName = registerViewModel.Username,
                Email = registerViewModel.Email,
                FirstName = "Un firstname test",
                LastName = "Un lastname test"
            };
            var result = await _userManager.CreateAsync(user, registerViewModel.Password);
            if (result.Succeeded)
            {
                return Ok("Account created!");
            }
            return BadRequest(result.Errors.FirstOrDefault().Description);
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    //trim email
                    model.Email = model.Email.Trim();

                    var user = await _userManager.FindByEmailAsync(model.Email);
                    if (user == null)
                    {
                        ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                        return Unauthorized();
                    }

                    var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, isPersistent: true, lockoutOnFailure: false);

                    if (result.Succeeded)
                    {
                        return await SuccessLogin(user);
                    }
                    else if (result.IsLockedOut)
                    {
                        user.LockoutEnd = new DateTimeOffset(DateTime.Now.AddMinutes(5));
                        return StatusCode((int)HttpStatusCode.InternalServerError, "User account locked out.");
                    }
                    else
                    {
                        return StatusCode((int)HttpStatusCode.InternalServerError, "Invalid login attempt.");
                    }
                }
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, "Error while creating token: " + ex.Message);
            }
        }

        private async Task<IActionResult> SuccessLogin(AppUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);

            var claims = new[]
            {
                        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Email, user.Email)
                    }.Union(userClaims);

            var tokenHandler = new JwtSecurityTokenHandler();

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(AppConfigurationBuilder.Instance.GeneralSettings.JwtSecretKey));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha512Signature);

            var jwtSecurityToken = new JwtSecurityToken(
                //issuer: AppConfigurationBuilder.Instance.JWTSettings.Issuer, // TO BE ADDED
                //audience: AppConfigurationBuilder.Instance.JWTSettings.Issuer,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: signingCredentials
                );

            return Ok(new
            {
                id = user.Id,
                username = user.UserName,
                token = tokenHandler.WriteToken(jwtSecurityToken)
            });
        }
    }
}