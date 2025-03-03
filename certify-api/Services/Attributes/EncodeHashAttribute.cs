using Domain.Constants;
using Microsoft.AspNetCore.Mvc.Filters;
using Services.Helper;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Services.Attributes
{
    [AttributeUsage(AttributeTargets.Property)]
    public class EncodeHashAttribute : JsonConverterAttribute
    {
        private readonly string _salt;

        public EncodeHashAttribute(string salt) => _salt = salt;

        public override JsonConverter CreateConverter(Type typeToConvert) =>
             new EncodeHashConverter(_salt);
    }

    public class EncodeHashConverter : JsonConverter<string>
    {
        private readonly string _salt;

        public EncodeHashConverter(string salt) => _salt = salt;

        public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return reader.GetString(); // Mantemos a leitura sem alterações
        }

        public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
        {
            if (!string.IsNullOrEmpty(value))
            {
                string hashedValue = HasherId.Encode(value, _salt);
                writer.WriteStringValue(hashedValue);
            }
            else
            {
                writer.WriteNullValue();
            }
        }
    }
}
