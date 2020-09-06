FROM node:12-alpine
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3005
CMD ["npm","run","start:prod"]