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
				Message = message,
				StatusCode = statusCode,
			};
		}

		public static new ResponseModel Success(string payload = null, HttpStatusCode code = HttpStatusCode.OK)
		{
			return new ResponseModel
			{
				Succeed = true,
				StatusCode = code,
				Payload = payload,
			};
		}
	}

	public class ResponseModel<T> 
	{
		public bool Succeed { get; set; }
		public T Payload { get; set; }
		public string Message { get; set; }
        public object Data => Succeed ? Payload : Message;
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

		public static ResponseModel<T> Success(T payload, HttpStatusCode code = HttpStatusCode.OK)
		{
			return new ResponseModel<T>
			{
				Succeed = true,
				Payload = payload,
				StatusCode = code,
			};
		}
	}

}
