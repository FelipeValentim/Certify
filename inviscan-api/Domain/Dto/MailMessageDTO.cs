
namespace Domain.DTO
{
    public class AttachmentDTO
    {
        public AttachmentDTO(Stream content, string mimeType, string name)
        {
            Content = content;
            MimeType = mimeType;
            Name = name;
        }

        public AttachmentDTO(byte[] data, string mimeType, string name, string placeholder)
        {
            Data = data;
            MimeType = mimeType;
            Name = name;
            Placeholder = placeholder;
        }


        public Stream Content { get; set; }

        public byte[] Data { get; set; }
        public string MimeType { get; set; }
        public string Name { get; set; }
        public string Placeholder { get; set; }

    }

    public class MailAddressDTO
    {
        internal MailAddressDTO(string address, string name)
        {
            Address = address;
            Name = name;
        }
        public string Name { get; set; }
        public string Address { get; set; }
    }

    public class MailMessageDTO
    {
        public MailMessageDTO()
        {
            From = new List<MailAddressDTO>();
            To = new List<MailAddressDTO>();
            Attachments = new List<AttachmentDTO>();
            Embedded = new List<AttachmentDTO>();

        }

        public void AddFrom(string email, string name)
        {
            From.Add(new MailAddressDTO(email, name));
        }

        public void AddTo(string email, string name)
        {
            To.Add(new MailAddressDTO(email, name));
        }

        public void AddAttachment(Stream content, string mimeType, string name)
        {
            Attachments.Add(new AttachmentDTO(content, mimeType, name));
        }

        public void AddEmbedded(byte[] data, string mimeType, string name, string placeholder)
        {
            Embedded.Add(new AttachmentDTO(data, mimeType, name, placeholder));
        }

        public List<MailAddressDTO> From { get; set; }
        public List<MailAddressDTO> To { get; set; }
        public string Subject { get; set; }
        public string Text { get; set; }
        public string Html { get; set; }
        public List<AttachmentDTO> Attachments { get; set; }
        public List<AttachmentDTO> Embedded { get; set; }

    }
}
