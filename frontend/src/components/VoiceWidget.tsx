import React, { useEffect } from 'react';

export default function VoiceWidget() {
    useEffect(() => {
        const agentId = 'REPLACE_WITH_YOUR_AGENT_ID'; // TODO: User needs to update this
        if (agentId === 'REPLACE_WITH_YOUR_AGENT_ID') return;

        const script = document.createElement('script');
        script.src = "https://elevenlabs.io/convai-widget/index.js";
        script.async = true;
        script.type = "text/javascript";
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return React.createElement('elevenlabs-convai', {
        'agent-id': 'REPLACE_WITH_YOUR_AGENT_ID',
        style: { position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }
    });
}
