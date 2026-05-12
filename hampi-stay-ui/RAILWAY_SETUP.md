# 🚀 HampiStays Railway Deployment Guide

This guide contains the final steps to launch HampiStays in production.

## 1. Environment Variables
Log in to your [Railway Dashboard](https://railway.app) and set the following variables in your project settings:

| Variable | Description | Example/Note |
| :--- | :--- | :--- |
| `DATABASE_URL` | Your PostgreSQL connection string | Get this from your Railway Postgres service |
| `JWT_SECRET` | Secure key for authentication | Generate a long random string |
| `VITE_API_URL` | The URL of your Railway app | `https://your-app-name.up.railway.app` |
| `FRONTEND_URL` | The URL of your Railway app | `https://your-app-name.up.railway.app` |
| `VITE_RAZORPAY_KEY_ID` | Your Razorpay Public Key | Get from Razorpay Dashboard |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Private Key | Get from Razorpay Dashboard |
| `NODE_ENV` | Environment mode | Set to `production` |
| `CLOUDINARY_URL` | Cloudinary config (if used) | `cloudinary://key:secret@name` |

## 2. Railway Configuration
Railway will automatically detect your `package.json`. It will:
1. Run `npm install`
2. Run `npm run postinstall` (This generates your Prisma client)
3. Run `npm run build` (This builds your React frontend into the `dist/` folder)
4. Run `npm start` (This migrates your database and starts the production server)

## 3. Important Notes
- **Static Assets**: The server is configured to serve the frontend from the `dist/` directory. Ensure `npm run build` finishes successfully before the server starts.
- **Port**: Railway provides a `PORT` variable automatically. Do NOT hardcode port 5000 in production.
- **Database**: If you are using a new Railway Postgres database, the `npx prisma migrate deploy` command in the `start` script will automatically create all your tables on the first run.

## 4. Verification Checklist
- [ ] Authentication works (Token issue resolved)
- [ ] Property submission works (Auto-save enabled)
- [ ] Expert Network page shows real data
- [ ] Razorpay checkout opens correctly
