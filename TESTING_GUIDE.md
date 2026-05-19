# Testing Guide for Link and Category Fixes

## Test 1: Masonry Cards - External Links

### Steps:
1. Go to homepage
2. Wait for articles to load (breaking stories section)
3. Click on any featured card (large card at top left)
4. **Expected**: Opens article in new tab from news source (BBC, Reuters, etc.)

### Pass/Fail:
- ✅ PASS: Opens external news article
- ❌ FAIL: Closes tab or stays on same page

---

## Test 2: Timeline Section - Category Filtering

### Steps:
1. Scroll to "Timeline of Stories" section
2. Click on category buttons (Technology, Business, Sports, etc.)
3. Observe articles below change
4. Click "ALL" to reset

### Expected Behavior:
- Articles filter to show only selected category
- Shows max 8 articles per category
- Category button highlights when active
- Smooth transition between categories

### Pass/Fail:
- ✅ PASS: Filters work and articles update
- ❌ FAIL: Articles don't change or all categories show same content

---

## Test 3: Timeline Links - Article Redirect

### Steps:
1. In "Timeline of Stories" section
2. Click on any article title/row
3. **Expected**: Briefly shows loading screen, then opens external article

### Pass/Fail:
- ✅ PASS: Opens external news article in new tab
- ❌ FAIL: Goes to 404 or home page

---

## Test 4: News Cards - Direct Links

### Steps:
1. Navigate to `/trending` or `/explore` page
2. Click "Read Article" button on any card
3. **Expected**: Opens external news article

### Pass/Fail:
- ✅ PASS: Opens external news article in new tab
- ❌ FAIL: Navigation error or internal redirect

---

## Test 5: Dark Mode - Categories Visibility

### Steps:
1. Toggle dark mode (moon/sun icon in header)
2. Check category buttons in Timeline section
3. Verify text is readable in both modes

### Pass/Fail:
- ✅ PASS: Categories visible and readable in both light/dark
- ❌ FAIL: Text invisible or colors clash

---

## Test 6: Article Loading Persistence

### Steps:
1. Load homepage (articles load)
2. Click on timeline article
3. Browser back button
4. Check if articles still load properly

### Pass/Fail:
- ✅ PASS: Articles reload quickly (from sessionStorage)
- ❌ FAIL: Articles disappear or require full reload

---

## Test 7: Mobile Responsiveness

### Steps:
1. Open on mobile device (or DevTools mobile view)
2. Click article cards in masonry grid
3. Click timeline articles
4. Click category filters

### Pass/Fail:
- ✅ PASS: All links work, categories filter properly
- ❌ FAIL: Links unresponsive or categories don't filter

---

## Test 8: Image Loading

### Steps:
1. Homepage loads
2. Wait for featured image on masonry card to load
3. Check if loading spinner appears and disappears
4. Verify fallback icon appears if image fails

### Pass/Fail:
- ✅ PASS: Images load smoothly with spinner, no broken images
- ❌ FAIL: Images missing or broken, spinner stuck

---

## Automated Testing (Browser Console)

Run these commands in browser console to verify fixes:

### Test Links Are Valid
```javascript
// Get all article links on page
const links = Array.from(document.querySelectorAll('a[href*="http"]'))
  .map(a => a.href)
  .filter(href => href.includes('http'));

// Check if all are valid URLs
links.forEach(link => {
  try {
    new URL(link);
    console.log('✅ Valid:', link);
  } catch {
    console.error('❌ Invalid:', link);
  }
});
```

### Test SessionStorage
```javascript
// Check if articles are stored
const articles = JSON.parse(sessionStorage.getItem('current-articles') || '[]');
console.log(`✅ ${articles.length} articles in session storage`);
```

### Test Categories Exist
```javascript
// Get unique categories
const articles = JSON.parse(sessionStorage.getItem('current-articles') || '[]');
const categories = [...new Set(articles.map(a => a.category || a.source))];
console.log('✅ Categories:', categories);
```

---

## Common Issues and Solutions

### Issue: Links Not Opening
**Possible Causes:**
- Ad blocker blocking external links
- Browser popup blocker enabled
- JavaScript disabled

**Solution:**
- Check browser console for errors
- Disable popup blocker
- Enable JavaScript

### Issue: Categories Not Filtering
**Possible Causes:**
- Articles don't have category property
- Category names don't match
- JavaScript error in filter logic

**Solution:**
- Check browser console for JS errors
- Verify articles have category property in sessionStorage
- Reload page and try again

### Issue: Images Not Loading
**Possible Causes:**
- Invalid image URLs from RSS feeds
- CORS blocking
- Network issues

**Solution:**
- Check Network tab in DevTools
- Look for 404 or CORS errors
- Verify RSS feed provides valid image URLs

---

## Performance Benchmarks

Target metrics:
- Link click to redirect: < 500ms
- Category filter update: < 300ms
- Image load + display: < 2s
- SessionStorage access: < 50ms

---

## Sign-Off

All tests should pass before considering the fix complete.
