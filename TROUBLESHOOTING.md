# Just in news - Troubleshooting Guide

## Common Issues & Solutions

### Issue: No articles loading on homepage
**Symptoms:** Blank page, loading spinner keeps spinning or "No articles found" message  
**Severity:** CRITICAL

#### Solution Path:
1. **Check browser console** for errors
2. **Look for `[v0]` debug logs** showing which fetch strategy failed
3. **Check network tab** in DevTools
   - Do you see `/api/rss-proxy` calls?
   - What status codes are returned?

#### Fixes by Root Cause:

**Cause: Network connectivity**
- Check internet connection
- Verify RSS feed sources are accessible (try in new tab)
- Solution: Wait 30 seconds and refresh

**Cause: RSS feed server down**
- Try accessing feed directly in browser: `https://feeds.feedburner.com/TechCrunch/`
- If inaccessible, feed server is down
- Solution: Wait for feed to come back online

**Cause: Server-side proxy not working**
- Check API response: Press F12 → Network → look for 503 errors
- Read the error message in response
- Solution: Restart dev server (`pnpm dev`)

**Cause: All proxy methods failing**
- Check if you have internet connection
- Try in incognito mode (clears cache)
- Solution: Clear browser cache and try again

---

### Issue: Images not loading in article cards
**Symptoms:** Cards show text but no images, or image placeholder shows  
**Severity:** MEDIUM

#### Solution Path:
1. **Check if image URL is valid**
   - Inspect article in DevTools
   - Look for `article.image` property
2. **Check browser console** for image-related errors

#### Fixes by Root Cause:

**Cause: Image domain not configured**
- Error: "hostname not configured under images"
- Solution: Already fixed in `next.config.mjs`
- If still seeing this: Restart Next.js dev server

**Cause: Image server returns 403/404**
- Image URL might be time-limited
- Some RSS feeds use broken image links
- Solution: Automatic - card gracefully hides missing image

**Cause: CORS error on image**
- Solution: Already handled with `crossOrigin="anonymous"`
- If still failing: Check browser console for specific error

---

### Issue: Search/filter not working
**Symptoms:** Searching returns no results, or all articles show regardless of filter  
**Severity:** LOW

#### Solution Path:
1. **Verify articles are loaded** first
   - Check if featured articles show at top
   - If not, fix feed loading first
2. **Test search box**
   - Type a common word like "tech"
   - Should see results

#### Fixes by Root Cause:

**Cause: No articles loaded**
- Search can't work on empty data
- Solution: Fix feed loading first (see above)

**Cause: Search query too specific**
- Example: Searching "iPhone 16 Pro Max" when articles say "iPhone 16 Pro"
- Solution: Use broader search terms

**Cause: Category filter too restrictive**
- Combined search + category = no results
- Solution: Clear category filter (set to "All")

---

### Issue: Admin dashboard feed management not working
**Symptoms:** Can't add new feeds, save button doesn't work  
**Severity:** MEDIUM

#### Solution Path:
1. **Verify you're at `/admin` route**
2. **Check browser console** for JavaScript errors
3. **Check LocalStorage** manually:
   - Press F12 → Application → LocalStorage
   - Look for key: `rss-feeds`

#### Fixes by Root Cause:

**Cause: LocalStorage disabled**
- Solution: Enable LocalStorage in browser settings
- Private/Incognito mode: LocalStorage is disabled

**Cause: Feed URL is invalid**
- Error: "Unauthorized feed URL"
- Solution: Must add URL to `DEFAULT_FEEDS` in `lib/rss-parser.ts`

**Cause: Form not submitting**
- Check for JavaScript console errors
- Solution: Refresh page and try again

---

### Issue: Slow page loading / Articles taking long to appear
**Symptoms:** Homepage loads but articles appear after long delay  
**Severity:** LOW

#### Root Causes:

**Cause 1: RSS feeds are slow to respond**
- Timeouts set to 5-20 seconds per feed
- With 5 feeds: up to 100 seconds worst case
- Solution: Normal behavior - be patient

**Cause 2: Browser is slow**
- Check CPU/Memory usage in Task Manager
- Close other tabs/applications
- Solution: Upgrade hardware or reduce background processes

**Cause 3: Server is overloaded**
- Multiple API requests happening simultaneously
- Solution: Stagger requests by checking error logs

---

### Issue: Some feeds show articles, others don't
**Symptoms:** TechCrunch works but The Verge shows nothing  
**Severity:** MEDIUM

#### Solution Path:
1. **Check console logs** for specific feed failures
   - Look for: `[v0] Successfully parsed X articles from Feed Name`
2. **Manually test feed** in browser
3. **Check feed URL** is correct

#### Fixes by Root Cause:

**Cause: Feed is down for that source only**
- Try accessing feed URL directly in browser
- Solution: Wait for feed server to recover

