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

FROM base AS builder

COPY --chown=chrome:chrome package.json .
COPY --chown=chrome:chrome packages/service/package.json ./packages/service/package.json
COPY --chown=chrome:chrome packages/library/package.json ./packages/library/package.json

COPY --chown=chrome:chrome yarn.lock .
COPY --chown=chrome:chrome packages/service/package.json ./packages/service/yarn.lock
COPY --chown=chrome:chrome packages/library/package.json ./packages/library/yarn.lock

RUN yarn install --check-files --frozen-lockfile --non-interactive && yarn cache dir

COPY --chown=chrome:chrome . .

# Test and build
RUN CI=true yarn test && yarn build

FROM base
COPY --chown=chrome:chrome package.json .
COPY --chown=chrome:chrome packages/service/package.json ./packages/service/package.json
COPY --chown=chrome:chrome packages/library/package.json ./packages/library/package.json

COPY --chown=chrome:chrome yarn.lock .
COPY --chown=chrome:chrome packages/service/package.json ./packages/service/yarn.lock
COPY --chown=chrome:chrome packages/library/package.json ./packages/library/yarn.lock

RUN yarn install --production && yarn cache clean && chown -R chrome:chrome ./

COPY --from=builder --chown=chrome:chrome  /app/packages/library/dist ./packages/library/dist
COPY --from=builder --chown=chrome:chrome  /app/packages/service/dist ./packages/service/dist

EXPOSE 3000
CMD ["node", "packages/service/dist/src/pdf-generator-service.js"]