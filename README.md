# Delilah Restó API
## Plataforma de manejo de pedidos de un restaurant

3er proyecto del curso de Desarrollo Web Full Stack de Acámica.

## Recursos & tecnologías utilizadas

- Node.js
- Nodemon
- Express.js
- Postman (testeo de endpoints)
- XAMPP
- MySQL
- Sequelize
- Jsonwebtoken (para la autenticación de users a través del uso de un token)
- Swagger Editor (documentación OpenAPI)

## Documentación de la API

Importar el archivo en formato yaml `delilah-resto.yaml` en [Swagger](https://editor.swagger.io/).

En la documentación se encontrará el listado de endpoints y métodos disponibles, con información que explica como hacer utilizarlos.

## Instalación e inicializacion

### 1 - Clonar el repositorio

Clonar el [repositorio](https://github.com/delfinacamacho/delilah-resto) manualmente, o desde la consola con el siguiente link:

`git clone https://github.com/delfinacamacho/delilah-resto.`

### 2 - Instalación de dependencias

```
npm install
```

### 3 - Crear base de datos

- Instalar XAMPP (Apache, MySQL, PhPMyAdmin), ejecutando el programa desde el puerto `3000`.
- Inicializar los servicios de Apache y MySQL
- Abrir el [panel de control](http://localhost/phpmyadmin/) del servicio.
- Crear una nueva base de datos llamada `delilah-resto` desde el panel de control
- Descargar el archivo `/database/queries.sql` y e importarlo en la base de datos a través del comando `Importar` del panel de control, o ejecutar manualmente la consulta SQL copiando el código en la consola.

### 4 - Iniciar el servidor

Desde la consola ejecutar `nodemon index.js`.


### 5 - Testear

Probar el funcionamiento de los endpoints mediante Postman.

[Colección de requests en Postman](https://www.getpostman.com/collections/d7efc3c2aa51b4903c16)
