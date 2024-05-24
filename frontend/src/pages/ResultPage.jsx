import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import PageLayout from "../layouts/PageLayout.jsx";
import back from "../assets/return.png"
import arrow from "../assets/arrow.png"

import image1 from '../images/image1.png'; // testing purposes
import { useNavigate } from "react-router-dom";

function TestingPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const [text, setText] = useState('Halo, mein name ist Ben.'); // Sample data, fetch from backend
    const { transcript } = location.state || {};
    
    const isCorrect = () => {
        return transcript == text
    }

    const handleArrowClick = () => {
        navigate('/');
    }

    const handleBackClick = () => {
        navigate('/testing');
    }

    return (
        <PageLayout>
            <div className="flex flex-col mt-10 mx-10 items-center justify-center">
                <h1 className="text-4xl text-white">Now Try Speaking it!</h1>
                <p className="text-2xl text-green-400 mt-14">{text}</p>
                <img src={back} className="mt-16 hover:cursor-pointer" onClick={handleBackClick}/>
                <p className={`${isCorrect() ? 'text-green-400' : 'text-red-500'} text-2xl mt-20`}>{transcript}</p>
                {isCorrect() && (<img src={arrow} className="-rotate-90 h-14 absolute right-20 hover:cursor-pointer translate-y-11" onClick={handleArrowClick}/>)}
            </div>
        </PageLayout>
    );
}

export default TestingPage;
