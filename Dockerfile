FROM alpine:3

RUN apk add --update nodejs npm

WORKDIR /root

COPY ./ ./

RUN npm install