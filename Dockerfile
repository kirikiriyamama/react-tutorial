FROM node:12-slim

WORKDIR /opt/react-tutorial

COPY package.json yarn.lock ./
RUN yarn install

CMD ["yarn", "start"]
