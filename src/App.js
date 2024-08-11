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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 animate-pulse">Dictionary App</h1>
      <form onSubmit={handleSearch} className="w-full max-w-sm">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter a word"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg"
        >
          Search
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {results && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-3xl font-bold mb-2 uppercase flex items-center">
            {results[0].word}
            {results[0].phonetics && results[0].phonetics[0] && results[0].phonetics[0].audio && (
              <button
                onClick={() => playAudio(results[0].phonetics[0].audio)}
                className="ml-4  text-white p-2 rounded-full"
                title="Play pronunciation"
              >
                🔊
              </button>
            )}
          </h2>
          <p className="italic text-gray-600 mb-4">{results[0].phonetic}</p>
          
          <ul>
            {results[0].meanings.map((meaning, index) => (
              <li key={index} className="mb-4">
                <p className="font-bold text-xl">{meaning.partOfSpeech}</p>
                {meaning.definitions.map((definition, i) => (
                  <p key={i} className="ml-2">
                    - {definition.definition}
                    {definition.example && (
                      <span className="block text-gray-500 italic ml-4">
                       <span className='text-blue-700'> Example:</span> {definition.example}
                      </span>
                    )}
                  </p>
                ))}
                {meaning.synonyms && meaning.synonyms.length > 0 && (
                  <p className="mt-2 text-blue-700 text-lg">
                    Synonyms: <span className='text-gray-500'>{meaning.synonyms.join(', ')}</span>
                  </p>
                )}
                {meaning.antonyms && meaning.antonyms.length > 0 && (
                  <p className="mt-2 text-blue-700 text-lg">
                    Antonyms: <span className='text-gray-500'>{meaning.antonyms.join(', ')}</span>
                  </p>
                )}
                
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dictionary;
