import { useState } from "react";
import PageLayout from "../layouts/PageLayout.jsx";
import image1 from "../images/image1.png"; // testing purposes
import TranslationComponent from "../components/TranslationComponent.jsx";
import PronounciationComponent from "../components/PronounciationComponent.jsx";
import TryAgainButton from "../components/TryAgainButton.jsx";

function LearningPage() {
  const [question, setQuestion] = useState({
    // Sample data, fetch from backend
    image: image1,
    text: "Halo, mein name ist Ben.",
    translation: "Hello, my name is Ben.",
  });

  return (
    <PageLayout>
      <div className="flex flex-col h-screen py-32">
        <div className="flex flex-col justify-evenly gap-4 grow ">
          <TranslationComponent question={question} />
          <PronounciationComponent question={question} />
        </div>
        <TryAgainButton />
      </div>
    </PageLayout>
  );
}

export default LearningPage;
