# Etapa base para o runtime
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Instalação de fontes do Windows
RUN apt-get update && apt-get install -y \
    wget \
    cabextract \
    xfonts-utils \
    ttf-mscorefonts-installer \
    --no-install-recommends && \
    echo "debconf ttf-mscorefonts-installer/accepted-mscorefonts-eula select true" | debconf-set-selections && \
    echo "debconf ttf-mscorefonts-installer/accepted-mscorefonts-eula seen true" | debconf-set-selections && \
    fc-cache -f -v && \
    apt-get clean

# Etapa build para compilar o projeto
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["API/API.csproj", "API/"]
COPY ["Repository/Repository.csproj", "Repository/"]
COPY ["Domain/Domain.csproj", "Domain/"]
COPY ["Infra/Infrastructure.csproj", "Infra/"]
COPY ["Services/Services.csproj", "Services/"]
RUN dotnet restore "API/API.csproj"
COPY . .
WORKDIR "/src/API"
RUN dotnet build "API.csproj" -c Release -o /app/build

# Etapa publish para publicar o projeto
FROM build AS publish
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa final com runtime e fontes instaladas
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "API.dll"]