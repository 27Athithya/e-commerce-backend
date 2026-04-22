# E-commerce Backend

NestJS backend API for the e-commerce application.

## Tech Stack
- NestJS 11
- MongoDB (Mongoose)
- TypeScript

## Requirements
- Node.js 20+
- npm
- MongoDB Atlas or local MongoDB instance

## Environment Variables
Create a `.env` file in the backend root:

```dotenv
PORT=3001
CLIENT_ORIGIN=http://localhost:3000,https://your-frontend.vercel.app
MONGODB_DB_NAME=ecommerce
MONGODB_URI=<your-mongodb-connection-string>
```

On Render, set `CLIENT_ORIGIN` to your Vercel domain and keep localhost in the list if you still want local development access.

## Install
```bash
npm install
```

## Run
```bash
# development
npm run start:dev

# production build + run
npm run start
```

## Useful Scripts
```bash
npm run build
npm run lint
npm run test
```

## Project Structure
- `src/modules` - feature modules (auth, products, orders, users)
- `src/database` - database module and schemas
- `src/common` - shared decorators, guards, filters, interceptors

## Repository
GitHub: https://github.com/27Athithya/e-commerce-backend
