using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IHashService
    {
        string HashPassword(string password);

        bool VerifyPassword(string password, string hashedPassword);
    }
}
