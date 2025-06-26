'use client';

import { ChatInput } from './components/chat-input';
import { ChatMessage } from './components/chat-message';
import { Header } from './components/header';
import { useChat } from './hooks/use-chat';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, model, handleModelChange, optimisticMessages } = useChat();

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <Header model={model} handleModelChange={handleModelChange} />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {optimisticMessages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </div>
      </main>
      <footer className="p-4 border-t dark:border-gray-700">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </footer>
    </div>
  );
}