using Domain.DTO;

namespace Domain.Interfaces.Services
{
	public interface IQRCodeService
    {
        byte[] GenerateQRCode(Guid id);
	}
}
