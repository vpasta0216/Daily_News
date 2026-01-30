'use client'

interface HeaderProps {
  date: string
  updatedAt: string
}

export default function Header({ date, updatedAt }: HeaderProps) {
  const formattedDate = new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  const formattedTime = new Date(updatedAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-4 mb-6 rounded-b-2xl shadow-lg">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🤖</span>
          <h1 className="text-2xl font-bold">AI News Daily</h1>
        </div>
        <p className="text-blue-100">{formattedDate}</p>
        <p className="text-sm text-blue-200 mt-1">
          마지막 업데이트: {formattedTime}
        </p>
      </div>
    </header>
  )
}
