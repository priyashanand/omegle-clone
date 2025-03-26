import { useEffect, useRef, useState } from "react";
import { Room } from "./Room";

export const Landing = () => {
    const [name, setName] = useState("");
    const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [joined, setJoined] = useState(false);

    const getCam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            const audioTrack = stream.getAudioTracks()[0];
            const videoTrack = stream.getVideoTracks()[0];

            setLocalAudioTrack(audioTrack);
            setLocalVideoTrack(videoTrack);

            if (videoRef.current) {
                videoRef.current.srcObject = new MediaStream([videoTrack]);
                videoRef.current.play();
            }
        } catch (error) {
            console.error("Error accessing camera: ", error);
        }
    };

    useEffect(() => {
        getCam();
        return () => {
            // Cleanup: Stop media tracks when leaving
            localAudioTrack?.stop();
            localVideoTrack?.stop();
        };
    }, []);

    if (!joined) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
                <h1 className="text-4xl font-bold mb-6">Welcome to Omegle Clone</h1>
                <video ref={videoRef} autoPlay className="w-100 h-100 rounded-lg shadow-lg border-2 border-gray-700 mb-4"></video>
                <input
                    type="text"
                    placeholder="Enter your name"
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    onChange={(e) => setName(e.target.value)}
                />
                <button
                    onClick={() => setJoined(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 transition rounded-lg font-semibold shadow-md"
                >
                    Join
                </button>
            </div>
        );
    }

    return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />;
};
