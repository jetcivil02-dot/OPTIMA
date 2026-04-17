# OPTIMA - Industrial Construction PWA
## Complete Implementation Guide

---

## 📋 Project Overview

**OPTIMA** is a Progressive Web App designed for civil engineers and field staff to digitally track manpower attendance and work progress, replacing traditional paper logbooks.

### Design Specifications
- **Theme**: Industrial Dark - Deep Blue (#0A1929) with Electric Blue accents (#0EA5E9)
- **Background**: Dark Charcoal/Black for outdoor visibility
- **UI Language**: Thai only
- **Icons**: Lucide-react SVG icons (no emojis)
- **Touch Targets**: Extra-large buttons for field workers with gloves

---

## 🗄️ Database Schema (Supabase)

### 1. Teams Table
Stores sub-contractor team information.

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contractor TEXT NOT NULL,
  color TEXT DEFAULT '#0EA5E9',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample data
INSERT INTO teams (name, contractor) VALUES
  ('ทีมเสา-คาน', 'บริษัท สยามคอนกรีต จำกัด'),
  ('ทีมก่ออิฐ', 'บริษัท ช่างก่อ จำกัด'),
  ('ทีมติดตั้งไฟฟ้า', 'ไฟฟ้าสว่าง');
```

### 2. Workers Table
Individual worker records linked to teams.

```sql
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  phone TEXT,
  position TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT workers_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Indexes for performance
CREATE INDEX idx_workers_team_id ON workers(team_id);
CREATE INDEX idx_workers_name ON workers(name);
```

### 3. Attendance Table
Daily attendance records with unique constraint per worker per day.

```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('มา', 'ขาด', 'OT')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(worker_id, date)
);

