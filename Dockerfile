FROM node:lts-stretch-slim
WORKDIR /app

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn test
RUN yarn build

# remove dev dependencies
RUN yarn install --production --ignore-scripts --prefer-offline


