# 🧠 Lecciones aprendidas

## ⚙️ Arquitectura
- Separar Controller / Service / Repository mejora la mantenibilidad, pero agrega complejidad inicial
- El uso de DTOs evita acoplamiento entre backend y frontend
- Diseñar pensando en testabilidad desde el inicio simplifica mucho el testing
---
## 🌐 Frontend & UX
- Los Skeleton Loaders mejoran la percepción de velocidad aunque no reduzcan el tiempo real
- La Optimistic UI hace que la app se sienta instantánea
- Manejar estados como loading, error y empty es clave para una buena UX
---
## 🔄 Estado y sincronización
- Sincronizar UI con backend puede generar inconsistencias si no se maneja rollback
- Los updates optimistas requieren:
    - Estado previo
    - Reconciliación con backend
    - Manejo de errores
---
## ☁️ Deploy & DevOps
- Las diferencias entre desarrollo y producción son una fuente común de errores
- Centralizar configuración (API URL, env vars) evita bugs
- CORS es uno de los problemas más frecuentes en apps distribuidas
---
## 🧪 Testing
- La combinación de tests unitarios + E2E entrega mayor confianza
- Playwright permite validar flujos reales de usuario
- Tests bien diseñados ayudan a detectar regresiones rápidamente
---
## ⚠️ Errores reales enfrentados
- Problemas de CORS en Azure
- Error 500.30 por fallo en startup de .NET
---
## 🚀 Qué haría diferente
- Implementar React Query desde el inicio
- Automatizar CI/CD también para backend
- Incorporar manejo global de errores desde el principio
- Diseñar mejor los tipos compartidos entre frontend y backend
---
## 👉 Conclusión
Este proyecto evolucionó desde un CRUD básico hasta una aplicación con:
- Arquitectura en capas
- Testing
- Optimistic UI
- Deploy en la nube

Enfoque progresivo basado en mejora continua.