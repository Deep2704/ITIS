FROM node:18-alpine
WORKDIR /react
COPY public/ /react/public
COPY src/ /react/src
COPY package.json /react/
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
