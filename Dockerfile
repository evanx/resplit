FROM node:7.5.0
ADD package.json .
RUN npm install
ADD components components
ADD lib lib
CMD ["node", "--harmony", "lib/index.js"]
