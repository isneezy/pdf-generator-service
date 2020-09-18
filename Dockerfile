FROM node:lts-alpine3.12

# Installs Chromium package.
RUN apk add --no-cache \
    libstdc++ \
    chromium \
    harfbuzz \
    nss \
    freetype \
    ttf-freefont \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

# Add Chrome as a user
RUN mkdir -p /app \
    && adduser -D chrome \
    && chown -R chrome:chrome /app

# Run Chrome as non-privileged
USER chrome
WORKDIR /app

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/ \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_ARGS='--no-sandbox --disable-setuid-sandbox' \
    PUPPETEER_PREVENT_INTERNAL_CHROMIUM='yes' \
    PUPPETEER_SKIP_DOWNLOAD='yes'

COPY package.json .
COPY yarn.lock .

RUN yarn install --check-files --frozen-lockfile --non-interactive && yarn cache clean

RUN chown chrome:chrome /app
COPY . .

# Test and build
RUN yarn test && yarn build

EXPOSE 3000
CMD ["node", "dist/src/index.js"]
