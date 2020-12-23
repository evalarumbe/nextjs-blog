# base image
FROM node:fermium

# create & set working dir
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src

# install dependencies
RUN npm install

# build app
RUN npm run build

# set exposed port
# Used 3000 because it's the Next.js default.
# This worked with: $ docker run -p 8080:3000 --name hello -d hello-world
# On host machine, browse to localhost:8080
ENV PORT 3000
EXPOSE $PORT

CMD [ "npm", "run", "start" ]