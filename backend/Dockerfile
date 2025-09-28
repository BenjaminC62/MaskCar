# === Base ===
# Utilisation d'alias pour lancer le bon container
FROM php:8.2 AS dev

WORKDIR /app

RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev libxml2-dev \
 && docker-php-ext-install pdo zip dom \
 && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sL https://github.com/axllent/mailpit/releases/download/v1.9.6/mailpit-linux-amd64.tar.gz -o mailpit.tar.gz \
    && tar -xzf mailpit.tar.gz \
    && mv mailpit /usr/local/bin/ \
    && chmod +x /usr/local/bin/mailpit \
    && rm mailpit.tar.gz

COPY . .

RUN composer install \
 && composer require dompdf/dompdf \
 && php artisan key:generate \
 && php artisan migrate:fresh \
 && php artisan db:seed

EXPOSE 8000 8025

ENTRYPOINT ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=8000 & mailpit --listen 0.0.0.0:8025 & echo \"[✅ Laravel dev running on :8000 | 📬 Mailpit on :8025]\" && tail -f /dev/null"]

# === Production ===
FROM php:8.2-fpm AS prod

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    unzip git libzip-dev libxml2-dev curl nginx \
 && docker-php-ext-install pdo zip dom \
 && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .

RUN git config --global --add safe.directory /var/www/html \
  && composer install \
  && php artisan key:generate \
  && php artisan migrate:fresh \
  && php artisan db:seed \
  && composer require dompdf/dompdf


# Ajout des droits d'accès pour le serveur web
RUN chmod -R 777 /var/www/html/database \
 && chmod -R 777 /var/www/html/storage

# Configuration de Nginx
RUN echo "server { \
    listen 80; \
    index index.php index.html; \
    server_name localhost; \
    root /var/www/html/public; \
    location / { \
        try_files \$uri \$uri/ /index.php?\$query_string; \
    } \
    location ~ \.php$ { \
        include fastcgi_params; \
        fastcgi_pass 127.0.0.1:9000; \
        fastcgi_index index.php; \
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name; \
    } \
    location ~ /\.ht { \
        deny all; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
