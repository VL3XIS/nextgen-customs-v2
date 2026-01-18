import { useEffect } from 'react';

declare global {
    interface Window {
        elevenlabs?: any;
    }
}

export default function VoiceWidget() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://elevenlabs.io/convai-widget/index.js";
        script.async = true;
        script.type = "text/javascript";
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <elevenlabs-convai
            agent-id="REPLACE_WITH_YOUR_AGENT_ID"
            style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
        ></elevenlabs-convai>
    );
}
