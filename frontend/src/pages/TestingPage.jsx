import React, { useEffect, useState, useRef } from "react";
import PageLayout from "../layouts/PageLayout.jsx";
import mic from "../assets/mic.png";
import greenmic from "../assets/greenmic.png";
import { useNavigate } from "react-router-dom";

function TestingPage() {
    const navigate = useNavigate();
    const [text, setText] = useState('Halo, mein name ist Ben.'); // Sample data, fetch from backend
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleMicHold = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                mediaRecorderRef.current = mediaRecorder
                audioChunksRef.current = [];
                mediaRecorder.ondataavailable = event => {
                    audioChunksRef.current.push(event.data);
                }
                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    setRecordedChunks([...recordedChunks, audioBlob]);
                    audioChunksRef.current = [];
                    await sendAudioToSTTAPI(audioBlob);
                    saveAudioFile(audioBlob);
                    navigate('/result', { state: { transcript: "test" } });
                };
                mediaRecorder.start();
                setIsRecording(true);
            })
            .catch(error => console.error("Error accessing microphone:", error));
    };

    const handleMicRelease = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Need to adjust according to the API
    const sendAudioToSTTAPI = async (audioBlob) => {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        try {
            const response = await fetch('https://localhost:8000', { // The Speech-To-Text API adjust later
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const result = await response.json();
                setTranscript(result.transcript); // Adjust based on API response
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending audio to STT API:', error);
        }
    };

    // ONLY FOR TESTING PURPOSES -> Needs to be converted later into .wav at the python code
    const saveAudioFile = (audioBlob) => {
        const url = URL.createObjectURL(audioBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'recording.webm';
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    };

    return (
        <PageLayout>
            <div className="flex flex-col mt-10 mx-10 items-center justify-center">
                <h1 className="text-4xl text-white">Now Try Speaking it!</h1>
                <p className="text-gray-400 mt-3">(Hold down the microphone to record)</p>
                <img src={isRecording ? greenmic : mic} className="mt-14 hover:cursor-pointer" onMouseDown={handleMicHold} onMouseUp={handleMicRelease} />
                <p className="text-2xl text-white mt-12">{text}</p>
            </div>
        </PageLayout>
    );
}

export default TestingPage;
