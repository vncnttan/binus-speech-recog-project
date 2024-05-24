import React, { useState } from "react";
import PageLayout from "../layouts/PageLayout.jsx";
import speaker from "../assets/speaker.png"
import arrow from "../assets/arrow.png"

import image1 from '../images/image1.png'; // testing purposes
import { useNavigate } from "react-router-dom";

function LearningPage() {
    
    const navigate = useNavigate();

    const [question, setQuestion] = useState({ // Sample data, fetch from backend
        image: image1,
        text: 'Halo, mein name ist Ben.',
        translation: 'Hello, my name is Ben.'
    });
    
    const handleArrowClick = () => {
        navigate('/testing');
    }

    const handleSpeakerClick = () => {
        // get TTS from API here
    }

    return (
        <PageLayout>
            <div className="flex flex-col mt-10 mx-10 items-center justify-center">
                <div className="w-96 h-96 flex flex-col items-center justify-center">
                    <img src={question.image} className=""/>
                </div>
                <img src={arrow} className="-rotate-90 h-14 absolute right-20 hover:cursor-pointer" onClick={handleArrowClick}/>
                <div className="flex mt-14">
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl text-white">{question.text}</h1>
                        <h1 className="text-3xl font-light text-white mt-5">{question.translation}</h1>
                    </div>
                    <img src={speaker} className="h-full translate-x-6 hover:cursor-pointer" onClick={handleSpeakerClick}/>
                </div>
            </div>
        </PageLayout>
    );
}

export default LearningPage;