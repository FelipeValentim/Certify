using System.Net;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Domain.Dto
{
	public class ResponseModel : ResponseModel<string>
	{
		public static ResponseModel Error(HttpStatusCode statusCode, string message)
		{
			return new ResponseModel
			{
				Succeed = false,
				Data = message,
				StatusCode = statusCode,
			};
		}

		public static ResponseModel Success()
		{
			return new ResponseModel
			{
				Succeed = true,
				StatusCode = HttpStatusCode.OK,
			};
		}
	}

	public class ResponseModel<T> 
	{
		public bool Succeed { get; set; }
		public T Data { get; set; }
		public HttpStatusCode StatusCode { get; set; }
		public int Code => (int)StatusCode;

		protected ResponseModel() { }

		public static ResponseModel<T> Success(T data)
		{
			return new ResponseModel<T>
			{
				Succeed = true,
				Data = data,
				StatusCode = HttpStatusCode.OK,
			};
		}
	}

}
