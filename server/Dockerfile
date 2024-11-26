# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

# Copy the rest of the app files
COPY . .

# Expose the server port
EXPOSE 4000

# Start the server
# CMD ["npm", "run", "dev"]
CMD ["nodemon", "-L", "server.js"]

# CMD ["node", "server.js"]