﻿using Domain.DTO;
using Domain.Entities;

namespace Domain.Interfaces.Services
{
    public interface IEventService
    {
        ResponseModel<object> Add(EventDTO model);
        
        ResponseModel CheckinEnabledMode(EventDTO model);

        ResponseModel<FileDTO> DownloadCertificates(Guid eventId);

        ResponseModel SendCertificates(Guid eventId);

        Event Get(Guid id);
        ResponseModel<Event> GetByDecodedId(string id);

        Event GetRelated(Guid id);

        IEnumerable<Event> GetEvents();

        int CountGuests(Guid eventId);

        ResponseModel Delete(Guid eventId);

        FileDTO GenerateCheckinQRCode(Guid eventId);

    }
}
