# Setup — one time, about 10 minutes

## 1. Google Sheet backend
1. Go to https://sheets.new and create a blank sheet. Name it "Forever Roster".
2. Menu: **Extensions → Apps Script**.
3. Delete the placeholder code, paste the whole contents of `backend/Code.gs`, then **Save** (disk icon).
4. Click **Deploy → New deployment**.
   - Click the gear next to "Select type" and choose **Web app**.
   - Description: anything. **Execute as: Me**. **Who has access: Anyone**.
   - Click **Deploy**. Google will ask you to authorize the script for your account; approve it
     (click "Advanced → Go to ... (unsafe)" if it warns — it's your own script).
5. Copy the **Web app URL** (it ends in `/exec`).

## 2. Connect the page
1. Open `index.html` and find the line near the top of the script:
   `const API_URL = "";`
2. Paste the URL between the quotes and save.
3. Commit and push (or ask Claude to do it). GitHub Pages redeploys in about a minute.

## Updating the script later
If `Code.gs` changes, paste the new version into Apps Script, then
**Deploy → Manage deployments → pencil icon → Version: New version → Deploy**.
The URL stays the same.

## How it works
- The page polls the sheet every 12 seconds and after every action, so everyone sees changes within a few seconds.
- Anyone with the link can sign up, RSVP, add events, and pick dungeons. No accounts.
- All data lives in three tabs of your Google Sheet (roster, events, plan). You can edit rows there directly.
