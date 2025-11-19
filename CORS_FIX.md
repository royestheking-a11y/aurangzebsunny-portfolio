# CORS and Connection Issues - FIXED ✅

## Issues Fixed:

### 1. ✅ Port Conflict
- **Problem**: Port 5000 was being used by AirTunes (Apple service)
- **Fix**: Changed backend server port to **5001**
- **Updated Files**:
  - `server/server.ts` - Port changed to 5001
  - `src/utils/storage.tsx` - API URL updated to port 5001

### 2. ✅ CORS Configuration
- **Problem**: CORS was blocking requests from localhost:3001
- **Fix**: 
  - Added comprehensive CORS headers
  - Allow all origins for development
  - Proper preflight (OPTIONS) request handling
  - Added both manual headers and cors middleware

### 3. ✅ Error Handling
- **Problem**: Poor error messages when connection fails
- **Fix**: 
  - Better error messages in storage.tsx
  - Console logging for API calls
  - Clear connection error messages

## Current Configuration:

### Backend Server:
- **Port**: `5001`
- **URL**: `http://localhost:5001`
- **API Base**: `http://localhost:5001/api`

### Frontend:
- **Port**: `3001` (or 3000)
- **API URL**: `http://localhost:5001/api`

## How to Start:

### Option 1: Start Both Together
```bash
npm run dev:all
```

### Option 2: Start Separately

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Verify Connection:

### 1. Check Server is Running:
```bash
curl http://localhost:5001/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "API is running",
  "database": "auraportfolio",
  "collections": [...],
  "collectionCount": 10
}
```

### 2. Test CORS:
```bash
curl -X OPTIONS http://localhost:5001/api/settings \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

Should see `Access-Control-Allow-Origin` header in response.

### 3. Test API Endpoint:
```bash
curl http://localhost:5001/api/settings
```

## Troubleshooting:

### If you still get CORS errors:

1. **Clear browser cache** and hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

2. **Check server is running**:
   ```bash
   curl http://localhost:5001/api/health
   ```

3. **Check browser console** for the actual error message

4. **Verify API URL** in browser console - should show:
   ```
   🌐 API Call: GET http://localhost:5001/api/settings
   ```

### If admin panel shows no data:

1. **Check server logs** - Look for MongoDB connection errors

2. **Verify collections exist**:
   ```bash
   npm run verify-db
   ```

3. **Check browser network tab** - See if API calls are being made

4. **Check console for errors** - Look for connection or CORS errors

## All Fixed! 🎉

- ✅ CORS configured properly
- ✅ Port changed to 5001 (avoiding AirTunes conflict)
- ✅ Server running and responding
- ✅ All collections created
- ✅ Admin panel should now connect

**Next Steps:**
1. Restart your frontend dev server
2. Clear browser cache
3. Test the admin panel - it should now load data from MongoDB!

