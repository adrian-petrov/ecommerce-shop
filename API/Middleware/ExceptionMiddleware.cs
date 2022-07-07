using System;
using System.Collections.Generic;
using System.Data;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Core;
using Core.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MySqlConnector;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var response = context.Response;
                response.ContentType = "application/json";
                response.StatusCode = ex switch
                {
                    ApiException e => (int)HttpStatusCode.BadRequest,
                    UnauthorisedException e => (int)HttpStatusCode.Unauthorized,
                    KeyNotFoundException e => (int)HttpStatusCode.NotFound,
                    DuplicateNameException e => (int)HttpStatusCode.Conflict,
                    DbUpdateException e => (int)HttpStatusCode.Conflict,
                    _ => (int)HttpStatusCode.InternalServerError
                };

                var exceptionMessage = GetExceptionMessage(ex);
                if (exceptionMessage == Constants.RefreshTokenInvalid)
                {
                    response.Cookies.Delete(Constants.RefreshTokenCookie);
                }
                
                var serializerOptions = new JsonSerializerOptions{ PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
                await response.WriteAsJsonAsync(new
                {
                    Message = exceptionMessage
                }, serializerOptions);
            }
        }

        private static string GetExceptionMessage(Exception ex)
        {
            var message = ex.Message;
            var innerException = ex.InnerException;

            if (innerException is not MySqlException dbException) return message;
            
            message = dbException.ErrorCode switch
            {
                MySqlErrorCode.DuplicateKeyEntry => "Duplicate Key Entry",
                MySqlErrorCode.DuplicateKey => "There is already a key with the given values",
                MySqlErrorCode.RowIsReferenced => "Cannot delete or update a parent row: a foreign key constraint fails",
                MySqlErrorCode.RowIsReferenced2 => "Cannot delete or update a parent row: a foreign key constraint fails",
                _ => "Something went wrong during the database operation"
            };

            return message;
        }
    }
}