# Deploy on Vercel

## Fix "auth/invalid-api-key" build error

The app is built so the **build succeeds** even when Firebase env vars are missing. To have **auth and Firestore work** in production:

1. In Vercel: open your project → **Settings** → **Environment Variables**.
2. Add these (use Production, Preview, Development as needed):

- `NEXT_PUBLIC_FIREBASE_API_KEY` = `AIzaSyAKR2zotdJWkjbTFfKZnP_N1PEd6QXe45g`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `trackme-f6f73.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `trackme-f6f73`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = `trackme-f6f73.firebasestorage.app`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = `585029408692`
- `NEXT_PUBLIC_FIREBASE_APP_ID` = `1:585029408692:web:52cb37af77ef4ab43b04e1`

3. **Redeploy** so the build uses these values.

## Navbar logo

Put your runner logo image at **`public/logo.png`** so the navbar shows it (32×32, will be scaled).

## Authorized domains

In Firebase Console → Authentication → Settings → **Authorized domains**, add:

- `localhost`
- Your Vercel URL (e.g. `trackme-taqt.vercel.app`)
