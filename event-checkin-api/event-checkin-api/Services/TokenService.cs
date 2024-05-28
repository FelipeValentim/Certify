using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using static event_checkin_api.Models.DatabaseModels;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using event_checkin_api.Helpers;

namespace event_checkin_api.Services
{
    public class TokenService
    {
        public static string GenerateToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(Settings.SecretKey);

            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(Constants.ClaimTypes.Id, user.Id),

                }),
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return (tokenHandler.WriteToken(token));
        }
    }
}
