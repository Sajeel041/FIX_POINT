# FixPoint Backend

Express.js backend API for FixPoint home service marketplace.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

3. Run development server:
```bash
npm run dev
```

4. Run production server:
```bash
npm start
```

## API Routes

- `/api/auth/*` - Authentication routes
- `/api/merchants/*` - Merchant routes
- `/api/bookings/*` - Booking routes
- `/api/services/*` - Service routes

## Deployment

Deploy to Railway or Render:
1. Connect GitHub repository
2. Set environment variables
3. Set start command: `npm start`
4. Ensure MongoDB Atlas allows connections from hosting IP

