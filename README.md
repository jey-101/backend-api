# Backend API (.NET 8)

This repository contains the backend REST API for the EKS Application platform. It is built using **.NET 8** and is fully containerized and orchestrated via Helm on Kubernetes.

---

## 🏗️ Architecture & Tech Stack

- **Framework**: .NET 8 (ASP.NET Core Web API)
- **Containerization**: Multi-stage Docker build (SDK -> ASP.NET Runtime)
- **CI/CD**: GitHub Actions (Build, Test, Trivy Scan, ECR Push, GitOps Sync)
- **Deployment**: Helm Chart + Kustomize (via ArgoCD)

---

## 🚀 Getting Started Locally

To run this project on your local machine for development, follow these steps:

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker](https://docs.docker.com/get-docker/) (Optional, for testing the container locally)

### Running via .NET CLI
1. **Clone the repository**:
   ```bash
   git clone https://github.com/jey-101/backend-api.git
   cd backend-api/src/Backend.Api
   ```
2. **Restore dependencies**:
   ```bash
   dotnet restore
   ```
3. **Run the application**:
   ```bash
   dotnet run
   ```
   The application will start, typically accessible at `http://localhost:5000` or `https://localhost:5001`.

### Running via Docker
If you want to test the multi-stage Docker build locally:
```bash
# Build the image
docker build -t backend-api-local .

# Run the container (maps port 8080 inside the container to 8080 on your host)
docker run -p 8080:8080 backend-api-local
```

---

## 📁 Repository Structure

```
backend-api/
├── src/                          # Application source code
│   └── Backend.Api/
│       ├── Program.cs            # Application entry point & route definitions
│       ├── appsettings.json      # Local configuration settings
│       └── Backend.Api.csproj    # Project file and dependencies
├── helm/                         # Helm chart for Kubernetes deployment
│   └── backend-api/
├── .github/                      # GitHub Actions CI/CD workflows
│   └── workflows/
│       └── ci-cd.yaml            # Pipeline for Build -> Scan -> ECR -> GitOps
├── Dockerfile                    # Multi-stage container build instructions
└── README.md                     # This documentation
```

---

## 🔄 CI/CD Pipeline Flow

This repository uses a mature GitOps-driven CI/CD pipeline. On every push to the \`main\` branch:
1. **Test & Build**: .NET dependencies are restored and the code is compiled.
2. **Versioning**: An incremental semantic version tag is generated (e.g., \`v1.0.X\`).
3. **Containerize**: A Docker image is built.
4. **Security Scan**: The image is scanned for CRITICAL and HIGH vulnerabilities using Trivy. If vulnerabilities are found, the build halts.
5. **Push to Registry**: The clean image is pushed to AWS ECR.
6. **GitOps Promotion**: The pipeline checks out the \`gitops-k8s-manifests\` repository and automatically updates the \`dev\` environment's image tag, triggering ArgoCD to deploy the new version.
