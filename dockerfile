FROM node

COPY . /var/www
WORKDIR /var/www

VOLUME [ "/var/www" ]

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]