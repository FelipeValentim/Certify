using System.Text.Json.Serialization;

namespace event_checkin_api.Models
{
    public class AccountModels
    {
        public class AccountUser 
        {
            [JsonPropertyName("userName")]
            public string UserName { get; set; }

            [JsonPropertyName("password")]
            public string Password { get; set; }
        } 
    }
}
