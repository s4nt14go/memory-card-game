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

# In the case you are developing locally and want to run a frontend container separately using "docker run -p 3000:3000 frontend" (instead of running both frontend and api with compose), use:
#RUN REACT_APP_GRAPHQL_URL=http://localhost:4000/graphql yarn build
RUN REACT_APP_GRAPHQL_URL=https://trials-api-122521982958.us-central1.run.app/graphql yarn build
# ... if by the contrary you use docker-compose.yml to set REACT_APP_GRAPHQL_URL, use:
#ARG REACT_APP_GRAPHQL_URL
#ENV REACT_APP_GRAPHQL_URL=$REACT_APP_GRAPHQL_URL
#RUN yarn build

CMD ["npm", "run", "serve:build"]