FROM node:12-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "tsconfig.build.json","tsconfig.json", "/home/node/"]
COPY ./src/ /home/node/src


RUN npm ci \
    && npm run build

# ---

FROM node:12-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/dist/ /home/node/dist/

RUN npm ci

CMD ["node", "dist/main.js"]