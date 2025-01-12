using Domain.DTO;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Spire.Doc;
using System;
using System.Net;
using System.Text.RegularExpressions;

namespace Services
{
	public class GuestService : IGuestService
	{
		private readonly IGuestRepository _guestRepository;
		private readonly IEventService _eventService;
		private readonly IStorageService _storageService;

		public GuestService(IGuestRepository guestRepository, IEventService eventService, IStorageService storageService)
		{
			_guestRepository = guestRepository;
			_eventService = eventService;
			_storageService = storageService;
		}

		public ResponseModel<object> Add(GuestDTO model)
		{
			try
			{
				// Validação dos campos obrigatórios
				if (string.IsNullOrEmpty(model.Name))
				{
					return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Nome é obrigatório.");
				}

				if (string.IsNullOrEmpty(model.Email))
				{
					return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Email é obrigatório.");
				}

				string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

				if (!Regex.IsMatch(model.Email, pattern))
				{
					return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Email inválido.");
				}

				if (model.GuestTypeId == Guid.Empty)
				{
					return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Tipo de Convidado é obrigatório.");
				}

				var eventItem = _eventService.Get(model.EventId);

				if (eventItem == null)
				{
					return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Evento é obrigatório.");
				}

				//if (DateTime.Now > eventItem.Date.Add(eventItem.EndTime)) // Já passou o horário final do evento
				//{
				//	return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Não é permitido adicionar mais convidados (evento finalizado).");
				//}

				if (eventItem.Pax.HasValue) // Tem limite de convidados
				{
					if (_eventService.CountGuests(eventItem.Id) >= eventItem.Pax)
					{
						return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Limite de convidados atingido para este evento.");
					}
				}

				// Verificar se o email já está cadastrado para o evento
				if (_guestRepository.Exists(model.EventId, model.Email))
				{
					return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Email já cadastrado para este evento.");
				}

				// Criar entidade Guest
				var guest = new Guest
				{
					Name = model.Name.Trim(),
					Email = model.Email,
					EventId = model.EventId,
					GuestTypeId = model.GuestTypeId
				};

				// Upload da foto, se necessário
				if (!string.IsNullOrEmpty(model.Photo))
				{
					guest.Photo = _storageService.UploadFile(model.Photo, guest.EventId, guest.Id);
				}

				// Inserir o convidado no repositório
				_guestRepository.Insert(guest);

				// Retornar resposta de sucesso
				return ResponseModel<object>.Success(new { id = guest.Id, photo = guest.Photo }, HttpStatusCode.OK);
			}
			catch (Exception ex)
			{
				// Retornar erro genérico em caso de exceção
				return ResponseModel<object>.Error(HttpStatusCode.InternalServerError, ex.Message);
			}
		}
	}
}
