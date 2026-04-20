# 🚀 DevOps & Deployment (Azure)

## 📌 Enfoque general

El proyecto fue desplegado siguiendo una arquitectura moderna desacoplada:

- Frontend separado del backend
- Backend expuesto como API REST
- Base de datos en la nube
- CI/CD automatizado con GitHub Actions

**Esto permite:**

- Escalabilidad independiente
- Deploys más rápidos
- Mejor mantenimiento

---

## ☁️ Arquitectura en la nube
```bash
[ React App (Vite) ]
        ↓
Azure Static Web Apps
        ↓
[ ASP.NET Core API ]
        ↓
Azure App Service
        ↓
[ SQL Server ]
        ↓
Azure SQL Database
```
---

## 🎨 Frontend Deployment

### 🧰 Tecnología
- React + Vite
- Tailwind CSS

### ☁️ Servicio
- Azure Static Web Apps

### ⚙️ Configuración clave
- Build automático desde GitHub

Uso de variables de entorno:
```bash
VITE_API_URL=https://todolistapi-xxxx.azurewebsites.net
```

### 🔄 Flujo de deploy
- Push a main
- GitHub Actions se ejecuta automáticamente
- Se hace build (npm run build)
- Se publica en Azure Static Web Apps

---

## 🔧 Backend Deployment

### 🧰 Tecnología
- ASP.NET Core Web API (.NET 8)

### ☁️ Servicio
- Azure App Service

### ⚙️ Configuración
- Publicación desde VS Code / CLI

Variables de entorno en Azure:
- Connection Strings
- JWT Secret
- CORS

### 🌐 Ejemplo de endpoint
```bash
https://todolistapi-xxxx.azurewebsites.net/api/tareas
```
---

## 🗄️ Base de Datos

### ☁️ Servicio
- Azure SQL Database

### ⚙️ Configuración
- Firewall configurado para permitir acceso
- Conexión mediante Entity Framework Core
- Connection string almacenado en Azure

---

## 🔐 Seguridad y configuración

### CORS

Configurado en backend para permitir requests desde el frontend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("https://tu-frontend.azurestaticapps.net")
            .AllowAnyHeader()
            .AllowAnyMethod());
});
```

**Variables de entorno**

Separación clara entre entornos:

- Desarrollo → .env
- Producción → Azure Configuration

---

## 🔄 CI/CD con GitHub Actions

### 🎯 Objetivo

Automatizar build y deploy del frontend.

### ⚙️ Flujo
- Trigger: push a main
- Instalación de dependencias
- Build del proyecto
- Deploy automático

### 📄 Ejemplo simplificado
```YAML
name: Deploy Frontend

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm install
        working-directory: frontend

      - name: Build
        run: npm run build
        working-directory: frontend
```

---

## ⚠️ Problemas reales enfrentados

### 🔴 Error CORS
**Causa:** frontend y backend en dominios distintos  
**Solución:** policy en backend

### 🔴 Error 500.30 en Azure
**Causa:** fallo en startup de .NET  
**Solución:**
- Revisar logs
- Validar connection string
- Revisar variables de entorno

### 🔴 Diferencias Dev vs Prod
- URLs distintas
- Variables no configuradas

**Solución aplicada:**
- Centralización en apiClient
- Uso de import.meta.env

---

## 📈 Buenas prácticas aplicadas
- Separación frontend/backend
- Variables de entorno por ambiente
- CI/CD automatizado
- Uso de servicios gestionados (PaaS)
- Logging y debugging en producción

---

## 💡 Mejoras futuras
- CI/CD también para backend
- Deploy automático con GitHub Actions para API
- Dockerización del backend
- Uso de Azure Key Vault
- Monitoreo con Application Insights

