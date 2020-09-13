FROM node:12-alpine as npm-packages
WORKDIR '/app'
COPY package.json .
COPY package-lock.json .
RUN npm install

FROM npm-packages as final
COPY . .
RUN npm run build
EXPOSE 3005
CMD ["npm","run","start:prod"]
