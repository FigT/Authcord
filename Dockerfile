FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm run compile

RUN chmod +x /app/scripts/entrypoint.sh

ENTRYPOINT ["/app/scripts/entrypoint.sh"]

LABEL org.opencontainers.image.source=https://github.com/FigT/Authcord
LABEL org.opencontainers.image.description="A simple discord bot for providing TOTP and HOTP authentication."
LABEL org.opencontainers.image.licenses=MIT
