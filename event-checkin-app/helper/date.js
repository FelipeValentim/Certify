export function getCurrentDateFormatted() {
  // Cria um novo objeto Date para obter a data e hora atuais
  const now = new Date();

  // Extrai o dia, mês e ano do objeto Date
  const day = String(now.getDate()).padStart(2, "0"); // Obtém o dia e garante que tenha 2 dígitos
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Obtém o mês (ajusta para 0-11) e garante 2 dígitos
  const year = now.getFullYear(); // Obtém o ano

  // Formata a data no formato dd/MM/yyyy
  const formattedDate = `${day}/${month}/${year}`;

  // Retorna a data formatada
  return formattedDate;
}
