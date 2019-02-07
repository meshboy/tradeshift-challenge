FROM node:8

# create and set work directory
RUN mkdir -p /src/tradeshift_challenge

WORKDIR /src/tradeshift_challenge

COPY package*.json /src/tradeshift_challenge/
# install all dependencies
RUN npm install

COPY src /src/tradeshift_challenge/src
COPY README.md .env .babelrc /src/tradeshift_challenge/

RUN npm run build

EXPOSE 8080

## mongo is damm slow, lets wait
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm start