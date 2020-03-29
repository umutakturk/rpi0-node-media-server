FROM arm32v6/node:10.15-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 1935 5000
CMD ["node","app.js"]