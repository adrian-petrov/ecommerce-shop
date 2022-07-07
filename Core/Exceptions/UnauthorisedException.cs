using System;

namespace Core.Exceptions
{
    public class UnauthorisedException : Exception
    {
        public UnauthorisedException()
        {
        }

        public UnauthorisedException(string message) : base(message)
        {
        }
    }
}