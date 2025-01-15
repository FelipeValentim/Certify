using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IGuestService
	{
		ResponseModel<object> Add(GuestDTO guest);

		void SetStudentGuestType(ref GuestDTO guest);

        void SendQRCode(Guid eventId, Guid id);

        void SendQRCode(Guid eventId, Guid[] ids);

        ResponseModel Checkin(Guid id);
        ResponseModel Uncheckin(Guid id);
        ResponseModel Checkin(Guid[] ids);
        ResponseModel Uncheckin(Guid[] ids);
        ResponseModel Delete(Guid id);
        ResponseModel Delete(Guid[] ids);


    }
}
