import { useRef, useState } from "react";
import mic from "../assets/mic.png";
import greenmic from "../assets/greenmic.png";

export default function PronounciationComponent({ question }) {
  const [text, setText] = useState("HELLO MY NAME IS BEN"); // Sample data, fetch from backend
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleMicHold = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          setRecordedChunks([...recordedChunks, audioBlob]);
          audioChunksRef.current = [];
          // saveAudioFile(audioBlob); DELETE THIS LATER, ONLY FOR TESTING
          const transcript = await sendAudioToSTTAPI(audioBlob);
          console.log(transcript);
          // navigate('/result', { state: { transcript } });
        };
        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const handleMicRelease = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Need to adjust according to the API
  const sendAudioToSTTAPI = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    try {
      const response = await fetch("http://127.0.0.1:5000/transcribe", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        return result.transcript;
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending audio to STT API:", error);
    }
  };

  // ONLY FOR TESTING PURPOSES -> Needs to be converted later into .wav at the python code
  // const saveAudioFile = (audioBlob) => {
  //     const url = URL.createObjectURL(audioBlob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = 'recording.webm';
  //     document.body.appendChild(link);
  //     link.click();
  //     URL.revokeObjectURL(url);
  //     document.body.removeChild(link);
  // };

  return (
    <div className="flex flex-row grow items-center justify-center gap-5 hover:bg-gray-800">
      <div className={isRecording ? "text-green-500" : "text-white"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl text-white">Now Try Speaking it!</h1>
        <p className="text-gray-400">(Hold down the microphone to record)</p>
        {/* <p className="text-2xl text-white mt-12">{text}</p> */}
      </div>
    </div>
  );
}
