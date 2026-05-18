# INFORMED Platform - Visual Reference Card
## Quick Styling & Component Guide

---

## 🎨 COLOR TOKENS

```css
/* Primary Accent */
--accent: 25 95% 50%;           /* Orange #FF7F40 */
--accent-foreground: 0 0% 100%; /* White */

/* Backgrounds */
--background: 0 0% 98%;      /* Off-white #F8F8F8 */
--foreground: 0 0% 12%;      /* Near-black #1F1F1F */

/* Card & Component */
--card: 0 0% 100%;           /* Pure white */
--card-foreground: 0 0% 12%; /* Near-black */

/* Borders & Inputs */
--border: 0 0% 90%;          /* Light gray #E6E6E6 */
--input: 0 0% 95%;           /* Lighter gray */

/* Special Effects */
--ring: 25 95% 50%;          /* Focus ring accent */
--muted: 0 0% 65%;           /* Muted text */
--muted-foreground: 0 0% 45%; /* Muted text dark */
```

---

## 🔤 TYPOGRAPHY

### Display Font (Headings)
```css
font-family: 'Syne', sans-serif;
font-weight: 700;  /* Bold by default */
```

**Usage:**
- `h1`: 5xl-7xl, tracked-tight
- `h2`: 4xl-5xl, tracked-tight
- `h3`: 2xl-3xl, tracked-tight
- Buttons: uppercase, tracking-wider

### Body Font (Content)
```css
font-family: 'Merriweather', serif;
font-weight: 400;  /* Regular for body */
font-weight: 700;  /* Bold for emphasis */
```

**Usage:**
- Paragraphs: base, leading-relaxed
- Small text: sm, opacity-70
- Extra small: xs, opacity-60

---

## 🧩 COMPONENT STYLES

### Buttons - Premium Style
```html
<!-- Primary Button -->
<button class="bg-gradient-to-r from-accent to-accent/80 
                text-foreground rounded-xl px-6 py-3
                hover:shadow-lg shadow-accent/20
                hover:scale-105 active:scale-95
                transition-all duration-300">
  Click Me
</button>

<!-- Secondary Button -->
<button class="bg-card border border-border text-foreground
                rounded-xl px-6 py-3
                hover:border-accent hover:bg-accent/10
                transition-all duration-300">
  Secondary
</button>

<!-- Ghost Button -->
<button class="text-accent hover:text-accent/80
                transition-colors duration-300
                hover:underline">
  Link Button
</button>
```

### Cards - Premium Layout
```html
<div class="bg-card border border-border rounded-2xl
            p-6 shadow-lg hover:shadow-2xl
            transition-all duration-300">
  <h3 class="font-display text-2xl mb-4">Card Title</h3>
  <p class="text-foreground/70">Card content here</p>
</div>
```

### Inputs - Modern Style
```html
<input type="text" 
       class="w-full bg-background border border-border
              text-foreground px-4 py-3
              rounded-xl placeholder:text-foreground/40
              focus:outline-none focus:ring-2
              focus:ring-accent focus:border-accent/50
              transition-all duration-200" />
```

---

## 🎬 ANIMATION UTILITIES

### Fade In
```html
<div class="animate-in fade-in duration-500">
  Content fades in
</div>
```

### Slide In
```html
<div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
  Slides up while fading in
</div>

<div class="animate-in fade-in slide-in-from-bottom-8 duration-700">
  Larger slide from bottom
</div>
```

### Staggered Animation
```html
{items.map((item, idx) => (
  <div key={idx} 
       style={{ animationDelay: `${idx * 60}ms` }}
       class="animate-in fade-in slide-in-from-bottom-4">
    {item}
  </div>
))}
```

### Hover Effects
```html
<!-- Scale on Hover -->
<div class="hover:scale-105 transition-transform duration-300">
  Scales up on hover
</div>

<!-- Shadow on Hover -->
<div class="shadow-lg hover:shadow-2xl transition-all duration-300">
  Shadow increases on hover
</div>

<!-- Color Transition -->
<div class="text-foreground hover:text-accent transition-colors">
  Color changes on hover
</div>
```

---

## 📐 SPACING & SIZING

### Padding Classes
```css
p-3  → 0.75rem (12px)
p-4  → 1rem (16px)
p-5  → 1.25rem (20px)
p-6  → 1.5rem (24px)
px-4 → Horizontal only
py-3 → Vertical only
```

### Gap Classes
```css
gap-4  → 1rem spacing
gap-5  → 1.25rem spacing
gap-6  → 1.5rem spacing
gap-8  → 2rem spacing
gap-x-2 → Horizontal gap
gap-y-4 → Vertical gap
```

### Width Classes
```css
w-full    → 100%
w-96      → 24rem (384px)
max-w-2xl → 42rem (672px)
max-w-7xl → 80rem (1280px)
```

### Height Classes
```css
h-screen → 100vh
h-96     → 24rem (384px)
h-80     → 20rem (320px)
aspect-square → 1:1 ratio
```

