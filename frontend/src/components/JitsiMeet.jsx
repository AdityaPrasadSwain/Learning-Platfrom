import React, { useEffect, useRef } from 'react';

/**
 * JitsiMeet component - embeds a Jitsi meeting room directly in the page.
 * Uses the Jitsi IFrame API (no npm package needed).
 *
 * Props:
 *   roomName  - unique room identifier
 *   displayName - the participant's display name
 *   onClose - callback fired when user leaves/closes
 */
const JitsiMeet = ({ roomName, displayName, onClose }) => {
    const jitsiContainerRef = useRef(null);
    const apiRef = useRef(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    useEffect(() => {
        // Dynamically load Jitsi IFrame API script
        const loadJitsiScript = () => new Promise((resolve, reject) => {
            if (window.JitsiMeetExternalAPI) return resolve();
            const script = document.createElement('script');
            script.src = 'https://meet.jit.si/external_api.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Jitsi script. Please check your internet connection or disable ad-blockers.'));
            document.head.appendChild(script);
        });

        loadJitsiScript()
            .then(() => {
                if (!jitsiContainerRef.current) return;
                
                try {
                    apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
                        roomName,
                        parentNode: jitsiContainerRef.current,
                        userInfo: { displayName },
                        configOverwrite: {
                            startWithAudioMuted: false,
                            startWithVideoMuted: false,
                            disableModeratorIndicator: true,
                            prejoinPageEnabled: false,
                        },
                        interfaceConfigOverwrite: {
                            TOOLBAR_BUTTONS: ['microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen', 'hangup', 'chat', 'tileview'],
                            SHOW_JITSI_WATERMARK: false,
                            SHOW_WATERMARK_FOR_GUESTS: false,
                        },
                        width: '100%',
                        height: 520,
                    });

                    apiRef.current.addEventListener('readyToClose', () => {
                        if (onClose) onClose();
                    });

                    apiRef.current.addEventListener('videoConferenceJoined', () => {
                        setIsLoading(false);
                    });
                } catch (e) {
                    setError('Error initializing Jitsi meeting.');
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                setError(err.message);
                setIsLoading(false);
            });

        return () => {
            if (apiRef.current) {
                apiRef.current.dispose();
            }
        };
    }, [roomName, displayName, onClose]);

    return (
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/20" style={{ minHeight: 520 }}>
            {isLoading && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900/80 backdrop-blur-md z-20">
                    <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-cyan-400 font-orbitron animate-pulse">Establishing Secure Connection...</p>
                </div>
            )}
            
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-900/90 backdrop-blur-md z-30 p-6 text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-2">
                        <span className="text-red-500 text-3xl">!</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Connection Failed</h3>
                    <p className="text-gray-400 max-w-sm">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-bold"
                    >
                        RETRY
                    </button>
                </div>
            )}
            
            <div
                ref={jitsiContainerRef}
                className="w-full h-full"
                style={{ height: 520 }}
            />
        </div>
    );
};

export default JitsiMeet;
