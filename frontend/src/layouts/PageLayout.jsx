import Navbar from "../components/Navbar.jsx";

function PageLayout({ children }) {
    

    return (
        <>
            <Navbar />
            <div className="custom-grey min-h-screen">
                {children}
            </div>
        </>
    );
}

export default PageLayout;
