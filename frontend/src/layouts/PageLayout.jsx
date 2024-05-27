import Navbar from "../components/Navbar";

function PageLayout({ children, nativeLanguage, setNativeLanguage }) {
  return (
    <>
      <Navbar
        nativeLanguage={nativeLanguage}
        setNativeLanguage={setNativeLanguage}
      />
      <div className="custom-grey min-h-screen">{children}</div>
    </>
  );
}

export default PageLayout;
