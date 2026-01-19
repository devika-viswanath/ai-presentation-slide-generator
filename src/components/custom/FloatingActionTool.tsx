import React, { useState } from 'react'
import { Loader2, Sparkles, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

type Props = {
  position: { x: number; y: number } | null
  onClose: () => void
  loading: boolean
  handleAiChange: (value: string) => void
}

function FloatingActionTool({ position, onClose, loading, handleAiChange }: Props) {
  const [inputValue, setInputValue] = useState('')

  if (!position) return null

  const handleSubmit = () => {
    if (inputValue.trim()) {
      handleAiChange(inputValue)
      setInputValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit()
    }
  }

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-xl border p-3 min-w-[300px]"
      style={{
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.min(position.y + 10, window.innerHeight - 150),
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-purple-500" />
          AI Edit
        </span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Describe the change..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="flex-1 text-sm"
        />
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={loading || !inputValue.trim()}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      <div className="mt-2 flex flex-wrap gap-1">
        {['Change color', 'Make bigger', 'Add icon', 'Change text'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInputValue(suggestion)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
            disabled={loading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FloatingActionTool
