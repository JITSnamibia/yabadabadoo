'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('meta-llama/llama-4-maverick:free');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages, model }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              const json = JSON.parse(data);
              if (json.choices && json.choices[0].delta.content) {
                assistantResponse += json.choices[0].delta.content;
                setMessages((prev) => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage.role === 'assistant') {
                    return [
                      ...prev.slice(0, -1),
                      { ...lastMessage, content: assistantResponse },
                    ];
                  }
                  return prev;
                });
              }
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'An error occurred. Please try again.' },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Chat</h1>
        <select
          value={model}
          onChange={handleModelChange}
          className="p-2 rounded bg-gray-200 dark:bg-gray-800 text-white"
        >
          <option value="meta-llama/llama-4-maverick:free">Llama 4 Maverick</option>
          <option value="qwen/qwen3-235b-a22b:free">Qwen3 235B</option>
          <option value="deepseek/deepseek-r1-0528:free">Deepseek R1</option>
        </select>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`p-3 rounded-lg max-w-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="p-4 border-t dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-l-lg border dark:border-gray-700 dark:bg-gray-800"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
