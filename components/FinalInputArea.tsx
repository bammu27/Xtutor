import { FC, KeyboardEvent } from "react";
import TypeAnimation from "./TypeAnimation";
import Image from "next/image";

type TInputAreaProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  messages: { role: string; content: string }[];
  setMessages: React.Dispatch<
    React.SetStateAction<{ role: string; content: string }[]>
  >;
  handleChat: (messages?: { role: string; content: string }[]) => void;
};

const FinalInputArea: FC<TInputAreaProps> = ({
  promptValue,
  setPromptValue,
  disabled,
  messages,
  setMessages,
  handleChat,
}) => {
  function onSubmit() {
    let latestMessages = [...messages, { role: "user", content: promptValue }];
    setPromptValue("");
    setMessages(latestMessages);
    handleChat(latestMessages);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        onSubmit();
      }
    }
  };

  return (
    <form
  className="mx-auto flex w-full items-center justify-between"
  onSubmit={(e) => {
    e.preventDefault();
    onSubmit();
  }}
>
  <div className="flex w-full rounded-lg border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
    <textarea
      placeholder="Follow up question"
      className="block w-full resize-none rounded-l-lg border-0 p-5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-base leading-relaxed"
      disabled={disabled}
      value={promptValue}
      onKeyDown={handleKeyDown}
      required
      onChange={(e) => setPromptValue(e.target.value)}
      rows={1}
    />
  </div>
  <button
    disabled={disabled}
    type="submit"
    className="relative ml-3 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:pointer-events-none disabled:opacity-50 transition"
  >
    {disabled && (
      <div className="absolute inset-0 flex items-center justify-center">
        <TypeAnimation />
      </div>
    )}

    <Image
      unoptimized
      src={"/up-arrow.svg"}
      alt="send"
      width={24}
      height={24}
      className={disabled ? "invisible" : ""}
    />
  </button>
</form>
  );
};

export default FinalInputArea;
