import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  PhoneOff,
  FileText,
  MessageSquare,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Save,
  Shield,
  Volume2,
} from 'lucide-react'
import { appointmentService, chatService } from '../../../../api'
import { useUserStore } from '../../../../store/userStore'
import type { AppointmentDto, ChatMessageResponseDto } from '../../../../types/portalDtos'
import {
  LiveKitCallStage,
  type InCallChatMessage,
} from '../../components/LiveKitCallStage'
import { getAvatarColor } from '../../utils/sessionUtils'

// Default LiveKit server URL — falls back to env or hardcoded wss
const DEFAULT_LIVEKIT_URL =
  import.meta.env.VITE_LIVEKIT_URL ||
  (import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/^http/, 'ws')
    : 'wss://nexusmind-889936615032.europe-west3.run.app')

export default function VideoCallRoom() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { profile } = useUserStore()

  const [appointment, setAppointment] = useState<AppointmentDto | null>(null)
  const [joinToken, setJoinToken] = useState<string | null>(null)
  const [livekitServerUrl, setLivekitServerUrl] = useState<string>(DEFAULT_LIVEKIT_URL)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Call duration counter
  const [callSeconds, setCallSeconds] = useState(0)

  // Side Drawer UI State
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true)
  const [activeSideTab, setActiveSideTab] = useState<'soap' | 'chat'>('soap')

  // SOAP Clinical Notes State
  const [subjective, setSubjective] = useState('')
  const [objective, setObjective] = useState('')
  const [assessment, setAssessment] = useState('')
  const [plan, setPlan] = useState('')
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false)

  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessageResponseDto[]>([])
  const [liveMessages, setLiveMessages] = useState<InCallChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const chatBottomRef = useRef<HTMLDivElement | null>(null)

  // End Session Confirmation Modal
  const [isEndModalOpen, setIsEndModalOpen] = useState(false)
  const [isEndingSession, setIsEndingSession] = useState(false)

  // ------------------------------------------------------------------
  // LiveKit call state — driven by LiveKitCallStage callbacks
  // ------------------------------------------------------------------
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMicEnabled, setIsMicEnabled] = useState(true)
  const [isCameraEnabled, setIsCameraEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [hasRemotePatient, setHasRemotePatient] = useState(false)

  // Video element refs used by LiveKitCallStage
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)

  // Imperative controls ref — populated by StageInner inside LiveKitCallStage
  const controlsRef = useRef<{
    toggleMicrophone: () => Promise<void>
    toggleCamera: () => Promise<void>
    toggleScreenShare: () => Promise<void>
    sendChatMessage: (text: string) => Promise<void>
  }>({
    toggleMicrophone: async () => {},
    toggleCamera: async () => {},
    toggleScreenShare: async () => {},
    sendChatMessage: async () => {},
  })

  // Stable callbacks — do NOT recreate on every render (fixes unstable onDisconnected bug)
  const handleLiveKitStateChange = useCallback(
    (state: {
      isConnected: boolean
      isConnecting: boolean
      isMicEnabled: boolean
      isCameraEnabled: boolean
      isScreenSharing: boolean
      hasRemotePatient: boolean
    }) => {
      setIsConnected(state.isConnected)
      setIsConnecting(state.isConnecting)
      setIsMicEnabled(state.isMicEnabled)
      setIsCameraEnabled(state.isCameraEnabled)
      setIsScreenSharing(state.isScreenSharing)
      setHasRemotePatient(state.hasRemotePatient)
    },
    []
  )

  const handleIncomingChatMessage = useCallback((msg: InCallChatMessage) => {
    setLiveMessages((prev) => [...prev, msg])
  }, [])

  // Stable — does NOT recreate on every render
  const handleLiveKitDisconnected = useCallback(() => {
    console.log('LiveKit room disconnected.')
  }, [])

  // ------------------------------------------------------------------
  // 1. Fetch Session Info & Join Token on Mount
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!sessionId) return

    let isMounted = true
    setIsLoadingSession(true)
    setErrorMsg(null)

    const initCall = async () => {
      try {
        // Fetch appointment details
        const appDetails = await appointmentService.getAppointmentById(sessionId)
        if (isMounted) {
          setAppointment(appDetails)
        }

        // Fetch initial SOAP notes if exist
        try {
          const notes = await appointmentService.getAppointmentNotes(sessionId)
          if (isMounted && notes) {
            setSubjective(notes.subjective || '')
            setObjective(notes.objective || '')
            setAssessment(notes.assessment || '')
            setPlan(notes.plan || '')
          }
        } catch {
          // No previous notes, keep empty
        }

        // Fetch initial chat history
        try {
          const history = await chatService.getAppointmentMessages(sessionId)
          if (isMounted && history) {
            setChatHistory(history)
          }
        } catch {
          // Ignore if chat history endpoint fails
        }

        // Request LiveKit Join Token
        const tokenRes = await appointmentService.getJoinToken(sessionId)
        if (isMounted) {
          if (tokenRes?.token) {
            setJoinToken(tokenRes.token)
            if (tokenRes.serverUrl || tokenRes.livekitUrl) {
              setLivekitServerUrl(tokenRes.serverUrl || tokenRes.livekitUrl || DEFAULT_LIVEKIT_URL)
            }
          } else {
            // Provide a simulated fallback token for local dev/testing
            setJoinToken(`mock_livekit_token_${sessionId}_${Date.now()}`)
          }
        }

        // Advance status to IN_PROGRESS
        await appointmentService
          .updateAppointmentStatus(sessionId, { status: 'IN_PROGRESS' })
          .catch((e) => console.warn('Could not update status to IN_PROGRESS:', e))
      } catch (err: unknown) {
        console.error('Failed to initialize video call session:', err)
        if (isMounted) {
          setErrorMsg('Failed to initialize session. Please check your network and try again.')
        }
      } finally {
        if (isMounted) {
          setIsLoadingSession(false)
        }
      }
    }

    initCall()

    return () => {
      isMounted = false
    }
  }, [sessionId])

  // ------------------------------------------------------------------
  // 2. Call Duration Timer
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isConnected && !joinToken) return
    const timer = setInterval(() => {
      setCallSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isConnected, joinToken])

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // ------------------------------------------------------------------
  // 3. Save SOAP Notes Handler
  // ------------------------------------------------------------------
  const handleSaveNotes = async () => {
    if (!sessionId) return
    setIsSavingNotes(true)
    setNotesSavedSuccess(false)
    try {
      await appointmentService.addAppointmentNote(sessionId, {
        subjective,
        objective,
        assessment,
        plan,
      })
      setNotesSavedSuccess(true)
      setTimeout(() => setNotesSavedSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save SOAP notes:', err)
    } finally {
      setIsSavingNotes(false)
    }
  }

  // ------------------------------------------------------------------
  // 4. Send In-Call Chat Message
  // ------------------------------------------------------------------
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const outgoing: InCallChatMessage = {
      id: `self_${Date.now()}`,
      sender: profile?.name || 'Psychologist',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    }

    controlsRef.current.sendChatMessage(chatInput)
    setLiveMessages((prev) => [...prev, outgoing])
    setChatInput('')
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // ------------------------------------------------------------------
  // 5. Conclude / End Session Handler
  // ------------------------------------------------------------------
  const handleEndSession = async () => {
    if (!sessionId) return
    setIsEndingSession(true)
    try {
      // Auto-save latest notes before ending
      if (subjective || objective || assessment || plan) {
        await appointmentService
          .addAppointmentNote(sessionId, { subjective, objective, assessment, plan })
          .catch(() => null)
      }

      // Update appointment status to COMPLETED
      await appointmentService
        .updateAppointmentStatus(sessionId, { status: 'COMPLETED' })
        .catch(() => null)

      // Navigate back to therapy sessions directory
      navigate('/psy/sessions')
    } catch (err) {
      console.error('Failed to gracefully end session:', err)
      navigate('/psy/sessions')
    } finally {
      setIsEndingSession(false)
    }
  }

  const patientName = appointment?.patientName || 'Patient'
  const patientInitials = patientName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
  const avatarGradient = getAvatarColor(patientName)

  return (
    <div className="fixed inset-0 z-50 bg-[#090a0f] text-slate-100 flex flex-col overflow-hidden select-none font-sans">

      {/* Top Header Bar */}
      <header className="h-16 bg-[#12131d]/90 backdrop-blur-md border-b border-[#222437] px-5 flex items-center justify-between z-30 shrink-0">
        {/* Left: Exit button & Patient / Session info */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/psy/sessions')}
            className="p-2 bg-[#1b1c2b] hover:bg-[#25283e] border border-[#2e3146] text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Back to Sessions"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-bold text-white tracking-wide">{patientName}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {appointment?.mode === 'VR' ? 'VR Exposure Therapy' : 'Online Video Call'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>HIPAA Compliant End-to-End Encrypted Telehealth</span>
            </p>
          </div>
        </div>

        {/* Center: Live Call Timer & Connection Indicator */}
        <div className="hidden sm:flex items-center gap-3 bg-[#1b1c2b]/80 border border-[#222437] px-4 py-1.5 rounded-full">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'
              }`}
            ></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              {isConnected ? 'LIVE • Connected' : isConnecting ? 'Connecting...' : 'Room Ready'}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDuration(callSeconds)}</span>
          </div>
        </div>

        {/* Right: End Session Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEndModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(225,29,72,0.25)] transition-all cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Sessiyanı Bitir</span>
          </button>
        </div>
      </header>

      {/* Error Banner */}
      {errorMsg && (
        <div className="bg-rose-500/10 border-b border-rose-500/20 px-5 py-2.5 flex items-center justify-between text-xs text-rose-300 font-semibold z-30 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded text-[10px] font-bold uppercase tracking-wider"
          >
            Yenilə
          </button>
        </div>
      )}

      {/* Main Workspace Area (Stage + Side Drawer) */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">

        {/* Central Video Call Stage */}
        <main className="flex-1 flex flex-col min-w-0 relative bg-[#0d0e17] overflow-hidden">
          {/* Main Remote Video Screen (Patient) */}
          <div className="flex-1 relative flex items-center justify-center p-4 min-h-0">

            {/* LiveKitCallStage — manages connection, renders remote/local video & audio */}
            {joinToken && (
              <LiveKitCallStage
                token={joinToken}
                serverUrl={livekitServerUrl}
                doctorName={profile?.name || 'Psychologist'}
                onDisconnected={handleLiveKitDisconnected}
                onStateChange={handleLiveKitStateChange}
                onChatMessage={handleIncomingChatMessage}
                localVideoRef={localVideoRef}
                remoteVideoRef={remoteVideoRef}
                controlsRef={controlsRef}
              />
            )}

            {/* Fallback when patient has not yet joined */}
            {!hasRemotePatient && (
              <div className="w-full h-full max-h-[750px] rounded-2xl bg-gradient-to-b from-[#141521] to-[#0c0d15] border border-[#222437] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent pointer-events-none"></div>

                {/* Animated Pulsing Avatar */}
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-violet-600/30 to-emerald-600/30 animate-ping absolute inset-0 opacity-40"></div>
                  <div
                    className={`w-28 h-28 rounded-full bg-gradient-to-tr ${avatarGradient} flex items-center justify-center text-3xl font-black text-white relative z-10 border-2 border-white/10 shadow-2xl`}
                  >
                    {patientInitials}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white tracking-wide">{patientName}</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1 max-w-sm">
                  {isLoadingSession
                    ? 'Sessiya otağı hazırlanır...'
                    : 'Pasiyentin qoşulması gözlənilir. Mikrofon və kamera aktivdir.'}
                </p>

                <div className="flex items-center gap-2 mt-5 px-3 py-1.5 bg-[#1b1c2b] border border-[#2e3146] rounded-full text-xs font-semibold text-slate-300">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Audio Kanalları Hazırdır</span>
                </div>
              </div>
            )}
          </div>

          {/* Floating Bottom Media Control Dock */}
          <div className="p-4 flex items-center justify-center shrink-0 z-30">
            <div className="bg-[#141521]/90 backdrop-blur-xl border border-[#2e3146] p-2.5 rounded-2xl flex items-center gap-3 shadow-2xl">
              {/* Microphone Toggle */}
              <button
                onClick={() => controlsRef.current.toggleMicrophone()}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isMicEnabled
                    ? 'bg-[#1b1c2b] hover:bg-[#25283e] text-slate-200'
                    : 'bg-rose-600/20 border border-rose-500/30 text-rose-400'
                }`}
                title={isMicEnabled ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={() => controlsRef.current.toggleCamera()}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isCameraEnabled
                    ? 'bg-[#1b1c2b] hover:bg-[#25283e] text-slate-200'
                    : 'bg-rose-600/20 border border-rose-500/30 text-rose-400'
                }`}
                title={isCameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {isCameraEnabled ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* Screen Share Toggle */}
              <button
                onClick={() => controlsRef.current.toggleScreenShare()}
                className={`p-3 rounded-xl transition-all cursor-pointer ${
                  isScreenSharing
                    ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]'
                    : 'bg-[#1b1c2b] hover:bg-[#25283e] text-slate-200'
                }`}
                title="Share Screen"
              >
                <Monitor className="w-5 h-5" />
              </button>

              <div className="w-px h-6 bg-[#2e3146] mx-1"></div>

              {/* Toggle SOAP Notes Drawer */}
              <button
                onClick={() => {
                  if (isSidePanelOpen && activeSideTab === 'soap') {
                    setIsSidePanelOpen(false)
                  } else {
                    setIsSidePanelOpen(true)
                    setActiveSideTab('soap')
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSidePanelOpen && activeSideTab === 'soap'
                    ? 'bg-violet-600 text-white'
                    : 'bg-[#1b1c2b] hover:bg-[#25283e] text-slate-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">SOAP Qeydləri</span>
              </button>

              {/* Toggle In-Call Chat Drawer */}
              <button
                onClick={() => {
                  if (isSidePanelOpen && activeSideTab === 'chat') {
                    setIsSidePanelOpen(false)
                  } else {
                    setIsSidePanelOpen(true)
                    setActiveSideTab('chat')
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
                  isSidePanelOpen && activeSideTab === 'chat'
                    ? 'bg-violet-600 text-white'
                    : 'bg-[#1b1c2b] hover:bg-[#25283e] text-slate-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Çat</span>
                {liveMessages.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5"></span>
                )}
              </button>
            </div>
          </div>
        </main>

        {/* Right Collapsible Side Panel (SOAP Clinical Notes + In-Call Chat) */}
        {isSidePanelOpen && (
          <aside className="w-96 bg-[#12131d] border-l border-[#222437] flex flex-col shrink-0 z-20 animate-in slide-in-from-right duration-300">
            {/* Panel Tabs Header */}
            <div className="flex border-b border-[#222437]">
              <button
                onClick={() => setActiveSideTab('soap')}
                className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeSideTab === 'soap'
                    ? 'text-white border-b-2 border-violet-500 bg-[#1b1c2b]/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>SOAP Qeydləri</span>
              </button>
              <button
                onClick={() => setActiveSideTab('chat')}
                className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeSideTab === 'chat'
                    ? 'text-white border-b-2 border-violet-500 bg-[#1b1c2b]/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Çat ({chatHistory.length + liveMessages.length})</span>
              </button>
            </div>

            {/* Tab 1: Live SOAP Notes Editor */}
            {activeSideTab === 'soap' && (
              <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Klinik SOAP Sənədləşməsi
                  </span>
                  {notesSavedSuccess && (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Yadda saxlanıldı
                    </span>
                  )}
                </div>

                <div className="space-y-3 flex-1 text-xs">
                  {/* Subjective */}
                  <div>
                    <label className="block text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-1">
                      S (Subjective) - Pasiyentin Şikayətləri
                    </label>
                    <textarea
                      value={subjective}
                      onChange={(e) => setSubjective(e.target.value)}
                      placeholder="Pasiyentin bildirdiyi hisslər, əhval-ruhiyyə və simptomlar..."
                      className="w-full h-20 bg-[#171826] border border-[#2b2e46] focus:border-violet-500 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 outline-none resize-none"
                    />
                  </div>

                  {/* Objective */}
                  <div>
                    <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                      O (Objective) - Həkim Müşahidələri
                    </label>
                    <textarea
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder="Klinik müşahidələr, davranış reaksiyaları, affekt..."
                      className="w-full h-20 bg-[#171826] border border-[#2b2e46] focus:border-cyan-500 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 outline-none resize-none"
                    />
                  </div>

                  {/* Assessment */}
                  <div>
                    <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                      A (Assessment) - Klinik Qiymətləndirmə
                    </label>
                    <textarea
                      value={assessment}
                      onChange={(e) => setAssessment(e.target.value)}
                      placeholder="Diaqnostik düşüncələr, tərəqqi və dinamika..."
                      className="w-full h-20 bg-[#171826] border border-[#2b2e46] focus:border-amber-500 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 outline-none resize-none"
                    />
                  </div>

                  {/* Plan */}
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                      P (Plan) - Terapiya Planı &amp; Ev Tapşırığı
                    </label>
                    <textarea
                      value={plan}
                      onChange={(e) => setPlan(e.target.value)}
                      placeholder="Növbəti sessiya üçün tapşırıqlar və müdaxilə planı..."
                      className="w-full h-20 bg-[#171826] border border-[#2b2e46] focus:border-emerald-500 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Save SOAP Notes Button */}
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(124,58,237,0.25)] transition-all cursor-pointer"
                >
                  {isSavingNotes ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Save className="w-4 h-4 text-white" />
                  )}
                  <span>Qeydləri Yadda Saxla</span>
                </button>
              </div>
            )}

            {/* Tab 2: In-Call Live Chat */}
            {activeSideTab === 'chat' && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {chatHistory.length === 0 && liveMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-4">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
                      <p>Bu sessiya üçün hələ heç bir mesaj yazılmayıb.</p>
                    </div>
                  ) : (
                    <>
                      {chatHistory.map((msg, idx) => (
                        <div
                          key={`hist_${idx}`}
                          className={`flex flex-col ${
                            msg.senderRole === 'DOCTOR' || msg.senderName === profile?.name
                              ? 'items-end'
                              : 'items-start'
                          }`}
                        >
                          <span className="text-[9px] font-bold text-slate-500 mb-0.5">
                            {msg.senderName || 'İstifadəçi'}
                          </span>
                          <div
                            className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                              msg.senderRole === 'DOCTOR' || msg.senderName === profile?.name
                                ? 'bg-violet-600 text-white rounded-tr-none'
                                : 'bg-[#1b1c2b] border border-[#2e3146] text-slate-200 rounded-tl-none'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      ))}

                      {liveMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[9px] font-bold text-slate-500 mb-0.5">
                            {msg.sender} • {msg.time}
                          </span>
                          <div
                            className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                              msg.isSelf
                                ? 'bg-violet-600 text-white rounded-tr-none'
                                : 'bg-[#1b1c2b] border border-[#2e3146] text-slate-200 rounded-tl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      <div ref={chatBottomRef} />
                    </>
                  )}
                </div>

                {/* Chat Input Form */}
                <form onSubmit={handleSendChat} className="p-3 bg-[#171826] border-t border-[#222437] flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Mesajınızı daxil edin..."
                    className="flex-1 bg-[#12131d] border border-[#2e3146] focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="p-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* End Session Confirmation Modal */}
      {isEndModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#141521] border border-[#222437] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
              <PhoneOff className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Sessiyanı yekunlaşdırmaq istəyirsiniz?</h3>
              <p className="text-xs text-slate-400">
                Sessiya bitirildikdə görüş statusu avtomatik olaraq <strong>Tamamlandı (COMPLETED)</strong> kimi qeyd ediləcək və SOAP qeydləriniz arxivlənəcək.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsEndModalOpen(false)}
                disabled={isEndingSession}
                className="flex-1 py-2.5 bg-[#1b1c2b] hover:bg-[#25283e] border border-[#2e3146] text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Geri Qayıt
              </button>
              <button
                onClick={handleEndSession}
                disabled={isEndingSession}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(225,29,72,0.25)] transition-all cursor-pointer"
              >
                {isEndingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Sessiyanı Bitir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

