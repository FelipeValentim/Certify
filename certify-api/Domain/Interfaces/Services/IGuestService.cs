using Domain.DTO;
using Domain.Entities;

namespace Domain.Interfaces.Services
{
    public interface IGuestService
	{
		object Add(GuestDTO guest, bool form = false);

		void SetStudentGuestType(ref GuestDTO guest);

        void SendInvitation(Guid eventId, Guid id);

        void SendInvitations(Guid eventId, Guid[] ids);
        void SendCertificates(Guid eventId, Guid[] ids);

        GuestDTO Get(Guid id);
        GuestDTO Get(string id);
        string Checkin(Guid id, bool form = false);
        string Checkin(string id, bool form = false);
        string Uncheckin(Guid id);
        string Checkin(Guid[] ids);
        string Uncheckin(Guid[] ids);
        string Delete(Guid id);
        string Delete(Guid[] ids);
        FileDTO GenerateCheckinQRCode(string guestId);
    }
}
