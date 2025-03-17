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

CMD ["npm", "run", "start"]

# If you want to run only this image (instead of both api and frontend with compose) use "docker run -p 4000:4000 IMAGE",