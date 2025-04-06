using Domain.DTO;
using Domain.Entities;

namespace Domain.Interfaces.Services
{
    public interface IEventService
    {
        object Add(EventDTO model);
        
        void CheckinEnabledMode(EventDTO model);

        FileDTO DownloadCertificates(Guid eventId);

        void SendCertificates(Guid eventId);

        Event Get(Guid id);
        Event GetByDecodedId(string id);

        Event GetRelatedFields(Guid id);
        Event GetRelated(Guid id);

        IEnumerable<Event> GetEvents();

        int CountGuests(Guid eventId);

        void Delete(Guid eventId);

        FileDTO GenerateCheckinQRCode(Guid eventId);

    }
}
