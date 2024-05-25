import Navbar from "../components/Navbar.jsx";
import globe from "../assets/globe.png"
import { useState } from "react";

function PageLayout({ children }) {
    const [nativeLanguage, setNativeLanguage] = useState("English");

    const handleLanguageChange = (event) => {
        setNativeLanguage(event.target.value);
    };

    return (
        <div className="flex flex-col custom-grey min-h-screen pb-24">
            <Navbar />
            <div className="mt-24 flex flex-col">
                <div className="ml-20 mt-12 flex items-center">
                    <img src={globe} />
                    <select
                        className="ml-3 text-2xl grey-text bg-transparent border-none outline-none custom-select pr-5 hover:cursor-pointer" 
                            value={nativeLanguage} onChange={handleLanguageChange}>
                        <option value="English">English</option>
                        <option value="Indonesian">Indonesian</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Korean">Korean</option>
                        <option value="French">French</option>
                        <option value="Italian">Italian</option>
                    </select>
                </div>
            </div>
            <div className="">
                {children}
            </div>
        </div>
    );
}

export default PageLayout;
