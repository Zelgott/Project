# Etapa de construcción
FROM node:18 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json para instalar dependencias
COPY package.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente al contenedor
COPY . .

# Compila la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copia los archivos compilados desde la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
