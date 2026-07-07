const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Jagmohan Singh\\backend-api';

const files = {
  'src/Backend.Api/Backend.Api.csproj': `<Project Sdk="Microsoft.NET.Sdk.Web">\n  <PropertyGroup>\n    <TargetFramework>net8.0</TargetFramework>\n    <Nullable>enable</Nullable>\n    <ImplicitUsings>enable</ImplicitUsings>\n  </PropertyGroup>\n</Project>`,
  'src/Backend.Api/Program.cs': `var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\n\napp.MapGet("/", () => "Hello from .NET 8 Backend API on EKS!");\napp.MapGet("/health", () => Results.Ok(new { status = "Healthy" }));\napp.MapGet("/health/ready", () => Results.Ok(new { status = "Ready" }));\n\napp.Run();`,
  'src/Backend.Api/appsettings.json': `{\n  "Logging": {\n    "LogLevel": {\n      "Default": "Information",\n      "Microsoft.AspNetCore": "Warning"\n    }\n  },\n  "AllowedHosts": "*"\n}`,
  'Dockerfile': `FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build\nWORKDIR /src\nCOPY src/Backend.Api/Backend.Api.csproj src/Backend.Api/\nRUN dotnet restore src/Backend.Api/Backend.Api.csproj\nCOPY src/Backend.Api/ src/Backend.Api/\nWORKDIR /src/src/Backend.Api\nRUN dotnet publish -c Release -o /app/publish\n\nFROM mcr.microsoft.com/dotnet/aspnet:8.0\nWORKDIR /app\nCOPY --from=build /app/publish .\nENTRYPOINT ["dotnet", "Backend.Api.dll"]`,
  '.dockerignore': `bin/\nobj/\n.git/`,
  'helm/backend-api/Chart.yaml': `apiVersion: v2\nname: backend-api\ndescription: A Helm chart for the Backend API\ntype: application\nversion: 0.1.0\nappVersion: "1.0.0"`,
  'helm/backend-api/values.yaml': `replicaCount: 1\nimage:\n  repository: PLACEHOLDER_ECR_URL/backend-api\n  pullPolicy: IfNotPresent\n  tag: "latest"\nservice:\n  type: ClusterIP\n  port: 8080\nresources:\n  requests:\n    cpu: 100m\n    memory: 128Mi\n  limits:\n    cpu: 500m\n    memory: 256Mi`,
  'helm/backend-api/templates/deployment.yaml': `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: {{ .Release.Name }}\n  labels:\n    app: {{ .Release.Name }}\nspec:\n  replicas: {{ .Values.replicaCount }}\n  selector:\n    matchLabels:\n      app: {{ .Release.Name }}\n  template:\n    metadata:\n      labels:\n        app: {{ .Release.Name }}\n    spec:\n      containers:\n        - name: {{ .Release.Name }}\n          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"\n          imagePullPolicy: {{ .Values.image.pullPolicy }}\n          ports:\n            - name: http\n              containerPort: 8080\n              protocol: TCP\n          resources:\n            {{- toYaml .Values.resources | nindent 12 }}\n          livenessProbe:\n            httpGet:\n              path: /health\n              port: 8080\n            initialDelaySeconds: 15\n            periodSeconds: 30\n          readinessProbe:\n            httpGet:\n              path: /health/ready\n              port: 8080\n            initialDelaySeconds: 10\n            periodSeconds: 10`,
  'helm/backend-api/templates/service.yaml': `apiVersion: v1\nkind: Service\nmetadata:\n  name: {{ .Release.Name }}\n  labels:\n    app: {{ .Release.Name }}\nspec:\n  type: {{ .Values.service.type }}\n  ports:\n    - port: {{ .Values.service.port }}\n      targetPort: http\n      protocol: TCP\n      name: http\n  selector:\n    app: {{ .Release.Name }}`,
  '.github/workflows/ci-cd.yaml': `name: CI/CD Pipeline\n\non:\n  push:\n    branches: [main]\n\njobs:\n  build-and-push:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Setup .NET\n        uses: actions/setup-dotnet@v3\n        with:\n          dotnet-version: '8.0.x'\n      - name: Restore dependencies\n        run: dotnet restore src/Backend.Api/Backend.Api.csproj\n      - name: Build\n        run: dotnet build src/Backend.Api/Backend.Api.csproj --no-restore\n      # - name: Push to ECR\n      #   run: echo "Docker build and push to ECR here"\n      # - name: Update GitOps repo\n      #   run: echo "Update Kustomize image tag here"`
};

for (const [file, content] of Object.entries(files)) {
  const fullPath = path.join(baseDir, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Backend scaffold completed successfully.');
