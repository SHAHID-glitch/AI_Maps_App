import { useEffect, useRef, useState } from 'react'
import './SearchBar.css'

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)
  const recognitionRef = useRef(null)

  const handleSearch = () => {
    onSearch(query)
  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setVoiceSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setQuery(transcript)
      onSearch(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
    }
  }, [onSearch])

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current || !voiceSupported) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    setIsListening(true)
    recognitionRef.current.start()
  }

  return (
    <div className="search-section">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search places..."
        className="search-input"
        disabled={isLoading}
      />
      <button
        onClick={handleSearch}
        className="search-btn"
        disabled={isLoading}
      >
        {isLoading ? '⏳' : '🔍'}
      </button>
      <button
        onClick={toggleVoiceSearch}
        className={`voice-btn ${isListening ? 'listening' : ''}`}
        disabled={!voiceSupported || isLoading}
        title={voiceSupported ? 'Voice search' : 'Voice not supported'}
      >
        {isListening ? '🎤' : '🗣️'}
      </button>
    </div>
  )
}
