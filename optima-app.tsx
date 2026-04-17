import React, { useState, useRef, useEffect } from 'react';
import { Mic, Users, ClipboardList, Download, RotateCcw, Plus, X, Share2, CheckCircle2, XCircle, Clock } from 'lucide-react';

// Industrial Design System - Optimized for outdoor/field use
const COLORS = {
  deepBlue: '#0A1929',
  electricBlue: '#0EA5E9',
  charcoal: '#111827',
  accent: '#38BDF8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  surface: '#1E293B',
  border: '#334155',
  text: '#F1F5F9',
  textDim: '#94A3B8'
};

// Types
interface Team {
  id: string;
  name: string;
  contractor: string;
}

interface Worker {
  id: string;
  name: string;
  teamId: string;
}

interface WorkLog {
  id: string;
  description: string;
  quantity: string;
  unit: string;
  timestamp: string;
}

// ============================================================================
// MOCK DATA LAYER (Replace with Supabase client)
// ============================================================================
const mockTeams: Team[] = [
  { id: '1', name: 'ทีมเสา-คาน', contractor: 'บริษัท สยามคอนกรีต' },
  { id: '2', name: 'ทีมก่ออิฐ', contractor: 'บริษัท ช่างก่อ จำกัด' },
  { id: '3', name: 'ทีมติดตั้งไฟฟ้า', contractor: 'ไฟฟ้าสว่าง' }
];

const mockWorkers: Worker[] = [
  { id: '1', name: 'สมชาย ใจดี', teamId: '1' },
  { id: '2', name: 'สมศักดิ์ ขยัน', teamId: '1' },
  { id: '3', name: 'วิชัย มานะ', teamId: '1' },
  { id: '4', name: 'ประยุทธ์ สุขสม', teamId: '2' },
  { id: '5', name: 'อนุชา รักงาน', teamId: '2' },
  { id: '6', name: 'สมบัติ ฟ้าใส', teamId: '3' }
];

