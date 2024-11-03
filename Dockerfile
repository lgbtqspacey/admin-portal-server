FROM node:20-alpine
WORKDIR /app/server

COPY package*.json ./
RUN npm i -g typescript tsconfig-paths && npm ci --ignore-scripts
COPY . .

RUN npm run build

EXPOSE 8001
CMD [ "npm", "start" ]