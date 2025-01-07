using System.Text.Json.Serialization;

namespace Domain.Dto
{
	public class EventTemplateDto
	{
		public string RelativePreviewPath { get; set; }

		public string FullPreviewPath { get; set; }
	}
}
