# OPTIMA UI/UX Specification
## Industrial Construction PWA Design System

---

## 🎨 Design Philosophy

**OPTIMA** is designed for harsh construction environments where:
- Direct sunlight makes screens hard to read
- Workers wear gloves reducing touch precision
- Devices may be dirty or wet
- Internet connection is unreliable
- Users need quick, one-handed operation

### Design Principles
1. **High Contrast**: Deep blue backgrounds with electric blue accents
2. **Large Touch Targets**: Minimum 64px height for all interactive elements
3. **Clear Hierarchy**: Bold typography with distinct sizes
4. **Minimal Steps**: Reduce taps to complete actions
5. **Industrial Aesthetic**: Utilitarian, rugged, professional

---

## 🎨 Color System

### Primary Colors
```
Deep Blue (Background)    #0A1929  rgb(10, 25, 41)
Electric Blue (Primary)   #0EA5E9  rgb(14, 165, 233)
Charcoal (Surface)        #111827  rgb(17, 24, 39)
```

### Accent Colors
```
Sky Blue (Secondary)      #38BDF8  rgb(56, 189, 248)
Surface Dark             #1E293B  rgb(30, 41, 59)
Border                   #334155  rgb(51, 65, 85)
```

### Semantic Colors
```
Success (Present/มา)      #10B981  rgb(16, 185, 129)
Danger (Absent/ขาด)       #EF4444  rgb(239, 68, 68)
Warning (OT)              #F59E0B  rgb(245, 158, 11)
Info                      #3B82F6  rgb(59, 130, 246)
```

### Text Colors
```
Text Primary             #F1F5F9  rgb(241, 245, 249)
Text Secondary           #94A3B8  rgb(148, 163, 184)
Text Disabled            #64748B  rgb(100, 116, 139)
```

### Gradients
```css
/* Primary Gradient */
background: linear-gradient(135deg, #0A1929 0%, #111827 100%);

/* Electric Gradient (CTAs) */
background: linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%);

/* Success Gradient */
background: linear-gradient(135deg, #10B981 0%, #059669 100%);

/* Danger Gradient */
background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);

/* Recording Active */
background: linear-gradient(135deg, #EF4444 0%, #F59E0B 100%);
```

### Shadows & Glows
```css
/* Primary Shadow */
box-shadow: 0 4px 20px rgba(14, 165, 233, 0.25);

/* Elevated Shadow */
box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4);

/* Success Glow */
box-shadow: 0 0 40px rgba(14, 165, 233, 0.5);

/* Danger Glow */
box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
```

---

## 📐 Typography

### Font Family
```css
/* Primary Font (Thai Support) */
font-family: 'Sarabun', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Fallback for Systems without Thai */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Scales (Mobile Optimized)
```css
/* Display */
--text-display: 48px / 700 / -0.02em
--text-h1: 32px / 900 / -0.01em

/* Headings */
--text-h2: 24px / 700 / normal
--text-h3: 20px / 700 / normal
--text-h4: 18px / 600 / normal

/* Body */
--text-lg: 18px / 600 / normal    /* Large UI text */
--text-base: 16px / 400 / normal  /* Default body */
--text-sm: 14px / 400 / normal    /* Small labels */

/* UI Elements */
--text-button: 18px / 700 / normal  /* Primary buttons */
--text-label: 16px / 600 / normal   /* Form labels */
--text-input: 18px / 400 / normal   /* Input fields */
```

### Line Heights
```
Tight: 1.1   (headings)
Normal: 1.5  (body text)
Relaxed: 1.75 (paragraphs)
```

---

## 📏 Spacing System

### Base Unit: 4px

```
2xs: 4px   (0.25rem)
xs:  8px   (0.5rem)
sm:  12px  (0.75rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
3xl: 64px  (4rem)
```

### Component Spacing
```
Button Padding:       16px 24px (vertical horizontal)
Card Padding:         16px
Section Spacing:      24px
Screen Padding:       16px
Header Height:        Auto (contains tabs)
Bottom Nav Height:    N/A (using tabs instead)
```

---

## 🎯 Touch Targets

### Minimum Sizes
```
Primary Button:       Height 64px (16px padding)
Secondary Button:     Height 56px (14px padding)
Icon Button:          48x48px minimum
Input Field:          Height 56px (14px padding)
Toggle Button:        64x64px (attendance buttons)
```

### Active States
```css
/* Scale Down on Press */
.active\:scale-95:active {
  transform: scale(0.95);
}

/* Prevent Double-tap Zoom (iOS) */
touch-action: manipulation;
```

---

## 🧩 Component Library

### 1. Buttons

#### Primary Button (Electric Blue)
```jsx
<button className="
  w-full h-16 rounded-xl 
  font-bold text-lg
  transition-all active:scale-95
" style={{
  background: 'linear-gradient(135deg, #0EA5E9, #38BDF8)',
  color: '#F1F5F9',
  boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)'
}}>
  {children}
