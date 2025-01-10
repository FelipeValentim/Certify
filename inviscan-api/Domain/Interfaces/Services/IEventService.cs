﻿using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IEventService
	{
		ResponseModel SaveTemplate(FileDTO file, Guid eventId);

		ResponseModel<FileDTO> DownloadCertificates(Guid eventId);
	}
}