-- Indexes
CREATE INDEX idx_attendance_worker_id ON attendance(worker_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_status ON attendance(status);
```

### 4. Work Logs Table
Progress tracking with voice transcription support.

```sql
CREATE TABLE work_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  quantity NUMERIC(10,2),
  unit TEXT,
  date DATE DEFAULT CURRENT_DATE,
  recorded_by TEXT,
  voice_transcript TEXT,
  photos TEXT[], -- Array of image URLs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_work_logs_date ON work_logs(date);
CREATE INDEX idx_work_logs_created_at ON work_logs(created_at DESC);
```

### 5. Cycles Table
Tracks work periods for reset functionality.

```sql
CREATE TABLE cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  closed_by TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ensure only one active cycle
CREATE UNIQUE INDEX idx_cycles_active ON cycles(status) WHERE status = 'active';
```

### 6. Audit Log Table (Optional)
Track all system changes for accountability.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  user_role TEXT,
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
```

---

## 🔐 Row Level Security (RLS) Policies

### Enable RLS on all tables
```sql
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;

-- Policy for staff: read/write access
CREATE POLICY "Staff can view all data"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Staff can insert workers"
  ON workers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can update attendance"
  ON attendance FOR ALL
  USING (true);

-- Policy for dev: full access
CREATE POLICY "Dev full access teams"
  ON teams FOR ALL
  USING (true);

CREATE POLICY "Dev full access workers"
  ON workers FOR ALL
  USING (true);
```

---

## 📱 Next.js Project Setup

### 1. Create Next.js App
```bash
npx create-next-app@latest optima-pwa --typescript --tailwind --app
cd optima-pwa
```

### 2. Install Dependencies
```bash
npm install @supabase/supabase-js
npm install lucide-react
npm install next-pwa
npm install xlsx
npm install @types/node --save-dev
```

### 3. Project Structure
```
optima-pwa/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── staff/
│   │   ├── page.tsx
│   │   └── attendance/
│   └── admin/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── AttendanceCard.tsx
│   ├── WorkLogForm.tsx
│   └── VoiceRecorder.tsx
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── types.ts
├── public/
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── sw.js
└── styles/
    └── globals.css
```

---

## 🔌 Supabase Client Configuration

### lib/supabase.ts
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Team {
  id: string;
  name: string;
  contractor: string;
  color: string;
  created_at: string;
}

export interface Worker {
  id: string;
  name: string;
  team_id: string;
  phone?: string;
  position?: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  worker_id: string;
  date: string;
  status: 'มา' | 'ขาด' | 'OT';
  notes?: string;
  created_at: string;
}

export interface WorkLog {
  id: string;
  description: string;
  quantity?: number;
  unit?: string;
  date: string;
  recorded_by?: string;
  voice_transcript?: string;
  created_at: string;
}
```

### Environment Variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🎙️ Voice-to-Text Implementation

### components/VoiceRecorder.tsx
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export default function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.lang = 'th-TH';
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onTranscript(transcript);
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, [onTranscript]);

  const toggleRecording = () => {
    if (!recognition) {
      alert('เบราว์เซอร์นี้ไม่รองรับการบันทึกเสียง');
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  return (
    <button
      onClick={toggleRecording}
      className={`w-full h-32 rounded-2xl font-bold text-xl transition-all active:scale-95 ${
        isRecording ? 'animate-pulse' : ''
      }`}
      style={{
        background: isRecording 
          ? 'linear-gradient(135deg, #EF4444, #F59E0B)'
          : 'linear-gradient(135deg, #0EA5E9, #38BDF8)',
        color: '#F1F5F9',
        boxShadow: isRecording 
          ? '0 8px 24px rgba(239, 68, 68, 0.4)'
          : '0 8px 24px rgba(14, 165, 233, 0.4)'
      }}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        {isRecording ? <MicOff size={48} /> : <Mic size={48} />}
        <span>{isRecording ? 'กำลังบันทึก...' : 'กดเพื่อบันทึกเสียง'}</span>
      </div>
    </button>
  );
}
```

---

## 📤 Excel Export Implementation

### lib/excel-export.ts
```typescript
import * as XLSX from 'xlsx';
import { Worker, Attendance, WorkLog } from './supabase';

export async function exportToExcel(
  workers: Worker[],
  attendance: Record<string, Attendance[]>,
  workLogs: WorkLog[]
) {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Attendance Sheet
  const attendanceData = workers.map(worker => ({
    'ชื่อคนงาน': worker.name,
    'สถานะ': attendance[worker.id]?.[0]?.status || '-',
    'วันที่': new Date().toLocaleDateString('th-TH'),
    'หมายเหตุ': attendance[worker.id]?.[0]?.notes || ''
  }));

  const wsAttendance = XLSX.utils.json_to_sheet(attendanceData);
  XLSX.utils.book_append_sheet(wb, wsAttendance, 'เช็คชื่อ');

  // Work Logs Sheet
  const workLogData = workLogs.map(log => ({
    'รายละเอียด': log.description,
    'จำนวน': log.quantity || '',
    'หน่วย': log.unit || '',
    'วันที่': new Date(log.date).toLocaleDateString('th-TH'),
    'เวลา': new Date(log.created_at).toLocaleTimeString('th-TH')
  }));

  const wsWorkLogs = XLSX.utils.json_to_sheet(workLogData);
  XLSX.utils.book_append_sheet(wb, wsWorkLogs, 'บันทึกงาน');

  // Generate file
  const fileName = `OPTIMA_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
```

---

## 🔄 PWA Configuration

### public/manifest.json
```json
{
  "name": "OPTIMA - ระบบบันทึกงานก่อสร้าง",
  "short_name": "OPTIMA",
  "description": "Digital logbook for construction sites",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A1929",
  "theme_color": "#0EA5E9",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### next.config.js
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true
});
```

---

## 📊 API Routes Example

### app/api/attendance/route.ts
```typescript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const { worker_id, status, date } = body;

  const { data, error } = await supabase
    .from('attendance')
    .upsert({
      worker_id,
      date: date || new Date().toISOString().split('T')[0],
      status
    }, {
      onConflict: 'worker_id,date'
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      workers (
        id,
        name,
        teams (
          name,
          contractor
        )
      )
    `)
    .eq('date', date);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
```

---

## 🎨 Tailwind Configuration

### tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        deepBlue: '#0A1929',
        electricBlue: '#0EA5E9',
        charcoal: '#111827',
        accent: '#38BDF8',
        surface: '#1E293B',
        border: '#334155',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 🚀 Deployment Checklist

### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. Environment Variables
Set in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. PWA Testing
- Test offline functionality
- Verify install prompt on mobile
- Check icon display
- Test voice recording on HTTPS

### 4. Mobile Optimization
- Test on actual devices
- Verify touch target sizes (min 48x48px)
- Test in direct sunlight for contrast
- Verify landscape orientation

---

## 🔒 Security Considerations

1. **Authentication**: Implement Supabase Auth for production
2. **RLS Policies**: Ensure proper row-level security
3. **API Rate Limiting**: Add rate limits to API routes
4. **Input Validation**: Sanitize all user inputs
5. **HTTPS Only**: Force HTTPS for voice recording

---

## 📝 Future Enhancements

1. **Photo Attachments**: Add camera support for work logs
2. **Offline Mode**: Full offline sync with Service Workers
3. **GPS Tracking**: Automatic location tagging
4. **Push Notifications**: Daily attendance reminders
5. **Multi-language**: Support English alongside Thai
6. **Analytics Dashboard**: Charts and graphs for management
7. **QR Code Check-in**: Worker self-check-in via QR

---

## 🐛 Common Issues & Solutions

### Issue: Voice recording not working
**Solution**: Ensure app is served over HTTPS. Web Speech API requires secure context.

### Issue: PWA not installing on iOS
**Solution**: iOS requires specific meta tags. Add to `<head>`:
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

### Issue: Thai fonts not displaying correctly
**Solution**: Add Thai font support in `globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700;900&display=swap');

body {
  font-family: 'Sarabun', system-ui, sans-serif;
}
```

---

## 📞 Support

For issues or questions, contact the development team or refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Lucide React Icons](https://lucide.dev/)

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**License**: Proprietary
