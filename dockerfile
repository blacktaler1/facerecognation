from nginx:1.22.0-alpine
workdir /app

# copy ./build/* /app
COPY ./build /usr/share/nginx/html
