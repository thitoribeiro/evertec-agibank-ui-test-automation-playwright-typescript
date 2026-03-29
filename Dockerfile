FROM mcr.microsoft.com/playwright:v1.42.0-jammy

WORKDIR /app

COPY package.json ./
RUN npm install
RUN npx playwright install --with-deps

COPY . .

CMD ["npm", "test"]
