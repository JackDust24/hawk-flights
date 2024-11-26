# Base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app files
COPY . .

# Build the Next.js app
RUN npm run build

# Serve the app
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

