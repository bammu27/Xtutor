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

  const handleInitialChat = async () => {
    setShowResult(true);
    setLoading(true);
    setTopic(inputValue);
    
    await handleSourcesAndChat(inputValue);
    
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

  return (
    <>
      <Header />
      
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
          />
        )}
      </main>
    </>
  );
}