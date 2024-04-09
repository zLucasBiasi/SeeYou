'use client'
import { useState } from "react";

export default function Home() {
  const [link, setLink] = useState('');

  const handleClick = () => {
    // Substitua 'localhost:3000' pelo seu domínio real
    const baseUrl = 'http://localhost:3000';
    const newUrl = `${baseUrl}/${link}`;
    window.open(newUrl, '_blank');
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-8">Gerador de Link</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Digite seu link aqui..."
            className="border text-black border-gray-300 px-4 py-2 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={({ target }) => setLink(target.value)}
          />
        </div>
        <div>
          <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Gerar
          </button>
        </div>
      </div>
    </div>
  );
}
