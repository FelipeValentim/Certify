#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base

# Fontes do Windows no Linux para o DOCX
RUN sed -i'.bak' 's/$/ contrib/' /etc/apt/sources.list
RUN apt-get update; apt-get install -y ttf-mscorefonts-installer fontconfig

# Dependências do GDI+
RUN apt-get update && apt-get install -y libgdiplus

WORKDIR /app
EXPOSE 80
EXPOSE 443

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

FROM build AS publish
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Build args
ARG STORAGE_ACCOUNT_ID
ARG STORAGE_ACCESS_KEY_ID
ARG STORAGE_SECRET_ACCESS_KEY
ARG STORAGE_BUCKET_NAME
ARG CONNECTION_STRING

# ENV
ENV STORAGE_ACCOUNT_ID=$STORAGE_ACCOUNT_ID
ENV STORAGE_ACCESS_KEY_ID=$STORAGE_ACCESS_KEY_ID
ENV STORAGE_SECRET_ACCESS_KEY=$STORAGE_SECRET_ACCESS_KEY
ENV STORAGE_BUCKET_NAME=$STORAGE_BUCKET_NAME
ENV CONNECTION_STRING=$CONNECTION_STRING

ENTRYPOINT ["dotnet", "API.dll"]