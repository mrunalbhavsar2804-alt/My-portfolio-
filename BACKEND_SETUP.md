# Backend Setup Guide

To enable email notifications, you must configure your Gmail credentials securely.

## 1. Get a Gmail App Password
Since your Google Account is secured, you cannot use your regular password. You need an **App Password**.

1.  Go to your [Google Account Security Settings](https://myaccount.google.com/security).
2.  Enable **2-Step Verification** if it isn't already.
3.  Search for "App Passwords" in the search bar at the top (or go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
4.  Create a new App Password:
    *   **App name**: Portfolio
5.  Copy the 16-character password generated (e.g., `abcd efgh ijkl mnop`).

## 2. Configure Environment Variables
1.  Create a new file named `.env.local` in the root of your project (`c:\Users\hp\Desktop\portfolio\.env.local`).
2.  Add the following lines:

```bash
EMAIL_USER=mrunalbhavsar2804@gmail.com
EMAIL_PASS=your_16_char_app_password_here
```
*(Replace `your_16_char_app_password_here` with the code you copied from Google)*

## 3. Restart the Server
After creating the `.env.local` file, stop the running server (Ctrl+C) and start it again:
```bash
npm run dev
```

## How It Works
*   The **server code** lives in `app/api/contact/route.ts` and `app/api/notify/route.ts`.
*   The **frontend** sends data to these secure endpoints.
*   Next.js automatically loads the credentials from `.env.local` so they are never exposed to the public.