// ============================================================================
// OPTIMA APP COMPONENT
// ============================================================================
export default function OptimaApp() {
  const [currentUser, setCurrentUser] = useState<'staff' | 'dev' | null>(null);
  const [activeTab, setActiveTab] = useState<'attendance' | 'worklog'>('attendance');
  
  // State Management
  const [teams] = useState<Team[]>(mockTeams);
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [newWorkerName, setNewWorkerName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('1');
  const [showAddWorker, setShowAddWorker] = useState(false);
  
  // Work Log State
  const [logDescription, setLogDescription] = useState('');
  const [logQuantity, setLogQuantity] = useState('');
  const [logUnit, setLogUnit] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Initialize attendance with default "มา" status
  useEffect(() => {
    const initAttendance: Record<string, string> = {};
    workers.forEach(worker => {
      initAttendance[worker.id] = 'มา';
    });
    setAttendance(initAttendance);
  }, [workers]);

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const toggleAttendance = (workerId: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [workerId]: prev[workerId] === status ? 'มา' : status
    }));
  };

  const addWorker = () => {
    if (!newWorkerName.trim()) return;
    const newWorker: Worker = {
      id: Date.now().toString(),
      name: newWorkerName,
      teamId: selectedTeam
    };
    setWorkers([...workers, newWorker]);
    setAttendance(prev => ({ ...prev, [newWorker.id]: 'มา' }));
    setNewWorkerName('');
    setShowAddWorker(false);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Web Speech API implementation would go here
    if (!isRecording) {
      alert('กำลังเปิดการบันทึกเสียง... (ต้องใช้ Web Speech API)');
    }
  };

  const addWorkLog = () => {
    if (!logDescription.trim()) return;
    const newLog: WorkLog = {
      id: Date.now().toString(),
      description: logDescription,
      quantity: logQuantity,
      unit: logUnit,
      timestamp: new Date().toLocaleString('th-TH')
    };
    setWorkLogs([newLog, ...workLogs]);
    setLogDescription('');
    setLogQuantity('');
    setLogUnit('');
  };

  const closeCycle = () => {
    if (confirm('ยืนยันปิดรอบ? ข้อมูลทั้งหมดจะถูกลบและเริ่มรอบใหม่')) {
      setWorkers([]);
      setAttendance({});
      setWorkLogs([]);
      alert('ปิดรอบสำเร็จ - เริ่มรอบใหม่');
    }
  };

  const exportToExcel = () => {
    alert('ส่งออกไฟล์ Excel (ต้องใช้ library เช่น xlsx)');
  };

  const shareToLine = () => {
    alert('แชร์ไปยัง LINE (ต้องใช้ LINE SDK หรือ Web Share API)');
  };

  // ============================================================================
  // LOGIN SCREEN
  // ============================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" 
           style={{ background: `linear-gradient(135deg, ${COLORS.deepBlue} 0%, ${COLORS.charcoal} 100%)` }}>
        <div className="w-full max-w-md">
          {/* Logo Area */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-6"
                 style={{ background: COLORS.electricBlue, boxShadow: `0 0 40px ${COLORS.electricBlue}80` }}>
              <ClipboardList size={48} color={COLORS.deepBlue} strokeWidth={2.5} />
            </div>
            <h1 className="text-5xl font-black tracking-tight mb-2" 
                style={{ color: COLORS.text, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              OPTIMA
            </h1>
            <p className="text-xl" style={{ color: COLORS.textDim }}>
              ระบบบันทึกงานก่อสร้าง
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <button
              onClick={() => setCurrentUser('staff')}
              className="w-full h-20 rounded-2xl font-bold text-2xl transition-all active:scale-95"
              style={{ 
                background: COLORS.electricBlue,
                color: COLORS.deepBlue,
                boxShadow: `0 4px 20px ${COLORS.electricBlue}40`
              }}>
              <div className="flex items-center justify-center gap-3">
                <Users size={32} strokeWidth={2.5} />
                <span>เจ้าหน้าที่ (Staff)</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentUser('dev')}
              className="w-full h-20 rounded-2xl font-bold text-2xl transition-all active:scale-95"
              style={{ 
                background: COLORS.surface,
                color: COLORS.text,
                border: `2px solid ${COLORS.border}`
              }}>
              <div className="flex items-center justify-center gap-3">
                <Download size={32} strokeWidth={2.5} />
                <span>ผู้ดูแลระบบ (Dev)</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STAFF VIEW
  // ============================================================================
  if (currentUser === 'staff') {
    return (
      <div className="min-h-screen pb-24" style={{ background: COLORS.charcoal }}>
        {/* Header */}
        <div className="sticky top-0 z-50 p-4"
             style={{ background: COLORS.deepBlue, borderBottom: `2px solid ${COLORS.electricBlue}` }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-black" style={{ color: COLORS.text }}>OPTIMA</h1>
            <button 
              onClick={() => setCurrentUser(null)}
              className="px-6 py-2 rounded-lg font-bold"
              style={{ background: COLORS.surface, color: COLORS.text }}>
              ออกจากระบบ
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('attendance')}
              className="flex-1 h-14 rounded-xl font-bold text-lg transition-all"
              style={{
                background: activeTab === 'attendance' ? COLORS.electricBlue : COLORS.surface,
                color: activeTab === 'attendance' ? COLORS.deepBlue : COLORS.text
              }}>
              <div className="flex items-center justify-center gap-2">
                <Users size={24} strokeWidth={2.5} />
                <span>เช็คชื่อ</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('worklog')}
              className="flex-1 h-14 rounded-xl font-bold text-lg transition-all"
              style={{
                background: activeTab === 'worklog' ? COLORS.electricBlue : COLORS.surface,
                color: activeTab === 'worklog' ? COLORS.deepBlue : COLORS.text
              }}>
              <div className="flex items-center justify-center gap-2">
                <ClipboardList size={24} strokeWidth={2.5} />
                <span>บันทึกงาน</span>
              </div>
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
            <div>
              {/* Add Worker Modal */}
              {showAddWorker && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <div className="bg-surface rounded-2xl p-6 w-full max-w-md" style={{ background: COLORS.surface }}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold" style={{ color: COLORS.text }}>เพิ่มคนงาน</h2>
                      <button onClick={() => setShowAddWorker(false)}>
                        <X size={28} color={COLORS.text} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-lg font-bold mb-2" style={{ color: COLORS.text }}>
                          ชื่อ
                        </label>
                        <input
                          type="text"
                          value={newWorkerName}
                          onChange={(e) => setNewWorkerName(e.target.value)}
                          placeholder="ชื่อคนงาน"
                          className="w-full h-14 px-4 rounded-lg text-lg"
                          style={{ 
                            background: COLORS.charcoal,
                            color: COLORS.text,
                            border: `2px solid ${COLORS.border}`
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-bold mb-2" style={{ color: COLORS.text }}>
                          ทีม
                        </label>
                        <select
                          value={selectedTeam}
                          onChange={(e) => setSelectedTeam(e.target.value)}
                          className="w-full h-14 px-4 rounded-lg text-lg"
                          style={{ 
                            background: COLORS.charcoal,
                            color: COLORS.text,
                            border: `2px solid ${COLORS.border}`
                          }}>
                          {teams.map(team => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={addWorker}
                        className="w-full h-14 rounded-lg font-bold text-lg transition-all active:scale-95"
                        style={{ background: COLORS.success, color: COLORS.text }}>
                        เพิ่มคนงาน
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Workers List */}
              <div className="space-y-3 mb-6">
                {teams.map(team => {
                  const teamWorkers = workers.filter(w => w.teamId === team.id);
                  if (teamWorkers.length === 0) return null;

                  return (
                    <div key={team.id}>
                      <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.electricBlue }}>
                        {team.name}
                      </h3>
                      <div className="space-y-2">
                        {teamWorkers.map(worker => (
                          <div 
                            key={worker.id}
                            className="p-4 rounded-xl flex items-center justify-between"
                            style={{ background: COLORS.surface }}>
                            <span className="text-lg font-bold" style={{ color: COLORS.text }}>
                              {worker.name}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => toggleAttendance(worker.id, 'มา')}
                                className="px-4 py-2 rounded-lg font-bold transition-all"
                                style={{
                                  background: attendance[worker.id] === 'มา' ? COLORS.success : COLORS.charcoal,
                                  color: COLORS.text
                                }}>
                                มา
                              </button>
                              <button
                                onClick={() => toggleAttendance(worker.id, 'ขาด')}
                                className="px-4 py-2 rounded-lg font-bold transition-all"
                                style={{
                                  background: attendance[worker.id] === 'ขาด' ? COLORS.danger : COLORS.charcoal,
                                  color: COLORS.text
                                }}>
                                ขาด
                              </button>
                              <button
                                onClick={() => toggleAttendance(worker.id, 'OT')}
                                className="px-4 py-2 rounded-lg font-bold transition-all"
                                style={{
                                  background: attendance[worker.id] === 'OT' ? COLORS.warning : COLORS.charcoal,
                                  color: COLORS.text
                                }}>
                                OT
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Worker Button */}
              <button
                onClick={() => setShowAddWorker(true)}
                className="w-full h-16 rounded-xl font-bold text-xl transition-all active:scale-95"
                style={{ 
                  background: COLORS.electricBlue,
                  color: COLORS.deepBlue,
                  boxShadow: `0 4px 20px ${COLORS.electricBlue}40`
                }}>
                <div className="flex items-center justify-center gap-3">
                  <Plus size={28} strokeWidth={2.5} />
                  <span>เพิ่มคนงาน</span>
                </div>
              </button>
            </div>
          )}

          {/* WORK LOG TAB */}
          {activeTab === 'worklog' && (
            <div>
              {/* Voice Recording Button */}
              <button
                onClick={handleVoiceInput}
                className="w-full h-16 rounded-xl font-bold text-xl transition-all active:scale-95 mb-6"
                style={{
                  background: isRecording ? COLORS.danger : COLORS.warning,
                  color: COLORS.text,
                  boxShadow: `0 4px 20px ${isRecording ? COLORS.danger : COLORS.warning}40`
                }}>
                <div className="flex items-center justify-center gap-3">
                  <Mic size={28} strokeWidth={2.5} />
                  <span>{isRecording ? 'หยุดบันทึก' : 'บันทึกเสียง'}</span>
                </div>
              </button>

              {/* Work Log Form */}
              <div className="p-4 rounded-xl mb-6" style={{ background: COLORS.surface }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-bold mb-2" style={{ color: COLORS.text }}>
                      รายละเอียด
                    </label>
                    <textarea
                      value={logDescription}
                      onChange={(e) => setLogDescription(e.target.value)}
                      placeholder="อธิบายงานที่ทำ"
                      className="w-full h-24 px-4 py-2 rounded-lg text-lg"
                      style={{ 
                        background: COLORS.charcoal,
                        color: COLORS.text,
                        border: `2px solid ${COLORS.border}`
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-lg font-bold mb-2" style={{ color: COLORS.text }}>
                        จำนวน
                      </label>
                      <input
                        type="number"
                        value={logQuantity}
                        onChange={(e) => setLogQuantity(e.target.value)}
                        placeholder="0"
                        className="w-full h-14 px-4 rounded-lg text-lg"
                        style={{ 
                          background: COLORS.charcoal,
                          color: COLORS.text,
                          border: `2px solid ${COLORS.border}`
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold mb-2" style={{ color: COLORS.text }}>
                        หน่วย
                      </label>
                      <input
                        type="text"
                        value={logUnit}
                        onChange={(e) => setLogUnit(e.target.value)}
                        placeholder="ตร.ม."
                        className="w-full h-14 px-4 rounded-lg text-lg"
                        style={{ 
                          background: COLORS.charcoal,
                          color: COLORS.text,
                          border: `2px solid ${COLORS.border}`
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={addWorkLog}
                    className="w-full h-14 rounded-lg font-bold text-lg transition-all active:scale-95"
                    style={{ background: COLORS.success, color: COLORS.text }}>
                    บันทึก
                  </button>
                </div>
              </div>

              {/* Work Logs List */}
              <div className="space-y-3 mb-6">
                {workLogs.map(log => (
                  <div 
                    key={log.id}
                    className="p-4 rounded-xl"
                    style={{ background: COLORS.deepBlue }}>
                    <p className="text-lg font-bold mb-2" style={{ color: COLORS.text }}>
                      {log.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black" style={{ color: COLORS.electricBlue }}>
                        {log.quantity} {log.unit}
                      </span>
                      <span className="text-sm" style={{ color: COLORS.textDim }}>
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Share Button */}
              {workLogs.length > 0 && (
                <button
                  onClick={shareToLine}
                  className="w-full h-16 rounded-xl font-bold text-xl transition-all active:scale-95"
                  style={{ 
                    background: `linear-gradient(135deg, ${COLORS.success}, #059669)`,
                    color: COLORS.text,
                    boxShadow: `0 4px 20px ${COLORS.success}40`
                  }}>
                  <div className="flex items-center justify-center gap-3">
                    <Share2 size={28} strokeWidth={2.5} />
                    <span>แชร์สรุปงาน</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </div>
    );
  }

  // ============================================================================
  // DEV (ADMIN) VIEW
  // ============================================================================
  if (currentUser === 'dev') {
    const presentCount = Object.values(attendance).filter(s => s === 'มา').length;
    const absentCount = Object.values(attendance).filter(s => s === 'ขาด').length;
    const otCount = Object.values(attendance).filter(s => s === 'OT').length;

    return (
      <div className="min-h-screen" style={{ background: COLORS.charcoal }}>
        {/* Header */}
        <div className="sticky top-0 z-50 p-4"
             style={{ background: COLORS.deepBlue, borderBottom: `2px solid ${COLORS.electricBlue}` }}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black" style={{ color: COLORS.text }}>
              OPTIMA - Admin Panel
            </h1>
            <button 
              onClick={() => setCurrentUser(null)}
              className="px-6 py-2 rounded-lg font-bold"
              style={{ background: COLORS.surface, color: COLORS.text }}>
              ออกจากระบบ
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-xl text-center" style={{ background: COLORS.success }}>
              <div className="text-3xl font-black mb-1" style={{ color: COLORS.text }}>
                {presentCount}
              </div>
              <div className="text-sm font-bold" style={{ color: COLORS.text }}>มา</div>
            </div>
            <div className="p-4 rounded-xl text-center" style={{ background: COLORS.danger }}>
              <div className="text-3xl font-black mb-1" style={{ color: COLORS.text }}>
                {absentCount}
              </div>
              <div className="text-sm font-bold" style={{ color: COLORS.text }}>ขาด</div>
            </div>
            <div className="p-4 rounded-xl text-center" style={{ background: COLORS.warning }}>
              <div className="text-3xl font-black mb-1" style={{ color: COLORS.text }}>
                {otCount}
              </div>
              <div className="text-sm font-bold" style={{ color: COLORS.text }}>OT</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={exportToExcel}
              className="w-full h-16 rounded-xl font-bold text-lg transition-all active:scale-95"
              style={{ 
                background: COLORS.success,
                color: COLORS.text,
                boxShadow: `0 4px 16px ${COLORS.success}40`
              }}>
              <div className="flex items-center justify-center gap-3">
                <Download size={28} strokeWidth={2.5} />
                <span>ส่งออก Excel</span>
              </div>
            </button>

            <button
              onClick={closeCycle}
              className="w-full h-16 rounded-xl font-bold text-lg transition-all active:scale-95"
              style={{ 
                background: COLORS.danger,
                color: COLORS.text,
                boxShadow: `0 4px 16px ${COLORS.danger}40`
              }}>
              <div className="flex items-center justify-center gap-3">
                <RotateCcw size={28} strokeWidth={2.5} />
                <span>ปิดรอบ (Reset ทั้งหมด)</span>
              </div>
            </button>
          </div>

          {/* Current Data Summary */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.electricBlue }}>
              ข้อมูลปัจจุบัน
            </h2>
            
            {/* Attendance Summary */}
            <div className="mb-4 p-4 rounded-xl" style={{ background: COLORS.surface }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: COLORS.text }}>
                สรุปการเข้างาน ({workers.length} คน)
              </h3>
              {teams.map(team => {
                const teamWorkers = workers.filter(w => w.teamId === team.id);
                if (teamWorkers.length === 0) return null;

                return (
                  <div key={team.id} className="mb-3 p-3 rounded-lg" style={{ background: COLORS.deepBlue }}>
                    <p className="font-bold mb-2" style={{ color: COLORS.electricBlue }}>
                      {team.name}
                    </p>
                    {teamWorkers.map(worker => (
                      <div key={worker.id} className="flex justify-between items-center py-2 border-b" 
                           style={{ borderColor: COLORS.border }}>
                        <span style={{ color: COLORS.text }}>{worker.name}</span>
                        <span className="px-3 py-1 rounded-full text-sm font-bold"
                              style={{
                                background: 
                                  attendance[worker.id] === 'มา' ? COLORS.success :
                                  attendance[worker.id] === 'ขาด' ? COLORS.danger :
                                  COLORS.warning,
                                color: COLORS.text
                              }}>
                          {attendance[worker.id]}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Work Logs Summary */}
            <div className="p-4 rounded-xl" style={{ background: COLORS.surface }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: COLORS.text }}>
                บันทึกงาน ({workLogs.length} รายการ)
              </h3>
              {workLogs.length === 0 ? (
                <p style={{ color: COLORS.textDim }}>ยังไม่มีบันทึกงาน</p>
              ) : (
                <div className="space-y-2">
                  {workLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="p-3 rounded-lg" style={{ background: COLORS.deepBlue }}>
                      <p className="font-bold mb-1" style={{ color: COLORS.text }}>
                        {log.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span style={{ color: COLORS.electricBlue }}>
                          {log.quantity} {log.unit}
                        </span>
                        <span className="text-sm" style={{ color: COLORS.textDim }}>
                          {log.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
