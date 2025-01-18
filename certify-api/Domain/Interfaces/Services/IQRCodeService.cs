using Domain.DTO;

namespace Domain.Interfaces.Services
{
	public interface IQRCodeService
    {
        FileDTO GenerateQRCode(Guid id);

        FileDTO GenerateQRCode(string value);

    }
}
