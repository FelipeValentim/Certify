using event_checkin_api.Services;
using System.Collections.Generic;
using static event_checkin_api.Models.DatabaseModels;

namespace event_checkin_api.Database
{
    public class GuestRepository
    {
        public static List<Guest> Guests = new List<Guest>
        {
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890a1").ToString(), Name = "Pedro Azevedo", DateCheckin = new DateTime(2024, 5, 30, 22, 0, 0), Photo = "https://randomuser.me/api/portraits/men/1.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890a2").ToString(), Name = "Carlos Silva", DateCheckin = new DateTime(2024, 5, 29, 18, 0, 0), Photo = "https://randomuser.me/api/portraits/men/2.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890a3").ToString(), Name = "Mariana Souza", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/women/1.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890a4").ToString(), Name = "João Pereira", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/3.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890a5").ToString(), Name = "Ana Costa", DateCheckin = new DateTime(2024, 5, 28, 20, 0, 0), Photo = "https://randomuser.me/api/portraits/women/2.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890a6").ToString(), Name = "Lucas Oliveira", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/4.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890a7").ToString(), Name = "Beatriz Lima", DateCheckin = new DateTime(2024, 5, 29, 21, 0, 0), Photo = "https://randomuser.me/api/portraits/women/3.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890a8").ToString(), Name = "Ricardo Martins", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/5.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890a9").ToString(), Name = "Patrícia Ferreira", DateCheckin = new DateTime(2024, 5, 30, 20, 0, 0), Photo = "https://randomuser.me/api/portraits/women/4.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890aa").ToString(), Name = "Gabriel Rocha", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/6.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890ab").ToString(), Name = "Juliana Azevedo", DateCheckin = new DateTime(2024, 5, 29, 22, 0, 0), Photo = "https://randomuser.me/api/portraits/women/5.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890ac").ToString(), Name = "Fernando Almeida", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/7.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890ad").ToString(), Name = "Daniela Mendes", DateCheckin = new DateTime(2024, 5, 30, 21, 0, 0), Photo = "https://randomuser.me/api/portraits/women/6.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890ae").ToString(), Name = "Rafael Santos", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/8.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890af").ToString(), Name = "Fernanda Carvalho", DateCheckin = new DateTime(2024, 5, 28, 19, 0, 0), Photo = "https://randomuser.me/api/portraits/women/7.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890b0").ToString(), Name = "Sérgio Nogueira", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/9.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890b1").ToString(), Name = "Marta Ribeiro", DateCheckin = new DateTime(2024, 5, 29, 18, 0, 0), Photo = "https://randomuser.me/api/portraits/women/8.jpg", Event = EventRepository.Events.ElementAt(0)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890b2").ToString(), Name = "Renato Barros", DateCheckin = null, Photo = "https://randomuser.me/api/portraits/men/10.jpg", Event = EventRepository.Events.ElementAt(1)},
            new Guest { Id = new Guid("12345678-1234-1234-1234-1234567890b3").ToString(), Name = "Aline Cunha", DateCheckin = new DateTime(2024, 5, 30, 19, 0, 0), Photo = "https://randomuser.me/api/portraits/women/9.jpg", Event = EventRepository.Events.ElementAt(1)},
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

        public void Uncheckin(string id)
        {
            Guests = Guests.Select(guest =>
            {
                if (guest.Id == id) guest.DateCheckin = null;
                return guest;
            }).ToList();
        }


        public void Checkin(string[] ids)
        {
            Guests = Guests.Select(guest =>
            {
                if (ids.Any(x => guest.Id == x)) guest.DateCheckin = DateTime.Now;
                return guest;
            }).ToList();
        }

        public void Uncheckin(string[] ids)
        {
            Guests = Guests.Select(guest =>
            {
                if (ids.Any(x => guest.Id == x)) guest.DateCheckin = null;
                return guest;
            }).ToList();
        }
    }
}
