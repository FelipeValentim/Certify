using System.Net;

namespace Domain.DTO
{
	public class ResponseModel : ResponseModel<string>
	{
		public static new ResponseModel Error(HttpStatusCode statusCode, string message)
		{
			return new ResponseModel
			{
				Succeed = false,
				Data = message,
				StatusCode = statusCode,
			};
		}

		public static ResponseModel Success(HttpStatusCode code = HttpStatusCode.OK)
		{
			return new ResponseModel
			{
				Succeed = true,
				StatusCode = code,
			};
		}
	}

	public class ResponseModel<T> 
	{
		public bool Succeed { get; set; }
		public T Data { get; set; }
		public string Message { get; set; }
		public HttpStatusCode StatusCode { get; set; }
		public int Code => (int)StatusCode;

		protected ResponseModel() { }

		public static ResponseModel<T> Error(HttpStatusCode statusCode, string message)
		{
			return new ResponseModel<T>
			{
				Succeed = false,
				Message = message,
				StatusCode = statusCode,
			};
		}

		public static ResponseModel<T> Success(T data, HttpStatusCode code = HttpStatusCode.OK)
		{
			return new ResponseModel<T>
			{
				Succeed = true,
				Data = data,
				StatusCode = code,
			};
		}
	}

}
