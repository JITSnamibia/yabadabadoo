import React from 'react';

interface HeaderProps {
  model: string;
  handleModelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function Header({ model, handleModelChange }: HeaderProps) {
  return (
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
  );
}