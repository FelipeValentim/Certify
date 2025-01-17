using CSharpVitamins;
using Domain.Constants;
using HashidsNet;

namespace Services.Helper
{
    public static class HasherId
    {
        private static readonly int length = 8;

        public static string Encode(Guid id, string salt = Salt.Salt1)
        {
            return new Hashids(salt, length).EncodeHex(id.ToString("N"));
        }

        public static Guid Decode(object key, string salt = Salt.Salt1)
        {
            var hashids = new Hashids(salt, length);

            var decoded = hashids.DecodeHex(key as string);

            if (string.IsNullOrEmpty(decoded))
            {
                return Guid.Empty;
            }

            Guid guid = Guid.ParseExact(decoded, "N");

            return guid;
        }
    }
}
