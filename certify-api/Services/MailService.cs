using Domain.DTO;
using Domain.Interfaces.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Utils;

namespace Services
{
	public class MailService : IMailService
	{
		public async Task<ResponseModel> SendMailCheckfyAsync(MailMessageDTO mailMessage)
		{
			var message = new MimeMessage();

			message.From.Add(new MailboxAddress("Checkfy", "checkfy.helper@gmail.com"));

			foreach (var to in mailMessage.To)
			{
				message.To.Add(new MailboxAddress(to.Name, to.Address));
			}

			message.Subject = mailMessage.Subject;

			var html = mailMessage.Html;

			var bodyBuilder = new BodyBuilder();
			
            foreach (var attachment in mailMessage.Attachments)
			{
				bodyBuilder.Attachments.Add(attachment.Name, attachment.Content, ContentType.Parse(attachment.MimeType));
			}

            foreach (var embedded in mailMessage.Embedded)
			{
                var embed = bodyBuilder.LinkedResources.Add(embedded.Name, embedded.Data, ContentType.Parse(embedded.MimeType));

                embed.ContentId = MimeUtils.GenerateMessageId();

                html = html.Replace(embedded.Placeholder, "cid:" + embed.ContentId);
            }

			bodyBuilder.HtmlBody = html;

            message.Body = bodyBuilder.ToMessageBody();

			using (var client = new SmtpClient())
			{
				client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);

				client.Authenticate("checkfy.helper@gmail.com", "yssv xjdf nzdo wkrc"); /*yssv xjdf nzdo wkrc*/

				await client.SendAsync(message);

				client.Disconnect(true);
			}

			return ResponseModel.Success();
		}

        public async Task<ResponseModel> SendMailCheckfyAsync(IEnumerable<MailMessageDTO> mailMessages)
        {
            foreach (MailMessageDTO mailMessage in mailMessages)
            {
				await SendMailCheckfyAsync(mailMessage);
            }

            return ResponseModel.Success();
        }
    }
}
