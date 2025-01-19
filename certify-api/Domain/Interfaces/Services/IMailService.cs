using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IMailService
	{
        Task<ResponseModel> SendMailCheckfyAsync(MailMessageDTO mailMessage);

        Task<ResponseModel> SendMailCheckfyAsync(IEnumerable<MailMessageDTO> mailMessages);
    }
}
