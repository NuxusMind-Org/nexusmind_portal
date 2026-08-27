import { useEffect } from 'react'
import {
  LiveKitRoom,
  useLocalParticipant,
  useTracks,
  useDataChannel,
  useRemoteParticipants,
  useConnectionState,
  VideoTrack,
  RoomAudioRenderer,
} from '@livekit/components-react'
import { Track, ConnectionState } from 'livekit-client'
import type { TrackReferenceOrPlaceholder } from '@livekit/components-react'

import '@livekit/components-styles'

export interface InCallChatMessage {
  id: string
  sender: string
  text: string
  time: string
  isSelf: boolean
}

// ---------------------------------------------------------------------------
// Inner component — must live inside <LiveKitRoom> to use its context hooks
// ---------------------------------------------------------------------------
interface StageInnerProps {
  doctorName: string
  localVideoRef: React.RefObject<HTMLVideoElement | null>
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
  onStateChange: (
    state: {
      isConnected: boolean
      isConnecting: boolean
      isMicEnabled: boolean
      isCameraEnabled: boolean
      isScreenSharing: boolean
      hasRemotePatient: boolean
    }
  ) => void
  onChatMessage: (msg: InCallChatMessage) => void
  exposedControls: React.MutableRefObject<{
    toggleMicrophone: () => Promise<void>
    toggleCamera: () => Promise<void>
    toggleScreenShare: () => Promise<void>
    sendChatMessage: (text: string) => Promise<void>
  }>
}

function StageInner({
  doctorName,
  localVideoRef,
  remoteVideoRef,
  onStateChange,
  onChatMessage,
  exposedControls,
}: StageInnerProps) {
  const connectionState = useConnectionState()
  const {
    isMicrophoneEnabled,
    isCameraEnabled,
    isScreenShareEnabled,
    localParticipant,
  } = useLocalParticipant()
  const remoteParticipants = useRemoteParticipants()

  // Remote camera tracks
  const remoteCameraTracks = useTracks([Track.Source.Camera], {
    onlySubscribed: true,
  }).filter((t) => !t.participant.isLocal)

  // Local camera track for PiP
  const localCameraTracks = useTracks([Track.Source.Camera]).filter(
    (t) => t.participant.isLocal
  )

  // Remote screen share tracks
  const remoteScreenShareTracks = useTracks([Track.Source.ScreenShare], {
    onlySubscribed: true,
  }).filter((t) => !t.participant.isLocal)

  // Prefer screen share over camera for main stage
  const mainTrack: TrackReferenceOrPlaceholder | null =
    remoteScreenShareTracks[0] ?? remoteCameraTracks[0] ?? null

  const localTrack: TrackReferenceOrPlaceholder | null =
    localCameraTracks[0] ?? null

  const hasRemotePatient =
    remoteParticipants.length > 0 ||
    remoteCameraTracks.length > 0 ||
    remoteScreenShareTracks.length > 0

  // Data channel for in-call chat (receive)
  useDataChannel((msg) => {
    try {
      const text = new TextDecoder().decode(msg.payload)
      const data = JSON.parse(text)
      if (data?.message) {
        onChatMessage({
          id: `msg_${Date.now()}_${Math.random()}`,
          sender: msg.from?.name || msg.from?.identity || 'Patient',
          text: data.message,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isSelf: false,
        })
      }
    } catch {
      // Ignore malformed packets
    }
  })

  // Bubble state up to parent
  const isConnected = connectionState === ConnectionState.Connected
  const isConnecting = connectionState === ConnectionState.Connecting

  useEffect(() => {
    onStateChange({
      isConnected,
      isConnecting,
      isMicEnabled: isMicrophoneEnabled,
      isCameraEnabled,
      isScreenSharing: isScreenShareEnabled,
      hasRemotePatient,
    })
  }, [
    isConnected,
    isConnecting,
    isMicrophoneEnabled,
    isCameraEnabled,
    isScreenShareEnabled,
    hasRemotePatient,
    onStateChange,
  ])

  // Data channel send handle
  const { send } = useDataChannel()

  // Expose imperative controls to parent via stable ref
  exposedControls.current = {
    toggleMicrophone: async () => {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
    },
    toggleCamera: async () => {
      await localParticipant.setCameraEnabled(!isCameraEnabled)
    },
    toggleScreenShare: async () => {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled)
    },
    sendChatMessage: async (text: string) => {
      if (!text.trim()) return
      const payload = {
        message: text.trim(),
        sender: doctorName,
        timestamp: new Date().toISOString(),
      }
      await send(new TextEncoder().encode(JSON.stringify(payload)), {
        reliable: true,
      })
    },
  }

  return (
    <>
      {/* All room audio — handles all remote participants automatically */}
      <RoomAudioRenderer />

      {/* Remote main stage video (camera or screen share) */}
      {mainTrack && (
        <div className="absolute inset-0 flex items-center justify-center">
          <VideoTrack
            ref={remoteVideoRef as React.RefObject<HTMLVideoElement>}
            trackRef={mainTrack}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Local PiP camera */}
      {localTrack && isCameraEnabled && (
        <div className="absolute top-8 right-8 w-44 sm:w-56 aspect-video rounded-xl overflow-hidden z-20 border-2 border-[#2e3146] shadow-2xl">
          <VideoTrack
            ref={localVideoRef as React.RefObject<HTMLVideoElement>}
            trackRef={localTrack}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------
export interface LiveKitCallStageProps {
  token: string
  serverUrl: string
  doctorName?: string
  onDisconnected?: () => void
  onStateChange: (state: {
    isConnected: boolean
    isConnecting: boolean
    isMicEnabled: boolean
    isCameraEnabled: boolean
    isScreenSharing: boolean
    hasRemotePatient: boolean
  }) => void
  onChatMessage: (msg: InCallChatMessage) => void
  localVideoRef: React.RefObject<HTMLVideoElement | null>
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>
  /** Ref the parent uses to call controls imperatively without re-renders */
  controlsRef: React.MutableRefObject<{
    toggleMicrophone: () => Promise<void>
    toggleCamera: () => Promise<void>
    toggleScreenShare: () => Promise<void>
    sendChatMessage: (text: string) => Promise<void>
  }>
}

export function LiveKitCallStage({
  token,
  serverUrl,
  doctorName = 'Psychologist',
  onDisconnected,
  onStateChange,
  onChatMessage,
  localVideoRef,
  remoteVideoRef,
  controlsRef,
}: LiveKitCallStageProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={true}
      onDisconnected={onDisconnected}
      // Keep the wrapper div invisible so VideoCallRoom controls all layout
      style={{ display: 'contents' }}
    >
      <StageInner
        doctorName={doctorName}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        onStateChange={onStateChange}
        onChatMessage={onChatMessage}
        exposedControls={controlsRef}
      />
    </LiveKitRoom>
  )
}
