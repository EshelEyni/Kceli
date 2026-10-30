FROM node:current-alpine3.19 AS fe-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
COPY shared/ /shared/
RUN npm install -g typescript@5.2.2
WORKDIR /shared
RUN tsc
WORKDIR /app
RUN npm ci
COPY frontend/ .
RUN npm run build 

CMD ["sh"]


FROM node:current-alpine3.19 AS be-build
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
COPY shared/ /shared/
RUN npm install -g typescript@5.2.2
WORKDIR /shared
RUN tsc
WORKDIR /app
RUN npm ci
COPY backend/ .
RUN npm run build 


FROM node:current-alpine3.19 AS prod
WORKDIR /app
COPY --from=be-build /app/build /app/build
COPY --from=be-build /app/node_modules /app/node_modules
COPY --from=be-build shared/ /shared/
COPY backend/package.json .
COPY --from=fe-build /app/dist /app/build/public
EXPOSE 3030
CMD ["npm", "run", "prod-linux"]
