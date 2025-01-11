using Domain.DTO;
using Domain.Interfaces.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Services
{
	public class MailService : IMailService
	{
		public ResponseModel SendMailCheckfy(MailMessageDTO mailMessage)
		{
			var message = new MimeMessage();

			message.From.Add(new MailboxAddress("Checkfy", "checkfy.helper@gmail.com"));

			foreach (var to in mailMessage.To)
			{
				message.To.Add(new MailboxAddress(to.Name, to.Address));
			}

			message.Subject = mailMessage.Subject;

			var bodyBuilder = new BodyBuilder
			{
				HtmlBody = mailMessage.Html
			};

			foreach (var attachment in mailMessage.Attachments)
			{
				bodyBuilder.Attachments.Add(attachment.Name, attachment.Content, ContentType.Parse(attachment.MimeType));
			}

			message.Body = bodyBuilder.ToMessageBody();


			using (var client = new SmtpClient())
			{
				client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);

				client.Authenticate("checkfy.helper@gmail.com", "yssv xjdf nzdo wkrc"); /*yssv xjdf nzdo wkrc*/

				client.Send(message);

				client.Disconnect(true);
			}

			return ResponseModel.Success();
		}
	}
}
