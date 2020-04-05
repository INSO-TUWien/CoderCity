# STAGE 1: Building angular project
FROM node:12-alpine as build-stage
# COPY APP FILES
WORKDIR /app

COPY package*.json /app/

# BUILD CONFIGURATION
RUN npm i

COPY . /app/

ARG build_configuration=production

# BUILD PROJECT with either "production" configuration or not.
RUN npm run build -- --configuration=${build_configuration} --output-path=./dist/out

# STAGE 2: NGINX - Copying build files from angular build image
FROM nginx
COPY --from=build-stage /app/dist/out /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

