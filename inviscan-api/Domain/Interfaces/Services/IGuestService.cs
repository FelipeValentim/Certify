﻿using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IGuestService
	{
		ResponseModel<object> Add(GuestDTO guest);
	}
}
