import Image from "next/image";
import { FC } from "react";

import InitialInputArea from "./InitialInputArea";
import { suggestions } from "@/utils/utils";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleChat: (messages?: { role: string; content: string }[]) => void;
  ageGroup: string;
  setAgeGroup: React.Dispatch<React.SetStateAction<string>>;
  handleInitialChat: () => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleChat,
  ageGroup,
  setAgeGroup,
  handleInitialChat,
}) => {
  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  return (
    <>
      {/* Background with subtle gradient and texture */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.04),transparent_50%)]"></div>
        
      
        <div className="relative mx-auto pt-16 pb-24 max-w-7xl px-6 sm:pt-24 sm:pb-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            
           
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600/10 to-indigo-600/10 px-4 py-2 text-sm font-medium text-violet-700 ring-1 ring-inset ring-violet-600/20 mb-8">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              AI-Powered Learning Experience
            </div>

            
            <h1 className="text-4xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
              <span className="block font-bold text-gray-700 text-3xl sm:text-4xl lg:text-5xl mb-4 tracking-wide">
                Meet Your
              </span>
              <span className="block bg-gradient-to-r from-pink-300 via-pink-500 to-pink-700 bg-clip-text text-transparent font-black leading-none">
                AI Tutor
              </span>
            </h1>

            <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl lg:text-[24px] text-gray-800 leading-relaxed font-semibold">
              Learn smarter, faster, and your way.
              <span className="block mt-2 text-base sm:text-lg text-gray-600">
                AI-crafted lessons tailored to your pace and passion.
              </span>
            </p>

            
            <div className="mt-12 w-full max-w-3xl mx-auto">
              <InitialInputArea
                promptValue={promptValue}
                handleInitialChat={handleInitialChat}
                setPromptValue={setPromptValue}
                handleChat={handleChat}
                ageGroup={ageGroup}
                setAgeGroup={setAgeGroup}
              />
            </div>

            {/* Premium suggestion pills */}
            <div className="mt-10 mb-16">
              <p className="text-sm font-medium text-gray-500 mb-6 tracking-wide uppercase">
                Popular Topics
              </p>
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {suggestions.map((item, index) => (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden cursor-pointer rounded-2xl bg-white/80 backdrop-blur-sm px-6 py-3 shadow-sm border border-gray-200/50 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white ${
                      index % 3 === 0 ? 'hover:border-violet-300' : 
                      index % 3 === 1 ? 'hover:border-indigo-300' : 'hover:border-blue-300'
                    }`}
                    onClick={() => handleClickSuggestion(item?.name)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClickSuggestion(item?.name);
                      }
                    }}
                  >
                    {/* Subtle hover gradient overlay */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                      index % 3 === 0 ? 'bg-gradient-to-r from-violet-600 to-purple-600' : 
                      index % 3 === 1 ? 'bg-gradient-to-r from-indigo-600 to-blue-600' : 
                      'bg-gradient-to-r from-blue-600 to-cyan-600'
                    }`}></div>
                    
                    <div className="relative flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        index % 3 === 0 ? 'bg-violet-100 text-violet-600' : 
                        index % 3 === 1 ? 'bg-indigo-100 text-indigo-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={16}
                          height={16}
                          className="flex-shrink-0"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                        {item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      
     
    </>
  );
};

export default Hero;