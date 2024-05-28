using event_checkin_api.Services;
using static event_checkin_api.Models.DatabaseModels;

namespace event_checkin_api.Database
{
    public class EventRepository
    {
        public static List<Event> Events = new List<Event>
        {
            new Event { Name = "Aniversário", Date = new DateTime(2024, 5, 30, 22, 0, 0), Photo = "https://cangurunews.com.br/wp-content/uploads/2017/09/festaaniversario.jpg", User = UserRepository.Users.ElementAt(0)},
            new Event { Name = "Formatura", Date = new DateTime(2024, 5, 22, 22, 0, 0), Photo = "https://extra.globo.com/incoming/25655547-e96-d7d/w976h550-PROP/formatura.jpg", User = UserRepository.Users.ElementAt(0)},

        };

        public ICollection<Event> GetEvents(string userId)
        {
            return Events.Where(x => x.User.Id == userId).ToList();
        }  
    }
}