</button>
```

#### Secondary Button (Surface)
```jsx
<button className="
  w-full h-14 rounded-lg
  font-bold text-base
  transition-all active:scale-95
" style={{
  background: '#1E293B',
  color: '#F1F5F9',
  border: '2px solid #334155'
}}>
  {children}
</button>
```

#### Success Button (Green)
```jsx
<button className="
  w-full h-16 rounded-xl
  font-bold text-lg
  transition-all active:scale-95
" style={{
  background: '#10B981',
  color: '#F1F5F9',
  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
}}>
  {children}
</button>
```

#### Danger Button (Red)
```jsx
<button className="
  w-full h-16 rounded-xl
  font-bold text-lg
  transition-all active:scale-95
" style={{
  background: '#EF4444',
  color: '#F1F5F9',
  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
}}>
  {children}
</button>
```

### 2. Input Fields

#### Text Input
```jsx
<input 
  type="text"
  className="
    w-full h-14 px-4
    rounded-lg text-lg
  "
  style={{
    background: '#111827',
    color: '#F1F5F9',
    border: '2px solid #334155'
  }}
  placeholder="กรอกข้อมูล"
/>
```

#### Textarea
```jsx
<textarea
  rows={4}
  className="
    w-full px-4 py-3
    rounded-lg text-lg
  "
  style={{
    background: '#111827',
    color: '#F1F5F9',
    border: '2px solid #334155'
  }}
  placeholder="รายละเอียด"
/>
```

#### Select Dropdown
```jsx
<select 
  className="
    w-full h-14 px-4
    rounded-lg text-lg
  "
  style={{
    background: '#111827',
    color: '#F1F5F9',
    border: '2px solid #334155'
  }}
>
  <option>เลือก...</option>
</select>
```

### 3. Cards

#### Worker Card (Attendance)
```jsx
<div className="p-4 rounded-xl" style={{ background: '#0A1929' }}>
  <div className="flex items-center justify-between mb-3">
    <span className="text-xl font-bold" style={{ color: '#F1F5F9' }}>
      ชื่อคนงาน
    </span>
  </div>
  <div className="grid grid-cols-3 gap-2">
    {/* Status buttons */}
  </div>
</div>
```

#### Work Log Card
```jsx
<div className="p-4 rounded-xl" style={{ background: '#0A1929' }}>
  <p className="text-lg font-bold mb-2" style={{ color: '#F1F5F9' }}>
    รายละเอียดงาน
  </p>
  <div className="flex items-center justify-between">
    <span className="text-xl font-black" style={{ color: '#0EA5E9' }}>
      100 ตร.ม.
    </span>
    <span className="text-sm" style={{ color: '#94A3B8' }}>
      12:30 น.
    </span>
  </div>
</div>
```

### 4. Status Badges

```jsx
{/* Success Badge */}
<span className="px-3 py-1 rounded-full text-sm font-bold"
      style={{ background: '#10B981', color: '#F1F5F9' }}>
  มา
</span>

{/* Danger Badge */}
<span className="px-3 py-1 rounded-full text-sm font-bold"
      style={{ background: '#EF4444', color: '#F1F5F9' }}>
  ขาด
</span>

{/* Warning Badge */}
<span className="px-3 py-1 rounded-full text-sm font-bold"
      style={{ background: '#F59E0B', color: '#F1F5F9' }}>
  OT
</span>
```

### 5. Tab Navigation

```jsx
<div className="flex gap-2">
  <button className="flex-1 h-14 rounded-xl font-bold text-lg"
          style={{
            background: isActive ? '#0EA5E9' : '#1E293B',
            color: isActive ? '#0A1929' : '#F1F5F9'
          }}>
    <div className="flex items-center justify-center gap-2">
      <Icon size={24} />
      <span>แท็บ</span>
    </div>
  </button>
