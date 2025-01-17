export const generateUniqueFileName = (prefix = "image", type = "png") => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.-]/g, ""); // Remove caracteres inválidos para nomes de arquivos
  return `${type}_${timestamp}.png`;
};
