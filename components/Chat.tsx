import ReactMarkdown from "react-markdown";
import FinalInputArea from "./FinalInputArea";
import { useEffect, useRef, useState } from "react";
import simpleLogo from "../public/simple-logo.png";
import Image from "next/image";

export default function Chat({
  messages,
  disabled,
  promptValue,
  setPromptValue,
  setMessages,
  handleChat,
  topic,
}: {
  messages: { role: string; content: string }[];
  disabled: boolean;
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  setMessages: React.Dispatch<
    React.SetStateAction<{ role: string; content: string }[]>
  >;
  handleChat: () => void;
  topic: string;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [didScrollToBottom, setDidScrollToBottom] = useState(true);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }

  useEffect(() => {
    if (didScrollToBottom) {
      scrollToBottom();
    }
  }, [didScrollToBottom, messages]);

  useEffect(() => {
    let el = scrollableContainerRef.current;
    if (!el) {
      return;
    }

    function handleScroll() {
      if (scrollableContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollableContainerRef.current;
        setDidScrollToBottom(scrollTop + clientHeight >= scrollHeight);
      }
    }

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
     <div className="flex grow flex-col gap-4 overflow-hidden bg-[#F9FAFB]">
    <div className="flex grow flex-col overflow-hidden px-4 lg:px-8 pt-4">
      <p className="uppercase text-sm tracking-wide text-gray-600 font-semibold">
        <b className="text-gray-800">Topic:</b> {topic}
      </p>

      <div
        ref={scrollableContainerRef}
        className="mt-4 overflow-y-scroll rounded-2xl border border-gray-200 bg-white px-4 py-6 lg:px-8 lg:py-8 shadow-sm scrollbar-thin scrollbar-thumb-gray-300"
      >
        {messages.length > 2 ? (
          <div className="prose-sm max-w-5xl lg:prose lg:max-w-full">
            {messages.slice(2).map((message, index) =>
              message.role === "assistant" ? (
                <div className="relative w-full mb-6" key={index}>
                  <Image
                    src={simpleLogo}
                    alt=""
                    className="absolute left-0 top-0 size-7 rounded-full"
                  />
                  <ReactMarkdown className="w-full pl-10 text-gray-800 leading-relaxed">
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p
                  key={index}
                  className="ml-auto w-fit max-w-[90%] rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-md"
                >
                  {message.content}
                </p>
              )
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex w-full flex-col gap-4 py-5">
            {Array.from(Array(10).keys()).map((i) => (
              <div
                key={i}
                className={`${
                  i < 5 && "hidden sm:block"
                } h-4 animate-pulse rounded-lg bg-gray-300`}
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="bg-white px-4 lg:px-8 pb-4">
      <FinalInputArea
        disabled={disabled}
        promptValue={promptValue}
        setPromptValue={setPromptValue}
        handleChat={handleChat}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  </div>
  );
}
