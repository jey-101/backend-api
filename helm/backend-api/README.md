# Backend API Helm Chart

This Helm chart defines the Kubernetes deployment shape for the `.NET 8` Backend API. 
It is designed to be consumed by the **Kustomize overlays** in our GitOps repository, allowing different environments (dev, staging, prod) to override specific values like replica counts and image tags.

---

## 📦 What this Chart deploys

- **Deployment**: The actual pods running the `.NET 8` container. It includes:
  - Configurable resource requests and limits.
  - Configurable replica counts.
  - `livenessProbe` and `readinessProbe` targeting the `/health` and `/health/ready` endpoints.
- **Service**: A `ClusterIP` service exposing port `8080` internally within the Kubernetes cluster, allowing the Ingress or Frontend to route traffic to the pods.

---

## ⚙️ Configuration (values.yaml)

The default `values.yaml` provides a baseline configuration. These values are typically overridden by the GitOps repository per environment.

| Parameter | Description | Default Value |
|-----------|-------------|---------------|
| `replicaCount` | Number of pod replicas to run. | `1` |
| `image.repository` | The ECR repository URL. | `PLACEHOLDER_ECR_URL/backend-api` |
| `image.tag` | The container image tag to deploy. | `latest` |
| `service.port` | The internal Kubernetes port for the service. | `8080` |
| `resources.requests` | Guaranteed CPU/Memory allocation for the pod. | `100m` CPU, `128Mi` RAM |
| `resources.limits` | Maximum CPU/Memory the pod can consume. | `500m` CPU, `256Mi` RAM |

---

## 🛠️ Usage

This chart is **not** meant to be manually installed via `helm install` in higher environments.
Instead, the `gitops-k8s-manifests` repository runs `helm template` (or Kustomize helm inflation) to generate the base manifests, which are then patched for `dev`, `staging`, and `prod` before being auto-synced by **ArgoCD**.
