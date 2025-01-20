using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Helper
{
	public static class ExtensionMethods
	{
		public static string RemoveWhiteSpace(this string value)
		{
			return value?.Replace(" ", "") ?? string.Empty;
		}

		public static string ReplaceWhiteSpace(this string value, string character)
		{
			return value?.Replace(" ", character) ?? string.Empty;
		}

        public static string ConvertToBase64(this Stream stream)
        {
            byte[] bytes;
            using (var memoryStream = new MemoryStream())
            {
                stream.CopyTo(memoryStream);
                bytes = memoryStream.ToArray();
            }

            return Convert.ToBase64String(bytes);
        }

        public static Stream ConvertToStream(this string base64)
        {
            if (base64.Contains(","))
                base64 = base64.Split(',')[1];

            var bytes = Convert.FromBase64String(base64);

            return new MemoryStream(bytes);
        }

        public static byte[] ConvertToBytes(this string base64)
        {
            if (base64.Contains(","))
                base64 = base64.Split(',')[1];

            return Convert.FromBase64String(base64);
        }
    }
}
