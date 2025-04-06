using Domain.DTO;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using System;

namespace Services
{
	public class EventFieldService : IEventFieldService
	{
		private readonly IEventFieldRepository _eventFieldRepository;
        private readonly IMappingService _mappingService;

        public EventFieldService(IEventFieldRepository eventFieldRepository, IMappingService mappingService)
		{
            _eventFieldRepository = eventFieldRepository;
            _mappingService = mappingService;
		}

        public Guid Add(EventFieldDTO eventField)
        {
            if (string.IsNullOrEmpty(eventField.Name))
            {
                throw new BusinessException("Nome do campo é obrigatório.");
            }

            if (!Enum.IsDefined(typeof(FieldType), eventField.Type))
            {
                throw new BusinessException("Tipo do dado é obrigatório.");
            }

            if (_eventFieldRepository.Count(x =>
                x.EventId == eventField.EventId &&
                x.Name.ToLower() == eventField.Name.ToLower()) > 0)
            {
                throw new BusinessException("Já existe um campo com esse nome.");
            }

            var order = _eventFieldRepository.GetMax(x => x.DisplayOrder, f => f.EventId == eventField.EventId);

            var entity = new EventField
            {
                EventId = eventField.EventId,
                Type = eventField.Type.ToString(),
                Name = eventField.Name,
                DisplayOrder = order + 1,
            };

            _eventFieldRepository.Insert(entity);

            return entity.Id;
        }

        public IEnumerable<EventFieldDTO> GetAll(Guid eventId)
        {
            var entities = _eventFieldRepository.GetAll(x => x.EventId == eventId);

            var dtos = _mappingService.Map<IEnumerable<EventFieldDTO>>(entities);

            return dtos;
        }

        public void ReorderFields(EventReorderFieldDTO reorderField)
        {
            var fieldId = reorderField.FieldId;
            var newIndex = reorderField.DisplayOrder;

            var field = _eventFieldRepository.GetByID(fieldId);

            if (field == null)
            {
                throw new BusinessException("Campo não encontrado.");
            }

            var fields = _eventFieldRepository.GetAll(f => f.EventId == field.EventId).OrderBy(f => f.DisplayOrder).ToList();

            var oldIndex = fields.FindIndex(f => f.Id == field.Id);

            if (oldIndex == -1 || newIndex < 0 || newIndex >= fields.Count)
            {
                throw new BusinessException("Operação de reodenarção inválida.");
            }

            // Remove e re-insere na nova posição
            fields.RemoveAt(oldIndex);
            fields.Insert(newIndex, field);

            // Reatribui o DisplayOrder sequencialmente
            for (int i = 0; i < fields.Count; i++)
            {
                fields[i].DisplayOrder = i + 1;
                _eventFieldRepository.Update(fields[i]);
            }
        }

        public void ReorderFields(IEnumerable<Guid> reorderFields, Guid eventId)
        {
            if (eventId == Guid.Empty)
            {
                throw new NotFoundException("Evento não informado.");
            }

            if (reorderFields == null || !reorderFields.Any())
            {
                throw new BusinessException("Reordenação vazia.");
            }

            var reorderList = reorderFields.ToList();
            var fields = _eventFieldRepository
                           .GetAll(x => reorderList.Contains(x.Id) || x.EventId == eventId)
                           .ToList();

            var selectedFields = fields.Where(f => reorderList.Contains(f.Id)).ToList();
            if (selectedFields.Count != reorderList.Count)
            {
                throw new BusinessException("Alguns campos informados não foram encontrados para o evento.");
            }

            for (int i = 0; i < reorderList.Count; i++)
            {
                var field = selectedFields.First(f => f.Id == reorderList[i]);
                field.DisplayOrder = i + 1;
            }

            // Para os demais, reordena em sequência após os últimos
            var remainingFields = fields
                .Where(f => !reorderList.Contains(f.Id))
                .OrderBy(f => f.DisplayOrder) // mantém ordem antiga
                .ToList();

            int displayOrder = reorderList.Count + 1;
            foreach (var field in remainingFields)
            {
                field.DisplayOrder = displayOrder++;
            }

            _eventFieldRepository.UpdateRange(fields);
        }
    }
}
