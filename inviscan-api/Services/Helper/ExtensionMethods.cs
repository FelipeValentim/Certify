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
	}
}
