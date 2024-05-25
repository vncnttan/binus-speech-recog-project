import React, { useState } from "react";
import PageLayout from "../layouts/PageLayout.jsx";
import translationFlag from "../assets/language-flags/english.png";
import germanFlag from "../assets/language-flags/german.png";
import arrow from "../assets/arrow.png";

import image1 from "../images/image1.png"; // testing purposes
import { useNavigate } from "react-router-dom";

function LearningPage() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState({
    // Sample data, fetch from backend
    image: image1,
    text: "Halo, mein name ist Ben.",
    translation: "Hello, my name is Ben.",
  });

  const handleArrowClick = () => {
    navigate("/testing");
  };

  const handleSpeakerClick = () => {
    // get TTS from API here
  };

  return (
    <PageLayout>
      <div className="flex flex-col w-screen h-screen items-center justify-center">
        <div className="w-96 h-96 flex flex-col items-center justify-center">
          <img src={question.image} className="" />
        </div>
        <img
          src={arrow}
          className="-rotate-90 h-14 absolute right-20 hover:cursor-pointer"
          onClick={handleArrowClick}
        />
        <div className="text-white pt-8 flex flex-col items-center gap-2">
          <h1 className="text-4xl flex flex-row gap-2 place-items-center">
          <img alt="Translation Flag" src={germanFlag} height={10} width={48} className="p-1 object-cover rounded-lg" />
            {question.text}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-8 hover:cursor-pointer"
              onClick={handleSpeakerClick}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          </h1>
          <div className="flex flex-row gap-2">
            <img alt="Translation Flag" src={translationFlag} height={6} width={48} className="p-1 object-cover rounded-lg" />
            <h1 className="text-3xl font-light opacity-50">{question.translation}</h1>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default LearningPage;
