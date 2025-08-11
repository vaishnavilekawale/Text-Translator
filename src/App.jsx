import { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ArrowsRightLeftIcon, ChevronUpDownIcon, DocumentDuplicateIcon, XMarkIcon } from "@heroicons/react/24/solid";

// List of all available languages for the translator
const languageOptions = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
  { code: "mr", name: "Marathi" },
  { code: "ar", name: "Arabic" },
  { code: "ja", name: "Japanese" },
  { code: "ru", name: "Russian" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "ko", name: "Korean" },
];

// Main Translator Component
export default function Translator() {
  // State for source language, defaults to English
  const [sourceLang, setSourceLang] = useState(languageOptions[0]);
  // State for target language, defaults to Hindi
  const [targetLang, setTargetLang] = useState(languageOptions[4]);
  // State for the input text
  const [text, setText] = useState("");
  // State for the translated text
  const [translatedText, setTranslatedText] = useState("");
  // State to show a loading message during translation
  const [loading, setLoading] = useState(false);
  // State to store any error message
  const [error, setError] = useState("");

  // Function to swap the source and target languages
  const handleSwapLanguages = () => {
    const tempSource = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempSource);
  };

  // Function to copy the translated text to the clipboard
  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      alert("Translated text copied to clipboard!");
    }
  };

  // Function to call the translation API
  const translateText = async () => {
    if (!text.trim()) return; // Don't translate if input is empty

    setLoading(true);
    setError("");
    setTranslatedText("");

    try {
      // This is the correct API endpoint with dynamic language codes
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang.code}|${targetLang.code}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (res.ok && data?.responseData?.translatedText) {
        // If translation is successful, update the state
        setTranslatedText(data.responseData.translatedText);
      } else {
        // Handle cases where the API returns an error message
        setError(data?.responseData?.translatedText || "Translation failed. Please try again.");
      }
    } catch (err) {
      // Handle network or other unexpected errors
      setError("An error occurred. Please check your network connection.");
    }
    // Stop the loading state
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-cyan-400">
          Advanced Translator 🌍
        </h1>
        <p className="text-center text-slate-400 mb-8">Translate text instantly with a modern interface.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Source Language Panel */}
          <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <LanguageSelector selected={sourceLang} setSelected={setSourceLang} />
              {text && (
               <button onClick={() => setText("")} className="text-slate-400 hover:text-white transition-colors">
                  <XMarkIcon className="h-6 w-6"/>
               </button>
              )}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-48 p-3 bg-slate-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
            />
          </div>

          {/* Translated Text Panel */}
          <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
             <div className="flex justify-between items-center mb-4">
               <LanguageSelector selected={targetLang} setSelected={setTargetLang} />
               {translatedText && (
                 <button onClick={handleCopy} title="Copy to clipboard" className="text-slate-400 hover:text-white transition-colors">
                   <DocumentDuplicateIcon className="h-6 w-6"/>
                 </button>
               )}
             </div>
             <div className="w-full h-48 p-3 bg-slate-900/50 rounded-lg min-h-[192px]">
               {loading ? (
                  <div className="flex items-center justify-center h-full text-slate-400">Translating...</div>
               ) : error ? (
                  <div className="text-red-400">{error}</div>
               ) : (
                 <p className="whitespace-pre-wrap">{translatedText || <span className="text-slate-500">Translation will appear here</span>}</p>
               )}
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
            <button
                onClick={handleSwapLanguages}
                title="Swap Languages"
                className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
            >
                <ArrowsRightLeftIcon className="h-6 w-6 text-slate-300"/>
            </button>
            <button
              onClick={translateText}
              disabled={loading || !text.trim()}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please Wait..." : "Translate"}
            </button>
        </div>
      </div>
    </div>
  );
}

// Reusable Language Selector Component (using Headless UI)
function LanguageSelector({ selected, setSelected }) {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-slate-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 sm:text-sm min-w-[120px]">
          <span className="block truncate font-semibold">{selected.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-48 overflow-auto rounded-md bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {languageOptions.map((lang, langIdx) => (
              <Listbox.Option
                key={langIdx}
                className={({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${ active ? 'bg-cyan-500 text-white' : 'text-slate-300' }`}
                value={lang}
              >
                {({ selected }) => (
                  <span className={`block truncate ${ selected ? 'font-medium' : 'font-normal' }`}>
                    {lang.name}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}