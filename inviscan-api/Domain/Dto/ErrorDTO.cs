using System.Text.Json.Serialization;

namespace Domain.DTO
{
	public class ErrorDTO
	{
		/// <summary>
		/// Mensagem descritiva do erro.
		/// </summary>
		public string Message { get; set; }

		/// <summary>
		/// Detalhes adicionais sobre o erro (opcional).
		/// </summary>
		public string Details { get; set; }

		/// <summary>
		/// Data e hora em que o erro ocorreu.
		/// </summary>
		public DateTime Timestamp { get; set; }
	}
}
