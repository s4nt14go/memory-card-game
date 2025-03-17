FROM node:20-alpine

#Create app directory
WORKDIR /usr/src/app

# Copy package.json
COPY package.json .
COPY package-lock.json .

# Install app dependencies
RUN npm i ci

# Bundle app source
COPY . .

# Install `serve` to run the application.
RUN npm install -g serve

RUN npm run build

CMD ["npm", "run", "serve:build"]