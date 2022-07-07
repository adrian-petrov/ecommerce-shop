using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace API.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestLoggingMiddleware> _logger;

        public RequestLoggingMiddleware(
            RequestDelegate next,
            ILogger<RequestLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            await LogRequest(context);
            await _next(context);
            // await LogResponse(context);
        }

        private async Task LogResponse(HttpContext context)
        {
            var originalBodyStream = context.Response.Body;

            await using var responseBody = new MemoryStream();
            context.Response.Body = responseBody;

            await _next(context);

            context.Response.Body.Seek(0, SeekOrigin.Begin);
            var bodyAsText = await new StreamReader(context.Response.Body).ReadToEndAsync();
            context.Response.Body.Seek(0, SeekOrigin.Begin);
            _logger.LogInformation($"Http Response Information:{Environment.NewLine}" +
                                   $"Schema:{context.Request.Scheme} " +
                                   $"Host: {context.Request.Host} " +
                                   $"Path: {context.Request.Path} " +
                                   $"QueryString: {context.Request.QueryString} " +
                                   $"Response Body: {bodyAsText}");

            await responseBody.CopyToAsync(originalBodyStream);
        }

        private async Task LogRequest(HttpContext context)
        {
            // ignore image uploads
            if (
                context.Request.Path.Value != null && context.Request.Path.Value.Contains("images"))
                return;

            context.Request.EnableBuffering();

            // StreamReader does not need to be wrapped in using because
            // bool leaveOpen parameter is false by default so it will call
            // Dispose() after reading the stream
            var streamReader = new StreamReader(context.Request.Body);
            var bodyAsText = await streamReader.ReadToEndAsync();

            _logger.LogInformation($"{Environment.NewLine}" +
                                   $"==================================== {Environment.NewLine}" +
                                   $"HTTP REQUEST INFORMATION: {Environment.NewLine}" +
                                   $"Schema: {context.Request.Scheme} {Environment.NewLine}" +
                                   $"Host: {context.Request.Host} {Environment.NewLine}" +
                                   $"Path: {context.Request.Path} {Environment.NewLine}" +
                                   $"QueryString: {context.Request.QueryString} {Environment.NewLine}" +
                                   $"Body: {bodyAsText} {Environment.NewLine}" +
                                   $"====================================" +
                                   $"{Environment.NewLine}");

            context.Request.Body.Position = 0;
        }
    }
}