using System.Security.Cryptography;
using System.Text;
using Konscious.Security.Cryptography;

namespace Infrastructure.Services
{
    public static class Hash
    {
        public static string HashPassword(string password)
        {
        
            // Generate a salt
            var salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // Configure the Argon2id hasher
            var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
            {
                Salt = salt,
                DegreeOfParallelism = 8, // Number of threads to use
                Iterations = 4,          // Number of iterations
                MemorySize = 1024 * 64   // Memory size in KB
            };

            // Compute the hash
            byte[] hash = argon2.GetBytes(16);

            // Combine salt and hash and convert to Base64 for storage
            byte[] result = new byte[salt.Length + hash.Length];
            Buffer.BlockCopy(salt, 0, result, 0, salt.Length);
            Buffer.BlockCopy(hash, 0, result, salt.Length, hash.Length);

            return Convert.ToBase64String(result);
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            // Decode the Base64 encoded salt+hash
            byte[] decoded = Convert.FromBase64String(hashedPassword);

            // Extract the salt from the decoded value
            byte[] salt = new byte[16];
            Buffer.BlockCopy(decoded, 0, salt, 0, salt.Length);

            // Extract the hash from the decoded value
            byte[] originalHash = new byte[decoded.Length - salt.Length];
            Buffer.BlockCopy(decoded, salt.Length, originalHash, 0, originalHash.Length);

            // Hash the input password using the same salt
            var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
            {
                Salt = salt,
                DegreeOfParallelism = 8, // Number of threads to use
                Iterations = 4,          // Number of iterations
                MemorySize = 1024 * 64   // Memory size in KB
            };

            byte[] hash = argon2.GetBytes(16);

            // Compare the computed hash with the original hash
            return hash.SequenceEqual(originalHash);
        }
    }
}
