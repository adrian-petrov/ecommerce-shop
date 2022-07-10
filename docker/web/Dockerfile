FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
WORKDIR /ecommerce-shop
EXPOSE 80
EXPOSE 443
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

FROM mcr.microsoft.com/dotnet/sdk:5.0-buster-slim AS build
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs
WORKDIR /ecommerce-shop
COPY *.sln ./
COPY API/API.csproj API/
COPY Core/Core.csproj Core/
COPY Infrastructure/Infrastructure.csproj Infrastructure/
COPY . .
RUN dotnet tool install --global dotnet-ef --version 5.0.11
ENV PATH="${PATH}:/root/.dotnet/tools"
RUN dotnet ef migrations add ShopFirstMigration -c ShopContext -p Infrastructure -s API -o Data/Migrations
RUN dotnet restore

RUN dotnet build -c Release -o /ecommerce-shop/build

FROM build AS publish
RUN dotnet publish -c Release -o /ecommerce-shop/publish

FROM base AS final
COPY --from=publish /ecommerce-shop/publish .

ENTRYPOINT ["dotnet", "API.dll"]
