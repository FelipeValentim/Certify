using System.Security.Cryptography;
using System.Text;

namespace event_checkin_api.Services
{
    public static class Hash
    {
        public static string HashPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

                // Convert byte array to a string
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        public static bool VerifyPassword(string enteredPassword, string storedHash)
        {
            string hashOfEnteredPassword = HashPassword(enteredPassword);
            return hashOfEnteredPassword.Equals(storedHash, StringComparison.OrdinalIgnoreCase);
        }
    }
}
