# 🍕 Cosa Nostra — Backend API

![Vercel Deploy]()
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

> API RESTful y lógica de servidor para el sistema de gestión gastronómica **Cosa Nostra**. Construida con Node.js, Express y MongoDB, provee servicios seguros de autenticación, gestión de reservas y métricas en tiempo real.

🔗 **Base URL (Producción):** `https://backend-restaurante-sigma.vercel.app`  
🔗 **Repositorio Frontend:** [Enlace al repo de Facundo]

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura y Flujo](#-arquitectura-y-flujo)
- [Decisiones de Diseño](#-decisiones-de-diseño)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Roles y Permisos](#-roles-y-permisos)
- [Desafíos Técnicos Superados](#-desafíos-técnicos-superados)
- [Deploy en Vercel](#-deploy-en-vercel)
- [Contribución](#-contribución)
- [Equipo](#-equipo)

---

## ✨ Características

- 🔐 **Autenticación y Autorización** — Emisión y validación de JSON Web Tokens (JWT) con encriptación de contraseñas (Bcrypt).
- 📅 **Motor de Reservas** — Lógica de validación de disponibilidad, control de fechas y estados de reserva.
- 📊 **Agregación de Datos** — Consultas complejas a MongoDB para generar estadísticas del Dashboard (horas pico, tendencias).
- 🛡️ **Seguridad Integral** — Middlewares de protección de rutas, validación de roles y control de CORS estricto.
- ☁️ **Optimización Serverless** — Arquitectura adaptada para cold-starts eficientes en Vercel.

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| [Node.js](https://nodejs.org/) | Entorno de ejecución |
| [Express.js](https://expressjs.com/) | Framework web y enrutamiento |
| [MongoDB Atlas](https://www.mongodb.com/) | Base de datos NoSQL en la nube |
| [Mongoose](https://mongoosejs.com/) | ODM para modelado de datos |
| [JWT](https://jwt.io/) | Estándar de seguridad para tokens |

---

## 🏗️ Arquitectura y Flujo

El backend sigue una arquitectura en capas, separando responsabilidades para facilitar el testing y la escalabilidad.

```mermaid
graph TD
    Req[🌐 Request del Cliente] --> App[app.js\nCORS & Config]
    App --> Routes[Rutas /api/*]
    Routes --> AuthMW{Middleware\nAuth & Roles}
    
    AuthMW -->|Token Inválido| Err[❌ 401/403 Error]
    AuthMW -->|Token Válido| Ctrl[Controladores]
    
    Ctrl --> Svc[Servicios\nLógica de Negocio]
    Svc --> Model[Modelos Mongoose]
    Model <--> DB[(MongoDB Atlas)]
    
    Ctrl --> Res[JSON Response]
```

## 🧩 Decisiones de Diseño

| Decisión | Alternativa considerada | Por qué elegimos esta opción |
|---|---|---|
| **Arquitectura Modular (Feature-based)** | MVC Tradicional | Agrupar por dominio (Auth, Users, Reservations) facilita encontrar el código y escalar el equipo. |
| **Punto de Entrada en `app.js`** | `index.js` único | Separar la lógica de la app (`app.js`) de la inicialización del puerto (`index.js`) es vital para entornos Serverless como Vercel. |
| **CORS Manual (Middleware)** | Librería `cors` de npm | La librería estándar bloqueaba las peticiones preflight (`OPTIONS`) en Vercel. Implementarlo a mano garantizó el control total de los headers. |
| **MongoDB (NoSQL)** | PostgreSQL / SQL | Los documentos JSON se mapean perfectamente con los estados y datos flexibles de una reserva de restaurante. |

---

## 📁 Estructura del Proyecto

```text
src/
├── config/              # Configuración de la base de datos (db.js)
├── middlewares/         # Interceptores: Autenticación, Roles y Manejo de Errores
├── modules/             # Arquitectura modular por dominio
│   ├── auth/            # Controladores, rutas, servicios y validación de Auth
│   ├── reservations/    # CRUD completo, modelos y lógica de reservas
│   └── users/           # Lógica de negocio y modelos de usuarios
├── shared/              # Utilidades: Clases de error (AppError) y validadores genéricos
├── app.js               # Configuración de Express, Middlewares y CORS (Punto de entrada Vercel)
└── index.js             # Inicialización del servidor para entorno de desarrollo local
