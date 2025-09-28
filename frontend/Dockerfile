# === Development ===
FROM node:lts AS dev

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g @angular/cli

COPY . .

RUN ng config -g cli.warnings.versionMismatch false

RUN npm ci

RUN ng build --configuration development

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

# === Production ===
FROM node:lts AS prod

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g @angular/cli
RUN npm ci

COPY . .

RUN ng build --configuration production

FROM nginx:alpine AS nginx-prod

RUN rm -rf /usr/share/nginx/html/*

COPY --from=prod /app/dist/location-voitures-client/browser /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
