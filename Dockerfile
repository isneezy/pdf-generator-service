FROM node:lts-alpine3.12 AS base

# Installs latest Chromium package.
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/v3.11/main" >> /etc/apk/repositories \
    && apk upgrade -U -a \
    && apk add --no-cache \
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

FROM base AS BUILDER

COPY --chown=chrome:chrome package.json .
COPY --chown=chrome:chrome yarn.lock .

RUN yarn install --check-files --frozen-lockfile --non-interactive && yarn cache dir
COPY . .

# Test and build
RUN yarn test && yarn build

FROM base
COPY --from=BUILDER --chown=chrome:chrome  /app/dist ./dist
COPY --chown=chrome:chrome package.json .
COPY --chown=chrome:chrome yarn.lock .

RUN yarn install --production && yarn cache clean

EXPOSE 3000
CMD ["node", "dist/src/index.js"]
