FROM node:lts-stretch-slim

WORKDIR /app
ENV APP_USERNAME=appuser
ENV PUPPETEER_ARGS='--no-sandbox --disable-setuid-sandbox'
ENV PUPPETTER_CHROME_DEVEL_SANDBOX=./node_modules/puppeteer/.local-chromium/linux-800071/chrome-linux/chrome_sandbox
ENV CHROME_DEVEL_SANDBOX=/usr/local/sbin/chrome-devel-sandbox

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
     #fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg \ fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY package.json .
COPY yarn.lock .

RUN yarn install \
    && groupadd -r ${APP_USERNAME} && useradd -r -g ${APP_USERNAME} -G audio,video ${APP_USERNAME} \
    && mkdir -p /home/${APP_USERNAME}/Downloads \
    && chown -R ${APP_USERNAME}:${APP_USERNAME} /home/${APP_USERNAME} \
    && chown -R ${APP_USERNAME}:${APP_USERNAME} /app

COPY . .

# Run everything after as non-privileged user.
USER ${APP_USERNAME}

# Test and build
RUN && yarn test && yarn build \
    # remove dev dependencies
    && yarn install --production --ignore-scripts --prefer-offline --check-files --frozen-lockfile --non-interactive

CMD yarn start


