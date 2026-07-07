FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY src/Backend.Api/Backend.Api.csproj src/Backend.Api/
RUN dotnet restore src/Backend.Api/Backend.Api.csproj
COPY src/Backend.Api/ src/Backend.Api/
WORKDIR /src/src/Backend.Api
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Backend.Api.dll"]