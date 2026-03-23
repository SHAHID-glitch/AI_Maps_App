FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend source
COPY backend/ ./backend/

# Replace backend static files with freshly built frontend assets
RUN rm -rf ./backend/public/*
COPY --from=frontend-builder /app/frontend/dist/ ./backend/public/

ENV NODE_ENV=production
ENV PORT=7860

EXPOSE 7860

CMD ["node", "backend/server.js"]