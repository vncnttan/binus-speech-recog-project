import Navbar from "../components/Navbar.jsx";

function PageLayout({ children }) {
    

    return (
        <div className="flex flex-col custom-grey min-h-screen pb-24">
            <Navbar />
                
            <div className="">
                {children}
            </div>
        </div>
    );
}

export default PageLayout;
