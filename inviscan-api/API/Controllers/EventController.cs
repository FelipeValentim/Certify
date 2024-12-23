using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository;
using System.Security.Claims;
using InviScan;
using Xceed.Words.NET;
using Microsoft.Extensions.Logging;
using Xceed.Document.NET;
using System.Text.RegularExpressions;
using Domain.Interfaces.Services;
using Domain.Identity;
using Domain.Interfaces.Repositories;
using API.Models;
using Domain.Entities;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IEventRepository _eventRepository;
        private readonly IGuestRepository _guestRepository;
        private readonly IDocumentService _documentService;
        public EventController(IHttpContextAccessor httpContextAccessor,  IEventRepository eventRepository, IGuestRepository guestRepository, IWebHostEnvironment webHostEnvironment, IDocumentService documentService)
        {
            _eventRepository = eventRepository;
            _httpContextAccessor = httpContextAccessor;
            _guestRepository = guestRepository;
            _webHostEnvironment = webHostEnvironment;
            _documentService = documentService;
        }

        [HttpGet("GetEvents")]
        public async Task<IActionResult> GetEvents()
        {
            try
            {
                await Task.Delay(200);

                var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(CustomClaimTypes.Id);

                var events = _eventRepository.GetEvents(userId);

                var items = events.Select(e => new EventViewModel
                {
                    Id = e.Id,
                    Date = e.Date.ToString("dd/MM/yyyy"),
                    Name = e.Name,
                    Photo = e.Photo,
                    EventType = new EventTypeViewModel
                    {
                        Name = e.EventType.Name,
                    }
                });

                return StatusCode(StatusCodes.Status200OK, items);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


		[HttpGet("NewEvent")]
		public IActionResult NewEvent(EventViewModel model)
		{
			try
			{
				var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(CustomClaimTypes.Id);

                if (string.IsNullOrEmpty(model.Name))
                {
					return StatusCode(StatusCodes.Status400BadRequest, "Nome é obrigatório.");
				}

				if (string.IsNullOrEmpty(model.Date))
				{
					return StatusCode(StatusCodes.Status400BadRequest, "Data é obrigatório.");
				}

				if (model.EventTypeId == 0)
				{
					return StatusCode(StatusCodes.Status400BadRequest, "Tipo de evento é obrigatório.");
				}

				var guest = new Event()
				{
					Name = model.Name,
				};

				var events = _eventRepository.GetEvents(userId);

				var items = events.Select(e => new EventViewModel
				{
					Id = e.Id,
					Date = e.Date.ToString("dd/MM/yyyy"),
					Name = e.Name,
					Photo = e.Photo,
				});

				return StatusCode(StatusCodes.Status200OK, items);
			}
			catch (Exception ex)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
			}
		}

		[HttpGet("GetEvent/{id}")]
        public async Task<IActionResult> GetEvent(Guid id)
        {
            try
            {
                await Task.Delay(200);

				EventViewModel item;

                var eventItem = _eventRepository.GetEventWithGuests(id);

                item = new EventViewModel
				{
                    Id = eventItem.Id,
                    Date = eventItem.Date.ToString("dd/MM/yyyy"),
					StartTime = eventItem.StartTime.ToString(@"hh\:mm"),
					EndTime = eventItem.EndTime.ToString(@"hh\:mm"),
					Name = eventItem.Name,
                    Photo = eventItem.Photo,
                    Guests = eventItem.Guests.Where(x => !x.IsDeleted).Select(x => new GuestViewModel
					{
                        Id = x.Id,
                        Name = x.Name,
                        Photo = x.Photo,
                        Checkin = x.DateCheckin?.ToString("dd/MM/yyyy"),
                    }).ToList(),
                };

                return StatusCode(StatusCodes.Status200OK, item);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [AllowAnonymous]
        [HttpGet("GetCertificates/{id}")]
        public async Task<IActionResult> GetCertificates(Guid id)
        {
            var eventItem = _eventRepository.GetByID(id);

            var guests = _guestRepository.GetAll(x => x.EventId == id && x.DateCheckin.HasValue && !x.IsDeleted);

            string templatePath = Path.Combine(_webHostEnvironment.WebRootPath, "storage", "templates", "Documento.docx");
            string certificatesPath = Path.Combine(_webHostEnvironment.WebRootPath, "storage", "certificates");

            if (!Directory.Exists(certificatesPath))
                Directory.CreateDirectory(certificatesPath);

            string eventDirectory = Path.Combine(certificatesPath, id.ToString("N")); // Pasta do usuário com o id do convidado

            if (!Directory.Exists(eventDirectory))
                Directory.CreateDirectory(eventDirectory); // Cria a pasta do usuário, caso não exista

            foreach (var guest in guests)
            {
                var eventId = guest.EventId.ToString("N");
                var guestId = guest.Id.ToString("N");

                // Passo 1: Carregar o template DOCX
                using (DocX document = DocX.Load(templatePath))
                {
                    var options = new StringReplaceTextOptions
                    {
                        TrackChanges = false,
                        RegExOptions = RegexOptions.None,
                        NewFormatting = null,
                        FormattingToMatch = null,
                        FormattingToMatchOptions = MatchFormattingOptions.SubsetMatch,
                        EscapeRegEx = true,
                        UseRegExSubstitutions = false,
                        RemoveEmptyParagraph = true
                    };

                    // Passo 2: Substituir o placeholder {{nome}} pelo nome do convidado
                    options.SearchValue = "{{nome}}";
                    options.NewValue = guest.Name;
                    document.ReplaceText(options);

                    options.SearchValue = "{{data}}";
                    options.NewValue = eventItem.Date.ToString("d 'de' MMMM 'de' yyyy 'às' HH:mm");
                    document.ReplaceText(options);


                    // Passo 3: Salvar o documento com o nome do convidado
                    string tempDocxPath = Path.Combine(eventDirectory, $"{guest.Name.Replace(" ", "")}_{guest.Id.ToString("N").Substring(0, 8)}.docx");
                    document.SaveAs(tempDocxPath);

                    string pdfPath = Path.Combine(eventDirectory, $"{guest.Name.Replace(" ", "")}_{guest.Id.ToString("N").Substring(0, 8)}.pdf");

                    // Passo 4: Converter o documento DOCX para PDF
                    _documentService.ConvertDocxToPdf(tempDocxPath, pdfPath);
                }
            }

            return StatusCode(StatusCodes.Status200OK, "Certificados gerados com sucesso.");
        }


       
    }
}
