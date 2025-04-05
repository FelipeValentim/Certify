using Domain.Exceptions;
using System.Net;

namespace Certify.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = context.Response;
            var error = "Erro interno no servidor.";

            switch (exception)
            {
                case UnauthorizedException ex:
                    response.StatusCode = StatusCodes.Status401Unauthorized;
                    error = ex.Message;
                    break;

                case NotFoundException ex:
                    response.StatusCode = StatusCodes.Status404NotFound;
                    error = ex.Message;
                    break;

                case ConflictException ex:
                    response.StatusCode = StatusCodes.Status409Conflict;
                    error = ex.Message;
                    break;

                case BusinessException ex:
                    response.StatusCode = StatusCodes.Status400BadRequest;
                    error = ex.Message;
                    break;

                default:
                    response.StatusCode = StatusCodes.Status500InternalServerError;
                    _logger.LogError(exception, error);
                    break;
            }

            await response.WriteAsync(error);
        }
    }
}
