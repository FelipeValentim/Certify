using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IGuestService
	{
		ResponseModel<object> Add(GuestDTO guest);

		void SetStudentGuestType(ref GuestDTO guest);

        void SendQRCode(Guid eventId, Guid id);

        void SendQRCode(Guid eventId, Guid[] ids);

    }
}
