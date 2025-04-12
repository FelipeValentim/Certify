using Domain.DTO;

namespace Domain.Interfaces.Services
{
	public interface IStorageService
	{
        /// <summary>
        /// Função para Upload de um arquivo no Storage.
        /// </summary>
        /// <param name="file">Objeto do arquivo</param>
        /// <param name="name">Nome do arquivo (opcional). Caso não seja passado, será criado um nome com GUID aleatório.</param>
        /// <returns>Retorna o caminho relativo salvo</returns>
        /// <exception cref="ArgumentException"></exception>
        Task<string> UploadFile(FileDTO file);
        Task<Stream> GetFileStream(string path);
    }
}
