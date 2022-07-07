using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace API.Helpers
{
    public class OperationCancelledExceptionFilter : ExceptionFilterAttribute
    {
        private readonly ILogger _logger;

        public OperationCancelledExceptionFilter(ILogger<OperationCancelledExceptionFilter> logger)
        {
            _logger = logger;
        }

        public override void OnException(ExceptionContext context)
        {
            if (context.Exception is not OperationCanceledException) return;
            
            context.ExceptionHandled = true;
            context.Result = new StatusCodeResult(499);
                
            _logger.LogInformation("Request was cancelled");
            _logger.LogInformation(
                "Request {method} {url} => {statusCode}",
                context.HttpContext.Request?.Method,
                context.HttpContext.Request?.Path.Value,
                context.HttpContext.Response.StatusCode);
        }
    }
}