import { useState, useEffect } from 'react'
import './ChatWidget.css'

const CHAT_HISTORY_KEY = 'maps_chat_history'

export default function ChatWidget({ userLocation, trafficEnabled, weatherEnabled, onWeatherToggle }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! Ask me about nearby places, routes, traffic, or weather. I remember our conversation!',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY)
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory)
        setMessages(history)
      } catch (error) {
        console.error('Failed to load chat history:', error)
      }
    }
  }, [])

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages))
  }, [messages])

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all chat history?')) {
      setMessages([
        {
          role: 'assistant',
          content: 'Chat history cleared. Hi! Ask me about nearby places, routes, traffic, or weather.',
        },
      ])
      localStorage.removeItem(CHAT_HISTORY_KEY)
    }
  }

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const nextMessages = [...messages, { role: 'user', content: trimmed }]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          context: {
            lat: userLocation?.lat,
            lng: userLocation?.lng,
            trafficEnabled,
            weatherEnabled,
          },
        }),
      })
      const data = await response.json()
      const reply = data?.message || 'Sorry, I could not answer that.'
      
      // Handle AI actions
      if (data?.actions && Array.isArray(data.actions)) {
        data.actions.forEach((action) => {
          if (action.type === 'show_weather' && onWeatherToggle) {
            onWeatherToggle(true)
          }
        })
      }
      
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Chat is unavailable right now.' },
      ])
    }
    setIsLoading(false)
  }

  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✖' : '💬'}
      </button>

      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <span>🤖 AI Maps Assistant</span>
            <button className="clear-btn" onClick={handleClearHistory} title="Clear chat history">
              🗑️
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                className={`chat-bubble ${msg.role}`}
              >
                {msg.role === 'user' ? '👤 ' : '🤖 '}
                {msg.content}
              </div>
            ))}
            {isLoading && <div className="chat-bubble assistant">⏳ Thinking...</div>}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about traffic, weather, routes..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading}>
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
