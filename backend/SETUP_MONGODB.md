# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (it's free forever for development)

## Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **FREE (M0) Shared Cluster**
3. Select a cloud provider and region (choose closest to you)
4. Click **"Create"** (takes 1-3 minutes)

## Step 3: Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username and password (save these!)
5. Set privileges to **"Atlas Admin"** or **"Read and write to any database"**
6. Click **"Add User"**

## Step 4: Whitelist Your IP

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. For development, click **"Add Current IP Address"**
4. OR click **"Allow Access from Anywhere"** (0.0.0.0/0) - less secure but easier for development
5. Click **"Confirm"**

## Step 5: Get Connection String

1. Go to **Database** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your actual password
6. Add database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/fixpoint?retryWrites=true&w=majority`

## Step 6: Update .env File

Open `backend/.env` and replace:
```
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/fixpoint?retryWrites=true&w=majority
```

**Important:** 
- Replace `your_username` with your database username
- Replace `your_password` with your database password
- Replace `cluster0.xxxxx` with your actual cluster name
- Keep `/fixpoint` at the end (this is your database name)

## Step 7: Generate JWT Secret

For `JWT_SECRET`, use a long random string. You can generate one:
- Online: https://randomkeygen.com/
- Or use: `openssl rand -base64 32` in terminal
- Or just use a long random string like: `my_super_secret_jwt_key_12345678901234567890`

## Example .env File:

```env
PORT=5000
MONGO_URI=mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/fixpoint?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_jwt_key_for_fixpoint_2024_123456789
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
```

## Troubleshooting

**Connection Error?**
- Make sure your IP is whitelisted in Network Access
- Check username and password are correct
- Ensure connection string has `/fixpoint` at the end
- Try removing `?retryWrites=true&w=majority` if it doesn't work

**Still having issues?**
- Check MongoDB Atlas dashboard for any error messages
- Verify your cluster is running (should show green status)

