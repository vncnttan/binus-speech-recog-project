import englishFlag from "../assets/language-flags/english.png";
import indonesianFlag from "../assets/language-flags/indonesia.png";
import germanFlag from "../assets/language-flags/german.png";

export default function TranslationComponent({ question, nativeLanguage }) {

  const translationFlag = nativeLanguage === 'English' ? englishFlag : indonesianFlag;
  const handleSpeakerClick = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/tts', {
        method: 'POST',
        body: new URLSearchParams({
          text: question.german,
        }),
      });
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        console.error('Failed to fetch audio:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center gap-8 w-fit mx-auto">
      <div className="flex flex-col items-center justify-center">
        <img src={question.image} className="h-52 rounded-md" />
      </div>
      <div className="text-white flex flex-col gap-2">
        <h1 className="text-4xl flex flex-row gap-2 place-items-center">
          <img
            alt="Translation Flag"
            src={germanFlag}
            height={10}
            width={48}
            className="p-1 object-cover rounded-lg"
          />
          {question.german}
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
        <div className="text-xl font-light opacity-50 flex flex-row gap-2">
          Translation:
          <img
            alt="Translation Flag"
            src={translationFlag}
            height={4}
            width={32}
            className="p-1 object-cover rounded-lg"
          />
          {question[nativeLanguage.toLowerCase()]}
        </div>
      </div>
    </div>
  );
}