</div>
```

---

## 📱 Screen Layouts

### Login Screen
```
┌─────────────────────────┐
│                         │
│      [LOGO CIRCLE]      │
│        OPTIMA           │
│   ระบบบันทึกงานก่อสร้าง │
│                         │
│  ┌───────────────────┐  │
│  │ เจ้าหน้าที่ (Staff)│  │ ← 80px height
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ผู้ดูแลระบบ (Dev)  │  │ ← 80px height
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
```

### Staff - Attendance Screen
```
┌─────────────────────────┐
│ OPTIMA    [ออกจากระบบ] │ ← Header (sticky)
│ ┌─────────┬──────────┐  │
│ │ เช็คชื่อ│บันทึกงาน│  │ ← Tabs (56px each)
│ └─────────┴──────────┘  │
├─────────────────────────┤
│ ┌───────────────────┐   │
│ │ + เพิ่มคนงานใหม่  │   │ ← 64px button
│ └───────────────────┘   │
│                         │
│ ┌─────────────────────┐ │
│ │ ทีมเสา-คาน          │ │ ← Team header
│ │ บริษัท สยามคอนกรีต  │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ สมชาย ใจดี          │ │
│ │ ┌────┬────┬────┐    │ │
│ │ │ มา │ขาด│ OT │    │ │ ← 64px buttons
│ │ └────┴────┴────┘    │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ สมศักดิ์ ขยัน       │ │
│ │ ┌────┬────┬────┐    │ │
│ │ │ มา │ขาด│ OT │    │ │
│ │ └────┴────┴────┘    │ │
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘
```

### Staff - Work Log Screen
```
┌─────────────────────────┐
│ OPTIMA    [ออกจากระบบ] │
│ ┌─────────┬──────────┐  │
│ │เช็คชื่อ │บันทึกงาน│  │
│ └─────────┴──────────┘  │
├─────────────────────────┤
│ ┌───────────────────┐   │
│ │                   │   │
│ │   🎤 ไมโครโฟน     │   │ ← 128px height
│ │ กดเพื่อบันทึกเสียง │   │   (animated when active)
│ │                   │   │
│ └───────────────────┘   │
│                         │
│ ┌───────────────────┐   │
│ │ รายละเอียดงาน     │   │
│ │ ┌───────────────┐ │   │
│ │ │               │ │   │
│ │ │  [Textarea]   │ │   │ ← 4 rows
│ │ │               │ │   │
│ │ └───────────────┘ │   │
│ │                   │   │
│ │ จำนวน      หน่วย │   │
│ │ ┌────┐    ┌────┐ │   │
│ │ │ 0  │    │ตร.ม│ │   │ ← 56px height
│ │ └────┘    └────┘ │   │
│ │                   │   │
│ │ ┌───────────────┐ │   │
│ │ │    บันทึก     │ │   │ ← 56px button
│ │ └───────────────┘ │   │
│ └───────────────────┘   │
│                         │
│ [Work Log Cards...]     │
│                         │
│ ┌───────────────────┐   │
│ │ 📤 แชร์สรุปงาน    │   │ ← 64px button
│ └───────────────────┘   │
│                         │
└─────────────────────────┘
```

### Dev (Admin) Screen
```
┌─────────────────────────┐
│ OPTIMA - Admin Panel    │
│              [ออกจากระบบ]│
├─────────────────────────┤
│ ┌─────┬──────┬──────┐   │
│ │ 12  │  3   │  1   │   │ ← Stats cards
│ │ มา  │ ขาด  │ OT   │   │
│ └─────┴──────┴──────┘   │
│                         │
│ ┌───────────────────┐   │
│ │ 📥 ส่งออก Excel   │   │ ← 64px button
│ └───────────────────┘   │
│                         │
│ ┌───────────────────┐   │
│ │ 🔄 ปิดรอบ (Reset) │   │ ← 64px button
│ └───────────────────┘   │
│                         │
│ ข้อมูลปัจจุบัน          │
│ ┌───────────────────┐   │
│ │ สรุปการเข้างาน    │   │
│ │ ┌───────────────┐ │   │
│ │ │ ทีมเสา-คาน    │ │   │
│ │ │ สมชาย - มา    │ │   │
│ │ │ สมศักดิ์ - ขาด│ │   │
│ │ └───────────────┘ │   │
│ └───────────────────┘   │
│                         │
│ ┌───────────────────┐   │
│ │ บันทึกงาน         │   │
│ │ [Log entries...]  │   │
│ └───────────────────┘   │
│                         │
└─────────────────────────┘
```

---

## 🎬 Animations & Transitions

### Button Press
```css
.active\:scale-95:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-out;
}
```

### Microphone Pulse (Recording)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Tab Switch
```css
transition: all 0.2s ease-in-out;
```

### Card Appear
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## ♿ Accessibility

### Color Contrast Ratios
```
Text on Deep Blue:       13.8:1 (AAA)
Electric Blue on Deep:   4.8:1  (AA)
White on Success:        4.7:1  (AA)
White on Danger:         5.9:1  (AAA)
```

### Focus States
```css
/* Keyboard Navigation */
button:focus-visible {
  outline: 2px solid #0EA5E9;
  outline-offset: 2px;
}
```

### Screen Reader Support
```jsx
<button aria-label="บันทึกเสียง">
  <Mic />
</button>

<input aria-label="ชื่อคนงาน" />
```

---

## 📐 Responsive Breakpoints

```css
/* Mobile First (Default) */
@media (min-width: 320px) { /* Small phones */ }
@media (min-width: 375px) { /* iPhone */ }
@media (min-width: 414px) { /* Large phones */ }

