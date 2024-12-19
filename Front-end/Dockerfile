FROM Node:18-alpine AS Builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=Builder /app/build ./usr/share/nginx/html

EXPOSE 80

CMD [ "nginx","-g","deamon of;" ]