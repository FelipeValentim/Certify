using Domain.Constants;
using Microsoft.AspNetCore.Mvc.Filters;
using Services.Helper;

namespace Services.Attributes
{
    public class DecodeHashAttribute : ActionFilterAttribute
    {
        private readonly string _salt;

        // Construtor para aceitar um parâmetro
        public DecodeHashAttribute(string salt = Salt.Salt1)
        {
            _salt = salt;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            foreach (var routeDataValue in context.RouteData.Values)
            {
                if (routeDataValue.Key.EndsWith("id", StringComparison.OrdinalIgnoreCase) || routeDataValue.Key.Equals("accesscode", StringComparison.OrdinalIgnoreCase))
                {
                    var value = HasherId.Decode(routeDataValue.Value, _salt);

                    context.ActionArguments[routeDataValue.Key] = value.ToString();
                }
            }

            base.OnActionExecuting(context);
        }
    }
}
