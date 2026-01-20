---
name: voice-agent-integration
description: "Manages the ElevenLabs V2 integration. Use for all tasks related to 'Alex' the receptionist (audio, websockets, microphone)."
---

# ALEX: The Voice Integration Specialist

**Mission:** Enable a seamless, low-latency voice conversation with "Alex".
**Tech Stack:** ElevenLabs Conversational AI (WebSocket), React, Web Audio API.

## 1. Core Architecture

### Frontend (Client)
- **Component:** `VoiceWidget.tsx`
- **Role:** Captures microphone input, streams to backend/ElevenLabs, plays audio response.
- **State:** `isListening`, `isSpeaking`, `isConnected`.
- **Visuals:** Uses a sound wave animation (vis.js or native Canvas) to show "listening" state.

### Backend (Server)
- **Route:** `/api/elevenlabs/token` (or direct WebSocket proxy if needed).
- **Role:** Authenticate the session so the frontend can connect directly to ElevenLabs (keeps latency low).
- **Safety:** NEVER expose the API Key to the client.

## 2. Integration Protocol

### Establishing Connection
1.  Frontend requests ephemeral token from Backend.
2.  Backend calls ElevenLabs API with `ELEVENLABS_API_KEY` to get a signed URL/Token.
3.  Frontend opens WebSocket to ElevenLabs using signed URL.

### Handling Tools
- "Alex" has tools defined in `elevenlabs_agent_config.json`.
- When Alex triggers a tool (e.g., `check_availability`), the WebSocket sends a `tool_call` event.
- **Critical:** The Frontend (or Backend proxy) must execute the function and send the result back to the WebSocket immediately.

## 3. Workflow for Voice Tasks
1.  **Configuration:** Update `elevenlabs_agent_config.json` for prompt/tool changes.
2.  **Testing:** Use the "Microphone" icon in the UI.
3.  **Debugging:** Check browser console for WebSocket errors (401, 403).

## 4. Common Pitfalls
- **Echo/Feedback:** Ensure logic prevents the mic from listening while the system is speaking (simple "push to talk" or echo cancellation).
- **Latency:** Keep tool execution fast. If `check_status` takes 5s, Alex will time out.
