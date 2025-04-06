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

            if (string.IsNullOrEmpty(eventField.Placeholder))
            {
                throw new BusinessException("Placeholder é obrigatório.");
            }

            if (!Enum.IsDefined(typeof(FieldType), eventField.Type))
            {
                throw new BusinessException("Tipo do dado é obrigatório.");
            }

            var order = _eventFieldRepository.GetMax(x => x.DisplayOrder, f => f.EventId == eventField.EventId);

            var entity = new EventField
            {
                EventId = eventField.EventId,
                Type = eventField.Type.ToString(),
                Placeholder = eventField.Placeholder,
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
            var newIndex = reorderField.NewIndex;

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
    }
}
