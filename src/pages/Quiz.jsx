import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'

const colors = {
  cream: '#F5F0E8',
  parchment: '#EDE6D8',
  sand: '#D8CCBA',
  tan: '#C8B89A',
  gold: '#9E8660',
  mid: '#7A6E62',
  charcoal: '#3A3630',
  ink: '#1E1C18',
  white: '#FDFAF5',
}

const questions = [
  {
    id: 'pull',
    question: "What's pulling you toward a trip?",
    options: [
      { value: 'escape', label: 'Escape' },
      { value: 'culture', label: 'Culture' },
      { value: 'food', label: 'Food' },
      { value: 'adventure', label: 'Adventure' },
    ],
  },
  {
    id: 'party',
    question: "Who's coming with you?",
    options: [
      { value: 'solo', label: 'Solo' },
      { value: 'partner', label: 'Partner' },
      { value: 'friends', label: 'Friends' },
      { value: 'family', label: 'Family' },
    ],
  },
  {
    id: 'length',
    question: "How long are you going?",
    options: [
      { value: 'weekend', label: 'Weekend' },
      { value: 'one week', label: 'One week' },
      { value: 'two weeks', label: 'Two weeks' },
      { value: 'open-ended', label: 'Open-ended' },
    ],
  },
  {
    id: 'budget',
    question: "What's your budget vibe?",
    options: [
      { value: 'budget', label: 'Budget' },
      { value: 'mid-range', label: 'Mid-range' },
      { value: 'splurge', label: 'Splurge' },
      { value: 'flexible', label: 'Flexible' },
    ],
  },
  {
    id: 'pace',
    question: "What's your pace?",
    options: [
      { value: 'slow and deep', label: 'Slow and deep' },
      { value: 'balanced', label: 'Balanced' },
      { value: 'packed', label: 'Packed' },
      { value: 'spontaneous', label: 'Spontaneous' },
    ],
  },
  {
    id: 'place',
    question: "What kind of place draws you?",
    options: [
      { value: 'coastal', label: 'Coastal' },
      { value: 'city', label: 'City' },
      { value: 'mountains', label: 'Mountains' },
      { value: 'countryside', label: 'Countryside' },
    ],
  },
  {
    id: 'feel',
    question: "What do you want to feel?",
    options: [
      { value: 'inspired', label: 'Inspired' },
      { value: 'rested', label: 'Rested' },
      { value: 'connected', label: 'Connected' },
      { value: 'challenged', label: 'Challenged' },
    ],
  },
]

export default function Quiz() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)

  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  const handleSelect = (value) => {
    setSelected(value)
  }

  const handleNext = () => {
    if (!selected) return
    const newAnswers = { ...answers, [q.id]: selected }
    setAnswers(newAnswers)

    if (current < questions.length - 1) {
      setCurrent(current + 1)
      setSelected(null)
    } else {
      navigate('/quiz/result', { state: { answers: newAnswers } })
    }
  }

  const isLast = current === questions.length - 1

  return (
    <div style={{ backgroundColor: colors.cream, minHeight: '100vh' }}>
      <Nav />
      <div style={{
        paddingTop: '60px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Progress bar */}
        <div style={{ height: '2px', backgroundColor: colors.sand }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: colors.gold,
            transition: 'width 0.4s ease',
          }} />
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem 2rem',
          maxWidth: '620px',
          margin: '0 auto',
          width: '100%',
        }}>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: colors.tan,
            marginBottom: '0.75rem',
          }}>
            {current + 1} of {questions.length}
          </p>

          <h2 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: '400',
            color: colors.ink,
            lineHeight: '1.3',
            marginBottom: '2.5rem',
          }}>
            {q.question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem' }}>
            {q.options.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: '300',
                  color: selected === opt.value ? colors.white : colors.charcoal,
                  backgroundColor: selected === opt.value ? colors.gold : colors.white,
                  border: `1px solid ${selected === opt.value ? colors.gold : colors.sand}`,
                  padding: '1rem 1.5rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!selected}
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.white,
              backgroundColor: selected ? colors.gold : colors.sand,
              border: 'none',
              padding: '1rem 2rem',
              cursor: selected ? 'pointer' : 'not-allowed',
              alignSelf: 'flex-start',
              transition: 'background-color 0.15s ease',
            }}
          >
            {isLast ? 'See My Match' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
