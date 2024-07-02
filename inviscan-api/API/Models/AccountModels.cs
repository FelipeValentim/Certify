using System.Text.Json.Serialization;

namespace API.Models
{
    public class AccountModels
    {
        public class AccountUser 
        {
            [JsonPropertyName("email")]
            public string Email { get; set; }

            [JsonPropertyName("password")]
            public string Password { get; set; }
        } 
    }
}
