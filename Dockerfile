# ---------------------------------------------------------
# STAGE 1: Build Environment
# ---------------------------------------------------------
# We use the full .NET SDK image to compile the application.
# This image contains all build tools but is too large for production.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy only the project file first to cache the 'dotnet restore' layer
# This speeds up future builds if the dependencies haven't changed.
COPY src/Backend.Api/Backend.Api.csproj src/Backend.Api/
RUN dotnet restore src/Backend.Api/Backend.Api.csproj

# Copy the rest of the source code and build the application
COPY src/Backend.Api/ src/Backend.Api/
WORKDIR /src/src/Backend.Api

# Publish the application in Release mode to the /app/publish directory
RUN dotnet publish -c Release -o /app/publish

# ---------------------------------------------------------
# STAGE 2: Production Runtime Environment
# ---------------------------------------------------------
# We use the much smaller ASP.NET Core runtime image for the final container.
# This significantly reduces the attack surface and image size.
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy the compiled binaries from the 'build' stage
COPY --from=build /app/publish .

# Define the entrypoint to start the API
ENTRYPOINT ["dotnet", "Backend.Api.dll"]