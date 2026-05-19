# Google Subscribe with Google News Integration

## Overview
Google Subscribe with Google News (SWG) is now integrated into INFORMED, enabling users to subscribe to premium content directly through Google News.

## What's Installed

### 1. Global SWG Scripts (app/layout.tsx)
- **SWG Basic Library**: `https://news.google.com/swg/js/v1/swg-basic.js`
- **Configuration**: NewsArticle type with openaccess product ID
- **Theme**: Light theme with English language support

### 2. Reusable Component (components/subscription-button.tsx)
A flexible SubscriptionButton component for adding subscription CTAs anywhere on your site.

## How to Use

### Option 1: Add Subscription Button to Your Page

```tsx
import { SubscriptionButton } from '@/components/subscription-button';

export default function YourPage() {
  return (
    <div>
      <h1>Premium Content</h1>
      <SubscriptionButton 
        variant="primary" 
        text="Get Premium Access"
      />
    </div>
  );
}
```

### Option 2: Customize Button Appearance

```tsx
<SubscriptionButton
  variant="primary"      // 'primary' | 'secondary' | 'outline'
  size="lg"              // 'sm' | 'md' | 'lg'
  text="Subscribe Now"
  className="custom-class"
/>
```

### Option 3: Manual JavaScript Integration

For custom implementations, use the SWG API directly:

```tsx
'use client';

import { useEffect } from 'react';

export function CustomSubscribe() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).SWG_BASIC) {
      (window as any).SWG_BASIC.forEach((basicSubscriptions: any) => {
        basicSubscriptions.showSubscriptionOption?.();
      });
    }
  }, []);

  return <button onClick={() => /* trigger subscribe */}>Subscribe</button>;
}
```

## Configuration Details

- **Product ID**: `CAowo8_GDA:openaccess`
- **Article Type**: NewsArticle
- **Product Type**: Product
- **Language**: English
- **Theme**: Light

## Key Features

- ✅ One-click subscription via Google News
- ✅ Secure payment processing through Google
- ✅ Cross-platform synchronization
- ✅ Theme-aware styling
- ✅ Fully responsive design
- ✅ Client-side safe rendering

## Where to Add Subscription CTAs

1. **Homepage**: Add to app-promotion-section.tsx
2. **Article Pages**: Add below article content
3. **Premium Content**: Gate specific articles with subscription prompt
4. **Header/Footer**: Add secondary subscription buttons
5. **Sidebar**: Small subscription widget

## Best Practices

1. **Placement**: Put CTAs near premium content
2. **Frequency**: Don't overload users with multiple CTAs
3. **Messaging**: Use clear, benefit-focused copy
4. **Mobile**: Ensure buttons are touch-friendly
5. **Analytics**: Track subscription button clicks in GTM

## Testing

To test the subscription flow locally:
1. Build and run: `npm run build && npm run start`
2. Click a subscription button
3. You'll be redirected to Google's subscription flow
4. Complete test transaction (use Google's test cards)

## Next Steps

- Add subscription buttons to premium articles
- Gate premium content behind subscription
- Track subscription metrics in Google Analytics
- Monitor subscription revenue in Google Play Console

---

**Questions?** Check the SWG documentation: https://newsinitiative.withgoogle.com/swg
