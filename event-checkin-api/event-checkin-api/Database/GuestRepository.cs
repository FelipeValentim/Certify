using event_checkin_api.Services;
using System.Collections.Generic;
using static event_checkin_api.Models.DatabaseModels;

namespace event_checkin_api.Database
{
    public class GuestRepository
    {
        public static List<Guest> Guests = new List<Guest>
        {
            new Guest { Name = "Pedro Azevedo", DateCheckin = new DateTime(2024, 5, 30, 22, 0, 0), Photo = "https://randomuser.me/api/portraits/men/1.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Name = "Carlos Silva", DateCheckin = new DateTime(2024, 5, 29, 18, 0, 0), Photo = "https://randomuser.me/api/portraits/men/2.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Name = "Mariana Souza", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/women/1.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Name = "João Pereira", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/3.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Name = "Ana Costa", DateCheckin = new DateTime(2024, 5, 28, 20, 0, 0), Photo = "https://randomuser.me/api/portraits/women/2.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Name = "Lucas Oliveira", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/4.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Name = "Beatriz Lima", DateCheckin = new DateTime(2024, 5, 29, 21, 0, 0), Photo = "https://randomuser.me/api/portraits/women/3.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Name = "Ricardo Martins", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/5.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Name = "Patrícia Ferreira", DateCheckin = new DateTime(2024, 5, 30, 20, 0, 0), Photo = "https://randomuser.me/api/portraits/women/4.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Name = "Gabriel Rocha", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/6.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Name = "Juliana Azevedo", DateCheckin = new DateTime(2024, 5, 29, 22, 0, 0), Photo = "https://randomuser.me/api/portraits/women/5.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Name = "Fernando Almeida", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/7.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Name = "Daniela Mendes", DateCheckin = new DateTime(2024, 5, 30, 21, 0, 0), Photo = "https://randomuser.me/api/portraits/women/6.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Name = "Rafael Santos", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/8.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Name = "Fernanda Carvalho", DateCheckin = new DateTime(2024, 5, 28, 19, 0, 0), Photo = "https://randomuser.me/api/portraits/women/7.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Name = "Sérgio Nogueira", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/9.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Name = "Marta Ribeiro", DateCheckin = new DateTime(2024, 5, 29, 18, 0, 0), Photo = "https://randomuser.me/api/portraits/women/8.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Name = "Renato Barros", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/10.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Name = "Aline Cunha", DateCheckin = new DateTime(2024, 5, 30, 19, 0, 0), Photo = "https://randomuser.me/api/portraits/women/9.jpg", Event = EventRepository.Events.ElementAt(1)},
        };


        public ICollection<Guest> GetGuests(string eventId)
        {
            return Guests.Where(x => x.Event.Id == eventId).ToList();
        }

        public Guest GetGuest(string id)
        {
            return Guests.FirstOrDefault(x => x.Id == id);
        }

        public void Checkin(string id)
        {
            Guests = Guests.Select(guest =>
            {
                if (guest.Id == id) guest.DateCheckin = DateTime.Now;
                return guest;
            }).ToList();
        }
    }
}
