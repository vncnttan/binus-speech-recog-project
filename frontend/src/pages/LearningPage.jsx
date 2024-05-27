import { useState } from "react";
import PageLayout from "../layouts/PageLayout.jsx";
import questionDatas from "../data/questionDatas.json";
import TranslationComponent from "../components/TranslationComponent.jsx";
import PronounciationComponent from "../components/PronounciationComponent.jsx";
import TryAgainButton from "../components/TryAgainButton.jsx";

function LearningPage() {
  const [idx, setIdx] = useState(0);
  const [question, setQuestion] = useState(questionDatas[idx]);

  const refreshQuestion = () => {
    setIdx((idx + 1) % questionDatas.length);
    console.log(idx);
    setQuestion(questionDatas[idx]);
  };

  const [nativeLanguage, setNativeLanguage] = useState("English");

  return (
    <PageLayout
      nativeLanguage={nativeLanguage}
      setNativeLanguage={setNativeLanguage}
    >
      <div className="flex flex-col h-screen py-36">
        <div className="flex flex-col justify-evenly gap-4 grow ">
          <TranslationComponent
            question={question}
            nativeLanguage={nativeLanguage}
          />
          <PronounciationComponent question={question} />
        </div>
        <TryAgainButton refreshQuestion={refreshQuestion} />
      </div>
    </PageLayout>
  );
}

export default LearningPage;
