using Domain.Constants;
using System.Text.Json.Serialization;

namespace API.Models
{
	public class EventTemplateViewModel : ViewModelBase
	{
		[JsonPropertyName("path")]
		public string Path { get; set; }

		[JsonPropertyName("previewPath")]
		public string PreviewPath { get; set; }

		[JsonPropertyName("fullPreviewPath")]
		public string FullPreviewPath => $"{UrlManager.Storage}{PreviewPath}";

	}
}
