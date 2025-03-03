using AutoMapper;
using Domain.Constants;
using Domain.Identity;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Infrastructure.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Repository;
using Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
		policy.AllowAnyOrigin()
				  .AllowAnyMethod()
				  .AllowAnyHeader();
	});
});

// Add services to the container.

builder.Services.AddControllersWithViews();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Repositórios
builder.Services.AddTransient<IUserProfileRepository, UserProfileRepository>();
builder.Services.AddTransient<IEventRepository, EventRepository>();
builder.Services.AddTransient<IGuestRepository, GuestRepository>();
builder.Services.AddTransient<IEventTypeRepository, EventTypeRepository>();
builder.Services.AddTransient<IGuestTypeRepository, GuestTypeRepository>();
builder.Services.AddTransient<IEventTemplateRepository, EventTemplateRepository>();

// Serviços
builder.Services.AddTransient<IDocumentService, DocumentService>();
builder.Services.AddTransient<IHashService, HashService>();
builder.Services.AddTransient<ITokenService, TokenService>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IEventTypeService, EventTypeService>();
builder.Services.AddTransient<IUserContextService, UserContextService>();
builder.Services.AddTransient<IGuestTypeService, GuestTypeService>();
builder.Services.AddTransient<IStorageService, StorageService>();
builder.Services.AddTransient<IEventService, EventService>();
builder.Services.AddTransient<IEventTemplateService, EventTemplateService>();
builder.Services.AddTransient<IMailService, MailService>();
builder.Services.AddTransient<IGuestService, GuestService>();
builder.Services.AddTransient<IFormService, FormService>();
builder.Services.AddTransient<IQRCodeService, QRCodeService>();
builder.Services.AddTransient<IMappingService, MappingService>();
builder.Services.AddTransient<IImageManager, ImageManager>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<CertifyDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("Certify")));
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true); // Apenas para PostgreSQL

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(x =>
    {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Settings.SecretKey)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });


var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    UrlManager.API = "https://simply-novel-shiner.ngrok-free.app";
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllers();

app.Run();
