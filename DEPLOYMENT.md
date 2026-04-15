# 🚀 Deploying Bill Splitter to Vercel

## Prerequisites
1. Vercel account (sign up at https://vercel.com)
2. MongoDB Atlas account (free tier) at https://www.mongodb.com/cloud/atlas

## Step 1: Set Up MongoDB Atlas (Free Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (choose FREE tier)
4. Click "Connect" on your cluster
5. Create a database user (username & password)
6. Choose "Connect your application"
7. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/billsplitter?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual password
9. Replace `myFirstDatabase` with `billsplitter`

## Step 2: Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variable when prompted:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string

5. Deploy to production:
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard (Easier)

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository: `spandanamn2007-glitch/BILL-SPLITTER`
4. Configure project:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
5. Add Environment Variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string (from Step 1)
6. Click "Deploy"

## Step 3: Access Your Live App

After deployment, Vercel will give you a URL like:
```
https://bill-splitter-xxxxx.vercel.app
```

## 🎯 For Your Presentation

**Advantages of this deployment:**
- ✅ Live URL accessible from anywhere
- ✅ No need to run local server
- ✅ Cloud database (MongoDB Atlas)
- ✅ Professional deployment
- ✅ Automatic HTTPS
- ✅ Fast global CDN

## Troubleshooting

If you get errors:
1. Check MongoDB connection string is correct
2. Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
3. Check Vercel logs: `vercel logs`

## Environment Variables Needed

```
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/billsplitter
PORT=3000
```

Note: PORT is automatically set by Vercel, but we keep it for local development.
