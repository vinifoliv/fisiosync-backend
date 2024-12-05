FROM node:22.11.0

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

# Setting up Prisma
RUN npx prisma generate

RUN npx prisma migrate

# Building
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]