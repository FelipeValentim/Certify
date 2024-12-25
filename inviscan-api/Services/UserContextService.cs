using Domain.Identity;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Http;

namespace Services
{
	public class UserContextService : IUserContextService
	{
		private readonly IHttpContextAccessor _httpContextAccessor;

		public UserContextService(IHttpContextAccessor httpContextAccessor) {
			_httpContextAccessor = httpContextAccessor;
		}

		public string UserId => _httpContextAccessor.HttpContext.User.FindFirst(CustomClaimTypes.Id).Value;

		public Guid UserGuid => new Guid(UserId);
	}
}
