using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IMailService
	{
        ResponseModel SendMailCheckfy(MailMessageDTO mailMessage);
	}
}
