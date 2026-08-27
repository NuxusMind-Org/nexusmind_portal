import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Room,
  RoomEvent,
  ConnectionState,
  Track,
  type RemoteParticipant,
  type RemoteTrackPublication,
  type RemoteTrack,
} from 'livekit-client'

export interface InCallChatMessage {
  id: string
  sender: string
  text: string
  time: string
  isSelf: boolean
}

interface UseLiveKitRoomProps {
  token: string | null
  livekitUrl?: string
  doctorName?: string
  onDisconnected?: () => void
}

export function useLiveKitRoom({
  token,
  livekitUrl,
  doctorName = 'Psychologist',
  onDisconnected,
}: UseLiveKitRoomProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected
  )
  const [isMicEnabled, setIsMicEnabled] = useState<boolean>(true)
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(true)
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false)
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([])
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<RemoteTrack | null>(null)
  const [remoteAudioTrack, setRemoteAudioTrack] = useState<RemoteTrack | null>(null)
  const [chatMessages, setChatMessages] = useState<InCallChatMessage[]>([])
  const [error, setError] = useState<string | null>(null)

  const roomRef = useRef<Room | null>(null)
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null)

  // Default livekit server websocket URL
  const defaultWsUrl =
    livekitUrl ||
    import.meta.env.VITE_LIVEKIT_URL ||
    (import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/^http/, 'ws')
      : 'wss://nexusmind-889936615032.europe-west3.run.app')

  // Connect to LiveKit room
  useEffect(() => {
    if (!token) return

    let isMounted = true
    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
    })
    roomRef.current = room

    // Setup Event Listeners
    room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
      if (!isMounted) return
      setConnectionState(state)
    })

    room.on(RoomEvent.Connected, () => {
      if (!isMounted) return
      setConnectionState(ConnectionState.Connected)
      setRemoteParticipants(Array.from(room.remoteParticipants.values()))
    })

    room.on(RoomEvent.Disconnected, () => {
      if (!isMounted) return
      setConnectionState(ConnectionState.Disconnected)
      onDisconnected?.()
    })

    room.on(RoomEvent.ParticipantConnected, (_participant: RemoteParticipant) => {
      if (!isMounted) return
      setRemoteParticipants(Array.from(room.remoteParticipants.values()))
    })

    room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      if (!isMounted) return
      setRemoteParticipants(Array.from(room.remoteParticipants.values()))
      if (remoteVideoTrack?.sid === participant.sid) {
        setRemoteVideoTrack(null)
      }
    })

    room.on(
      RoomEvent.TrackSubscribed,
      (track: RemoteTrack, _publication: RemoteTrackPublication, _participant: RemoteParticipant) => {
        if (!isMounted) return
        if (track.kind === Track.Kind.Video) {
          setRemoteVideoTrack(track)
          if (remoteVideoRef.current) {
            track.attach(remoteVideoRef.current)
          }
        } else if (track.kind === Track.Kind.Audio) {
          setRemoteAudioTrack(track)
          if (remoteAudioRef.current) {
            track.attach(remoteAudioRef.current)
          }
        }
      }
    )


    room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
      if (!isMounted) return
      track.detach()
      if (track.kind === Track.Kind.Video) {
        setRemoteVideoTrack(null)
      } else if (track.kind === Track.Kind.Audio) {
        setRemoteAudioTrack(null)
      }
    })

    room.on(
      RoomEvent.DataReceived,
      (payload: Uint8Array, participant?: RemoteParticipant) => {
        if (!isMounted) return
        try {
          const decoder = new TextDecoder()
          const text = decoder.decode(payload)
          const data = JSON.parse(text)
          if (data && data.message) {
            const senderName = participant?.name || participant?.identity || 'Patient'
            setChatMessages((prev) => [
              ...prev,
              {
                id: `msg_${Date.now()}_${Math.random()}`,
                sender: senderName,
                text: data.message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSelf: false,
              },
            ])
          }
        } catch {
          // Ignore binary packets or malformed json
        }
      }
    )

    // Connect to the room
    const startConnection = async () => {
      try {
        await room.connect(defaultWsUrl, token)

        // Enable local camera and microphone
        try {
          await room.localParticipant.enableCameraAndMicrophone()
          setIsMicEnabled(true)
          setIsCameraEnabled(true)

          // Attach local video track to element
          const videoTrackPub = room.localParticipant.getTrackPublication(Track.Source.Camera)
          if (videoTrackPub?.track && localVideoRef.current) {
            videoTrackPub.track.attach(localVideoRef.current)
          }
        } catch (mediaErr) {
          console.warn('Could not auto-enable camera/mic on connect:', mediaErr)
        }
      } catch (err: unknown) {
        console.error('Failed to connect to LiveKit room:', err)
        if (isMounted) {
          setError('Could not connect to LiveKit video server. Please check your network.')
        }
      }
    }

    startConnection()

    return () => {
      isMounted = false
      room.disconnect()
      roomRef.current = null
    }
  }, [token, defaultWsUrl, onDisconnected])

  // Attach remote video track if ref mounts later
  useEffect(() => {
    if (remoteVideoTrack && remoteVideoRef.current) {
      remoteVideoTrack.attach(remoteVideoRef.current)
    }
  }, [remoteVideoTrack])

  // Attach remote audio track if ref mounts later
  useEffect(() => {
    if (remoteAudioTrack && remoteAudioRef.current) {
      remoteAudioTrack.attach(remoteAudioRef.current)
    }
  }, [remoteAudioTrack])

  // Toggle Microphone
  const toggleMicrophone = useCallback(async () => {
    const room = roomRef.current
    if (!room) return
    const newState = !isMicEnabled
    try {
      await room.localParticipant.setMicrophoneEnabled(newState)
      setIsMicEnabled(newState)
    } catch (err) {
      console.error('Error toggling microphone:', err)
    }
  }, [isMicEnabled])

  // Toggle Camera
  const toggleCamera = useCallback(async () => {
    const room = roomRef.current
    if (!room) return
    const newState = !isCameraEnabled
    try {
      await room.localParticipant.setCameraEnabled(newState)
      setIsCameraEnabled(newState)

      if (newState && localVideoRef.current) {
        const videoTrackPub = room.localParticipant.getTrackPublication(Track.Source.Camera)
        if (videoTrackPub?.track) {
          videoTrackPub.track.attach(localVideoRef.current)
        }
      }
    } catch (err) {
      console.error('Error toggling camera:', err)
    }
  }, [isCameraEnabled])

  // Toggle Screen Share
  const toggleScreenShare = useCallback(async () => {
    const room = roomRef.current
    if (!room) return
    const newState = !isScreenSharing
    try {
      await room.localParticipant.setScreenShareEnabled(newState)
      setIsScreenSharing(newState)
    } catch (err) {
      console.error('Error toggling screen share:', err)
    }
  }, [isScreenSharing])

  // Send In-Call Chat Message
  const sendChatMessage = useCallback(
    async (text: string) => {
      const room = roomRef.current
      if (!room || !text.trim()) return

      const payload = {
        message: text.trim(),
        sender: doctorName,
        timestamp: new Date().toISOString(),
      }

      try {
        const encoder = new TextEncoder()
        const data = encoder.encode(JSON.stringify(payload))
        await room.localParticipant.publishData(data, { reliable: true })

        setChatMessages((prev) => [
          ...prev,
          {
            id: `self_${Date.now()}`,
            sender: doctorName,
            text: text.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSelf: true,
          },
        ])
      } catch (err) {
        console.error('Failed to send in-call chat message:', err)
      }
    },
    [doctorName]
  )

  // Disconnect from room
  const disconnect = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.disconnect()
      roomRef.current = null
    }
    setConnectionState(ConnectionState.Disconnected)
  }, [])

  return {
    connectionState,
    isConnected: connectionState === ConnectionState.Connected,
    isConnecting: connectionState === ConnectionState.Connecting,
    isMicEnabled,
    isCameraEnabled,
    isScreenSharing,
    remoteParticipants,
    hasRemotePatient: remoteParticipants.length > 0 || Boolean(remoteVideoTrack),
    remoteVideoTrack,
    chatMessages,
    error,
    localVideoRef,
    remoteVideoRef,
    remoteAudioRef,
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
    sendChatMessage,
    disconnect,
  }
}
