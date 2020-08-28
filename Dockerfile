FROM node:alpine
WORKDIR /rate2rate
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3005
CMD ["npm","start"]