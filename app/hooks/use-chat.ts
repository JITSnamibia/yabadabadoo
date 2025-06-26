import { useState, useOptimistic, FormEvent } from 'react';
import { useChat as useAiChat } from 'ai/react';

export function useChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [optimisticMessages, setOptimisticMessages] = useOptimistic(messages);

  const {
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    error,
    model,
    handleModelChange,
  } = useAiChat({
    onFinish: (message) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: message.content }]);
    },
    body: {
      model: model,
    }
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setOptimisticMessages([...messages, { role: 'user', content: input }]);
    originalHandleSubmit(e);
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    model,
    handleModelChange,
    optimisticMessages
  };
}