**Cause: Feed format changed**
- RSS parser expects specific XML structure
- Solution: Report issue, may need parser update

**Cause: Network timeout for specific feed**
- Some servers respond slower than 5-second timeout
- Solution: Timeout already increased to 5-20 seconds

---

### Issue: Featured articles don't change
**Symptoms:** Same 5 articles always show at top  
**Severity:** LOW

#### Root Causes:

**Cause 1: No new articles loaded**
- Featured articles = first 5 articles loaded
- Solution: Wait for articles to load (reload page if stuck)

**Cause 2: Articles cached**
- Browser caching old article list
- Solution: 
  - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
  - Clear cache: DevTools → Application → Cache

**Cause 3: Feed hasn't been updated**
- RSS feeds update periodically (not in real-time)
- Solution: Wait and refresh after 5-10 minutes

---

### Issue: Dark theme not applying
**Symptoms:** Site shows in light theme or colors look wrong  
**Severity:** LOW

#### Solution Path:
1. **Check system theme preference**
   - Settings → Appearance → Dark/Light mode
2. **Check browser cache**
3. **Verify CSS loaded**

#### Fixes by Root Cause:

**Cause: Browser theme setting**
- Browser might override dark theme
- Solution: 
  - Check system settings
  - Clear browser cache
  - Try incognito mode

**Cause: CSS not loaded**
- Next.js development delay
- Solution: Hard refresh (Ctrl+Shift+R)

**Cause: Custom CSS overriding theme**
- Browser extensions might override styles
- Solution: Disable extensions and try again

---

### Issue: "CORS error" in console
**Symptoms:** Browser console shows CORS-related errors  
**Severity:** MEDIUM

#### Root Causes:

**Cause 1: Trying to fetch RSS directly from browser**
- RSS servers block direct browser requests
- Solution: Already handled by API proxy - should work

**Cause 2: Image CORS issue**
- Some image servers don't allow cross-origin
- Solution: Already configured with `crossOrigin="anonymous"`

**Cause 3: Proxy itself failing**
- API proxy having connection issues
- Solution: Check `/api/rss-proxy` response status

---

## Monitoring & Debug Tips

### Enable Detailed Logging
Looking for `[v0]` logs in console:
```javascript
// These logs show exactly what's happening:
[v0] Fetching feed: TechCrunch from https://...
[v0] Attempting server-side proxy for TechCrunch
[v0] Server proxy succeeded for TechCrunch
[v0] Successfully parsed 15 articles from TechCrunch
```

### Check API Health
Open DevTools → Network tab:
1. Filter for "rss-proxy"
2. Check response status
3. Read error messages

### Monitor Feed Status
In admin dashboard `/admin`:
- Shows which feeds are configured
- Can add/remove feeds
- Changes saved to LocalStorage

### Check LocalStorage
Press F12 → Application → LocalStorage:
- Key: `rss-feeds`
- Value: JSON array of feed configuration

---

## Performance Optimization

### If page is slow:
1. **Reduce number of feeds** → Admin page, remove some feeds
2. **Clear cache** → Hard refresh (Ctrl+Shift+R)
3. **Close other tabs** → Reduce browser memory usage
4. **Check internet speed** → Run speed test

### If images slow:
- Images lazy-load by default (good for performance)
- Nothing to optimize on client side
- Server-side caching (future enhancement)

---

## Report an Issue

If troubleshooting steps don't work:

1. **Collect information:**
   - Browser type and version
   - Operating system
   - Screenshot of console errors
   - Current time (to check feed timing)

2. **Check these files:**
   - `IN_DEPTH_AUDIT.md` - Full system analysis
   - `FIXES_SUMMARY.md` - What was fixed
   - Console logs with `[v0]` prefix

3. **Common resolutions:**
   - 80% of issues: Hard refresh page
   - 15% of issues: Restart dev server
   - 5% of issues: Actual bugs

---

## Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| No articles | Refresh page, check feed URLs |
| No images | Hard refresh, check CORS setup |
| Search broken | Load articles first |
| Slow loading | Normal for 5 feeds, be patient |
| Admin broken | Check LocalStorage enabled |
| Wrong theme | Hard refresh, check system settings |
| Feed partially loaded | Wait for all feeds to complete |
| Very slow | Close other tabs, check internet |

---

## Emergency Recovery

### If app completely broken:

1. **Clear all data:**
   ```javascript
   // Open console (F12) and run:
   localStorage.clear()
   location.reload()
   ```

2. **Reset to defaults:**
   - Admin page → Check default feeds enabled
   - Add feeds: TechCrunch, NY Times, The Verge, TOI, Google News

3. **Restart dev server:**
   ```bash
   Ctrl+C  (stop current server)
   pnpm dev  (restart)
   ```

4. **Nuclear option:**
   ```bash
   rm -rf .next node_modules
   pnpm install
   pnpm dev
   ```

---

Last Updated: February 12, 2026
