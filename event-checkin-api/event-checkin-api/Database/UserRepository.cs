using event_checkin_api.Services;
using static event_checkin_api.Models.DatabaseModels;

namespace event_checkin_api.Database
{
    public class UserRepository
    {
        public static List<User> Users = new List<User>
        {
            new User { Name = "Teste", Email = "teste@teste.com", PasswordHash = "46070d4bf934fb0d4b06d9e2c46e346944e322444900a435d7d9a95e6d7435f5" },
        };

        public User Login(string email, string password)
        {
            var user = Users.FirstOrDefault(x => String.Equals(x.Email, email, StringComparison.CurrentCultureIgnoreCase));

            if (user != null)
            {
                if (!Hash.VerifyPassword(password, user.PasswordHash))
                {
                    return null;
                }
            } 

            return user;
        }

        public User GetUser(string id)
        {
            return Users.FirstOrDefault(x => x.Id == id);
        }  
    }
}
