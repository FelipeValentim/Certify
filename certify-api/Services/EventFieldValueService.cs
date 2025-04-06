using Domain.DTO;
using Domain.Entities;
using Domain.Enum;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using System;

namespace Services
{
    public class EventFieldValueService : IEventFieldValueService
    {
        private readonly IEventFieldValueRepository _eventFieldValueRepository;
        private readonly IMappingService _mappingService;

        public EventFieldValueService(IEventFieldValueRepository eventFieldValueRepository, IMappingService mappingService)
        {
            _eventFieldValueRepository = eventFieldValueRepository;
            _mappingService = mappingService;
        }

        public Guid Add(EventFieldValueDTO fieldValue)
        {
            if (string.IsNullOrEmpty(fieldValue.Value))
            {
                throw new BusinessException($"Campo {fieldValue.EventField.Name} é obrigatório.");
            }

            var entity = new EventFieldValue
            {
                GuestId = fieldValue.GuestId,
                EventFieldId = fieldValue.EventFieldId,
                Value = fieldValue.Value,
            };

            _eventFieldValueRepository.Insert(entity);

            return entity.Id;
        }

    }
}
