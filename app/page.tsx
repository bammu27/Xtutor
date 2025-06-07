"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Sources from "@/components/Sources";
import Chat from "@/components/Chat";
import { useState } from "react";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { getSystemPrompt } from "@/utils/utils";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [topic, setTopic] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sources, setSources] = useState<{ name: string; url: string }[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [ageGroup, setAgeGroup] = useState("Middle School");
  
  // New state for YouTube mode
  const [isYouTubeMode, setIsYouTubeMode] = useState(false);

  const handleInitialChat = async () => {
    setShowResult(true);
    setLoading(true);
    setTopic(inputValue);
    
    if (isYouTubeMode) {
      await handleYouTubeChat(inputValue);
    } else {
      await handleSourcesAndChat(inputValue);
    }
    
    setInputValue("");
    setLoading(false);
  };

  const handleChat = async (messages?: { role: string; content: string }[]) => {
    setLoading(true);
    const chatRes = await fetch("/api/getChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!chatRes.ok) throw new Error(chatRes.statusText);

    const data = chatRes.body;
    if (!data) return;

    let fullAnswer = "";
    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          fullAnswer += text;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last.role === "assistant") {
              return [...prev.slice(0, -1), { ...last, content: last.content + text }];
            } else {
              return [...prev, { role: "assistant", content: text }];
            }
          });
        } catch (e) {
          console.error(e);
        }
      }
    };

    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunk = decoder.decode(value);
      parser.feed(chunk);
    }
    setLoading(false);
  };

  // New function to handle YouTube chat
  const handleYouTubeChat = async (url: string) => {
    setIsLoadingSources(true);
    setSources([]); // Clear sources for YouTube mode
    
    try {
      const youtubeRes = await fetch("/api/getYouTubeExplanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, ageGroup }),
      });

      if (!youtubeRes.ok) {
        const errorData = await youtubeRes.json();
        throw new Error(errorData.error || "Failed to process YouTube video");
      }

      setIsLoadingSources(false);

      // Set initial message for YouTube explanation
      const initialMessage = {
        role: "user" as const,
        content: `Explain the concepts from this YouTube video: ${url}`
      };
      setMessages([initialMessage]);

      // Handle streaming response
      const data = youtubeRes.body;
      if (!data) return;

      let fullAnswer = "";
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;
          try {
            const text = JSON.parse(data).text ?? "";
            fullAnswer += text;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === "assistant") {
                return [...prev.slice(0, -1), { ...last, content: last.content + text }];
              } else {
                return [...prev, { role: "assistant", content: text }];
              }
            });
          } catch (e) {
            console.error(e);
          }
        }
      };

      const reader = data.getReader();
      const decoder = new TextDecoder();
      const parser = createParser(onParse);
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value);
        parser.feed(chunk);
      }

    } catch (error) {
      console.error("YouTube processing error:", error);
      setIsLoadingSources(false);
      setMessages([
        {
          role: "user",
          content: `Explain the concepts from this YouTube video: ${url}`
        },
        {
          role: "assistant",
          content: `Sorry, I couldn't process this YouTube video. ${error instanceof Error ? error.message : 'Please make sure the URL is valid and the video has captions available.'}`
        }
      ]);
    }
  };

  async function handleSourcesAndChat(question: string) {
    setIsLoadingSources(true);
    const sourcesResponse = await fetch("/api/getSources", {
      method: "POST",
      body: JSON.stringify({ question }),
    });

    let sources = [];
    if (sourcesResponse.ok) sources = await sourcesResponse.json();
    setSources(sources);
    setIsLoadingSources(false);

    const parsedSourcesRes = await fetch("/api/getParsedSources", {
      method: "POST",
      body: JSON.stringify({ sources }),
    });
    const parsedSources = parsedSourcesRes.ok ? await parsedSourcesRes.json() : [];

    const initialMessages = [
      { role: "system", content: getSystemPrompt(parsedSources, ageGroup) },
      { role: "user", content: question },
    ];
    setMessages(initialMessages);
    await handleChat(initialMessages);
  }

  // Function to toggle between modes
  const toggleMode = () => {
    setIsYouTubeMode(!isYouTubeMode);
    setShowResult(false);
    setInputValue("");
    setTopic("");
    setSources([]);
    setMessages([]);
  };

  return (
    <>
      <Header />
      
      {/* Mode Toggle Button */}
      <div className="flex items-center justify-center gap-4 px-4 py-2">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={toggleMode}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isYouTubeMode
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Search Mode
          </button>
          <button
            onClick={toggleMode}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isYouTubeMode
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📺 YouTube Mode
          </button>
        </div>
      </div>

      <main
        className={`flex grow flex-col px-4 pb-4 ${showResult ? "overflow-hidden" : ""}`}
      >
        {showResult ? (
          <div className="mt-2 flex w-full grow flex-col justify-between overflow-hidden">
            <div className="flex w-full grow flex-col space-y-2 overflow-hidden">
              <div className="mx-auto flex w-full max-w-7xl grow flex-col gap-4 overflow-hidden lg:flex-row lg:gap-10">
                <Chat
                  messages={messages}
                  disabled={loading}
                  promptValue={inputValue}
                  setPromptValue={setInputValue}
                  setMessages={setMessages}
                  handleChat={handleChat}
                  topic={topic}
                />
                <Sources sources={sources} isLoading={isLoadingSources} />
              </div>
            </div>
          </div>
        ) : (
          <Hero
            promptValue={inputValue}
            setPromptValue={setInputValue}
            handleChat={handleChat}
            ageGroup={ageGroup}
            setAgeGroup={setAgeGroup}
            handleInitialChat={handleInitialChat}
            isYouTubeMode={isYouTubeMode} // Pass YouTube mode to Hero
          />
        )}
      </main>
    </>
  );
}