// ==============================================================================
// EKS Backend API - Application Entry Point
// ==============================================================================

var builder = WebApplication.CreateBuilder(args);

// 1. Configure Services here (e.g., Dependency Injection, Database Contexts)
// builder.Services.AddControllers();

var app = builder.Build();

// 2. Configure the HTTP Request Pipeline here (e.g., Middleware, CORS)
// app.UseHttpsRedirection();

// ------------------------------------------------------------------------------
// Route Definitions
// ------------------------------------------------------------------------------

// Root Endpoint - Simple validation that the API is responding
app.MapGet("/", () => "Hello from .NET 8 Backend API on EKS!");

// Liveness Probe - Kubernetes checks this to see if the pod is alive.
// If this fails, Kubernetes will restart the pod.
app.MapGet("/health", () => Results.Ok(new { status = "Healthy" }));

// Readiness Probe - Kubernetes checks this to see if the pod can accept traffic.
// If this fails, Kubernetes removes the pod from the Service load balancer.
// (In a real app, this would check DB connectivity, Redis, etc.)
app.MapGet("/health/ready", () => Results.Ok(new { status = "Ready" }));

// 3. Start the application
app.Run();