---

## 🔲 BORDER & RADIUS

### Border Radius
```css
rounded-lg  → 0.5rem (8px)
rounded-xl  → 0.75rem (12px)
rounded-2xl → 1rem (16px)
rounded-3xl → 1.5rem (24px)
rounded-full → 9999px
```

### Borders
```css
border          → 1px solid
border-2        → 2px solid
border-border   → Uses accent color on focus
border-accent   → Primary accent color
border-b        → Bottom border only
border-t        → Top border only
border-l        → Left border only
border-r        → Right border only
```

---

## 💡 SHADOWS & EFFECTS

### Shadow Levels
```css
shadow-lg      → Standard elevation
shadow-xl      → Higher elevation
shadow-2xl     → Maximum elevation
shadow-accent/20 → Colored shadow (20% opacity)
shadow-accent/50 → Colored shadow (50% opacity)
```

### Backdrop Effects
```css
backdrop-blur-sm  → Slight blur
backdrop-blur     → Normal blur
backdrop-blur-md  → Strong blur
backdrop-blur-lg  → Very strong blur
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoint Prefixes
```css
/* Default (mobile) */
.px-4              /* 16px padding on all screens */

/* Tablet and up (640px) */
.sm:px-6           /* 24px padding at tablet size */

/* Tablet and up (768px) */
.md:px-6           /* 24px padding at larger tablet */
.md:text-2xl       /* Larger text on tablet */
.md:col-span-2     /* Spans 2 columns on tablet */

/* Desktop and up (1024px) */
.lg:text-4xl       /* Large text on desktop */
.lg:col-span-3     /* Spans 3 columns on desktop */
.lg:max-w-5xl      /* Max width on desktop */

/* Large desktop (1280px) */
.xl:px-8           /* Extra padding on large screens */
```

### Common Responsive Patterns
```html
<!-- 1 column mobile, 2 columns tablet, 4 desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {items}
</div>

<!-- Hide on mobile, show on desktop -->
<div class="hidden lg:block">
  Desktop only content
</div>

<!-- Different text sizes -->
<h1 class="text-3xl md:text-5xl lg:text-7xl">
  Responsive heading
</h1>
```

---

## ✨ UTILITY COMBINATIONS

### Floating Button Style
```html
<button class="fixed bottom-6 right-6 z-40
               bg-gradient-to-r from-accent to-accent/80
               text-foreground rounded-full p-4
               shadow-2xl hover:shadow-3xl
               transition-all duration-500
               hover:scale-110 active:scale-95">
  💬
</button>
```

### Card Hover Effect
```html
<div class="bg-card border border-border rounded-2xl p-6
            shadow-lg hover:shadow-2xl
            hover:-translate-y-2
            transition-all duration-300">
  Content
</div>
```

### Premium Input
```html
<input class="w-full bg-background border border-border
              text-foreground px-4 py-3
              rounded-xl placeholder:text-foreground/40
              focus:outline-none focus:ring-2
              focus:ring-accent focus:border-accent/50
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200" />
```

### Gradient Text
```html
<h1 class="text-foreground">
  Breaking <span class="text-accent">Stories</span>
</h1>
```

### Staggered Grid
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-max">
  {items.map((item, idx) => (
    <div key={idx}
         className={idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}
         style={{ animation: `reveal-content 0.6s ease-out ${idx * 60}ms forwards` }}>
      {item}
    </div>
  ))}
</div>
```

---

## 🎯 QUICK REFERENCE CHECKLIST

### Using New Design System
- [ ] All buttons use gradient (from-accent to-accent/80)
- [ ] All text uses font-display or body font
- [ ] All cards use rounded-2xl minimum
- [ ] All interactive elements have hover states
- [ ] All animations use smooth transitions
- [ ] All colors from design tokens
- [ ] All spacing uses Tailwind scale
- [ ] Mobile-first responsive approach
- [ ] Images have alt text or fallbacks
- [ ] Links have focus states

### Before Deployment
- [ ] Test on mobile (375px, 390px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1280px+)
- [ ] Check animation smoothness
- [ ] Verify all colors render correctly
- [ ] Check shadow depths
- [ ] Verify button interactions
- [ ] Test keyboard navigation
- [ ] Check loading states
- [ ] Test error states

---

## 🎨 DESIGN SYSTEM COLORS

```
Primary Accent:      #FF7F40 (25° 95% 50%)
Background:          #F8F8F8 (0° 0% 98%)
Foreground:          #1F1F1F (0° 0% 12%)
Card:                #FFFFFF (0° 0% 100%)
Border Light:        #E6E6E6 (0° 0% 90%)
Border Dark:         #333333 (0° 0% 20%)
Success:             Green tones
Warning:             Yellow tones
Destructive:         Red tones
```

---

This visual reference card provides quick access to all styling patterns and components used throughout the INFORMED platform.