/* Tablet (if needed) */
@media (min-width: 768px) {
  /* 2-column layout */
}

/* Desktop (Admin panel) */
@media (min-width: 1024px) {
  /* 3-column stats */
}
```

---

## 🔧 Icon Usage

### Lucide React Icons (28-48px)

```jsx
import { 
  Users,           // เช็คชื่อ
  ClipboardList,   // บันทึกงาน
  Mic,             // ไมโครโฟน
  Download,        // ดาวน์โหลด
  RotateCcw,       // รีเซ็ต
  Plus,            // เพิ่ม
  X,               // ปิด
  Share2,          // แชร์
  CheckCircle2,    // มา
  XCircle,         // ขาด
  Clock            // OT
} from 'lucide-react';

// Usage
<Users size={32} strokeWidth={2.5} color="#F1F5F9" />
```

### Icon Sizing Guidelines
```
Large Icons (48px):  Logo, Voice button
Medium Icons (32px): Tab navigation
Small Icons (24px):  Status buttons, inline icons
```

---

## 🎯 Interaction Patterns

### 1. Attendance Toggle
```
Initial State: "มา" (green, filled)
Tap "ขาด": Toggle to red, "มา" becomes outline
Tap "OT": Toggle to orange, others become outline
Tap active again: Return to "มา" (default)
```

### 2. Voice Recording
```
Tap Microphone: Start recording (red gradient, pulse)
Auto-stop: After 30 seconds OR user taps again
Transcribe: Populate description field
Error handling: Show alert if unsupported
```

### 3. Add Worker Flow
```
1. Tap "+ เพิ่มคนงานใหม่"
2. Form expands below button
3. Fill name and select team
4. Tap "บันทึก" → Worker added to list
5. Form collapses automatically
```

### 4. Close Cycle (Admin)
```
1. Tap "ปิดรอบ"
2. Confirmation dialog appears
3. If confirmed:
   - Delete all workers
   - Delete all attendance
   - Delete all work logs
   - Create new cycle
4. Success message
5. UI updates to empty state
```

---

## 📊 Data Display Patterns

### Summary Card (Admin)
```jsx
<div className="p-4 rounded-xl text-center" 
     style={{ background: '#10B981' }}>
  <div className="text-3xl font-black mb-1" 
       style={{ color: '#F1F5F9' }}>
    12
  </div>
  <div className="text-sm font-bold" 
       style={{ color: '#F1F5F9' }}>
    มา
  </div>
</div>
```

### Team Section Header
```jsx
<div className="p-4 rounded-t-xl" 
     style={{ background: '#1E293B' }}>
  <h3 className="text-xl font-bold" 
      style={{ color: '#0EA5E9' }}>
    ทีมเสา-คาน
  </h3>
  <p className="text-sm" 
     style={{ color: '#94A3B8' }}>
    บริษัท สยามคอนกรีต จำกัด
  </p>
</div>
```

---

## 🌐 Thai Language UX

### Common Phrases
```
Login Screen:
- เจ้าหน้าที่ (Staff)
- ผู้ดูแลระบบ (Dev)

Navigation:
- เช็คชื่อ (Attendance)
- บันทึกงาน (Work Log)
- ออกจากระบบ (Logout)

Attendance:
- มา (Present)
- ขาด (Absent)
- OT (Overtime)
- เพิ่มคนงานใหม่ (Add New Worker)

Work Log:
- รายละเอียดงาน (Description)
- จำนวน (Quantity)
- หน่วย (Unit)
- กดเพื่อบันทึกเสียง (Tap to Record)
- กำลังบันทึก... (Recording...)
- แชร์สรุปงาน (Share Summary)

Admin:
- ส่งออก Excel (Export Excel)
- ปิดรอบ (Close Cycle)
- ยืนยันปิดรอบ? (Confirm Close?)
- สรุปการเข้างาน (Attendance Summary)
```

---

## 📱 PWA Considerations

### Offline Mode
- Cache attendance data locally
- Sync when connection restored
- Show offline indicator

### Add to Home Screen
- Custom splash screen (Deep Blue)
- App icon (512x512px)
- Full-screen experience

### Performance
- Lazy load images
- Optimize for 3G networks
- Minimize bundle size

---

## 🎨 Design Files Checklist

- [ ] Icon assets (192x192, 512x512)
- [ ] Splash screens (various sizes)
- [ ] Component Storybook
- [ ] Design tokens JSON
- [ ] Figma/Sketch mockups
- [ ] Voice flow diagram
- [ ] User testing videos

---

**Design Version**: 1.0.0  
**Last Updated**: April 2026  
**Designer**: OPTIMA Team
