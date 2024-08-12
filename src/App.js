import React, { useState } from 'react';
import axios from 'axios';

const Dictionary = () => {
  const [word, setWord] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const fetchDefinition = async () => {
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      setResults(response.data);
      setError(''); // Clear any previous errors
    } catch (err) {
      setResults(null);
      setError('Word not found. Please try a different word.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (word.trim() !== '') {
      fetchDefinition();
    }
  };

  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.volume = 1.0; // Set volume to maximum
    audio.play();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
          Dictionary App
        </h1>
        <form onSubmit={handleSearch} className="w-full">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a word"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-500 transition duration-300 ease-in-out"
          >
            Search
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {results && (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 uppercase flex items-center justify-center">
              {results[0].word}
              {results[0].phonetics && results[0].phonetics[0] &&( results[0].phonetics[0].audio || results[0].phonetics[1].audio )&& (
                <button
                  onClick={() => playAudio(results[0].phonetics[0].audio || results[0].phonetics[1].audio)}
                  className="ml-4 bg-blue-500 hover:bg-purple-500 text-white p-2 rounded-full transition duration-300 ease-in-out"
                  title="Play pronunciation"
                >
                  🔊
                </button>
              )}
            </h2>
            <p className="italic text-gray-600 mb-6 text-center">{results[0].phonetic}</p>
            
            <ul className="space-y-6">
              {results[0].meanings.map((meaning, index) => (
                <li key={index} className="mb-4">
                  <p className="font-bold text-xl text-purple-700 mb-2">{meaning.partOfSpeech}</p>
                  {meaning.definitions.map((definition, i) => (
                    <p key={i} className="ml-2 mb-4">
                      <span className="font-semibold text-gray-700">- {definition.definition}</span>
                      {definition.example && (
                        <span className="block text-gray-500 italic ml-4">
                          <span className='text-blue-700'>Example:</span> {definition.example}
                        </span>
                      )}
                    </p>
                  ))}
                  {meaning.synonyms && meaning.synonyms.length > 0 && (
                    <p className="mt-2 text-lg">
                      <span className="text-blue-700 font-semibold">Synonyms:</span> 
                      <span className='text-gray-600'> {meaning.synonyms.join(', ')}</span>
                    </p>
                  )}
                  {meaning.antonyms && meaning.antonyms.length > 0 && (
                    <p className="mt-2 text-lg">
                      <span className="text-blue-700 font-semibold">Antonyms:</span> 
                      <span className='text-gray-600'> {meaning.antonyms.join(', ')}</span>
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary;
