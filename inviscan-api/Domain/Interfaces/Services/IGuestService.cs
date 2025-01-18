using Domain.DTO;
using Domain.Entities;

namespace Domain.Interfaces.Services
{
    public interface IGuestService
	{
		ResponseModel<object> Add(GuestDTO guest, bool form = false);

		void SetStudentGuestType(ref GuestDTO guest);

        void SendQRCode(Guid eventId, Guid id);

        void SendQRCode(Guid eventId, Guid[] ids);
        ResponseModel<GuestDTO> Get(Guid id);
        ResponseModel<GuestDTO> Get(string id);
        ResponseModel Checkin(Guid id, bool form = false);
        ResponseModel Checkin(string id, bool form = false);
        ResponseModel Uncheckin(Guid id);
        ResponseModel Checkin(Guid[] ids);
        ResponseModel Uncheckin(Guid[] ids);
        ResponseModel Delete(Guid id);
        ResponseModel Delete(Guid[] ids);


    }
}
