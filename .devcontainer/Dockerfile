FROM node:20-alpine

RUN apk add --no-cache bash curl git

WORKDIR /workspace/app

RUN git config --global --add safe.directory /workspace/app

COPY ../package*.json ../app

RUN cd .. && cd app && npm install

COPY ../ .


# CMD ["npm", "run", "dev"]
