
  # Plataforma de Gestión de Inventarios

Este proyecto es una aplicación web diseñada para ayudar a las empresas a gestionar eficientemente sus inventarios, pedidos y relaciones con proveedores. Permite a los usuarios autenticados acceder a información detallada sobre el estado de sus productos, realizar pedidos y contactar con proveedores.

## Información del Proyecto

**URL de la Aplicación (Ejemplo)**: [Accede al proyecto en Lovable](https://lovable.dev/projects/119c491e-3fe4-4de3-b113-65b8c1dd8e0d)

## Características Principales

*   **Autenticación de Usuarios**: Sistema seguro de inicio de sesión para proteger los datos de cada empresa.
*   **Módulo de Inventario (Inventory)**:
    *   Visualización en tabla del estado actual del inventario.
    *   Identificación clara de productos agotados.
    *   Alerta sobre productos próximos a agotarse.
    *   Sugerencias de proveedores para adquirir productos requeridos.
*   **Módulo de Pedidos (Orders)**:
    *   Gestión de un carrito de compras para los productos seleccionados.
    *   Interacción con una pasarela de pagos para completar las compras.
*   **Módulo de Proveedores (Suppliers)**:
    *   Descripción detallada de todos los proveedores disponibles.
    *   Listado de proveedores con los que se ha interactuado recientemente.
*   **Integración con Asistente IA vía WhatsApp**:
    *   Enlace directo a WhatsApp Web para contactar con un agente de Inteligencia Artificial.
    *   Consultas en tiempo real sobre el estado de los inventarios.
    *   Obtención de información de contacto de proveedores para facilitar negociaciones.

## Acceso a la Aplicación

Para acceder a la plataforma, necesitarás credenciales de usuario. A continuación, se proporcionan ejemplos de usuarios para demostración:

*   **Usuario 1**:
    *   **Email**: `carlos.perez@cafeandino.com`
    *   **Contraseña**: `pass123`
*   **Usuario 2**:
    *   **Email**: `camila.rojas@aseosexpress.co`
    *   **Contraseña**: `pass456`

**Nota**: Estas credenciales son solo para fines de demostración y prueba. En un entorno de producción, se deben utilizar credenciales únicas y seguras.

## ¿Cómo puedo editar este código?

Hay varias formas de editar tu aplicación.

**Usar Lovable**

Simplemente visita el [Proyecto Lovable](https://lovable.dev/projects/119c491e-3fe4-4de3-b113-65b8c1dd8e0d) y comienza a interactuar con las herramientas de desarrollo que provee.
Los cambios realizados a través de Lovable se confirmarán automáticamente en este repositorio.

**Usar tu IDE preferido (Desarrollo Local)**

Si deseas trabajar localmente usando tu propio IDE, puedes clonar este repositorio y enviar tus cambios. Los cambios enviados también se reflejarán en Lovable.
El único requisito es tener Node.js y npm instalados - [instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Sigue estos pasos:

```sh
# Paso 1: Clona el repositorio usando la URL Git del proyecto.
# Reemplaza <TU_URL_GIT> con la URL real de tu repositorio Git.
git clone <TU_URL_GIT>

# Paso 2: Navega al directorio del proyecto.
# Reemplaza <NOMBRE_DE_TU_PROYECTO> con el nombre real de la carpeta del proyecto.
cd <NOMBRE_DE_TU_PROYECTO>

# Paso 3: Instala las dependencias necesarias.
npm i

# Paso 4: Inicia el servidor de desarrollo con recarga automática y vista previa instantánea.
npm run dev
