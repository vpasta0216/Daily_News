'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import CategorySection from '@/components/CategorySection'
import { NewsResponse, CATEGORY_ORDER } from '@/types/news'

export default function Home() {
  const [newsData, setNewsData] = useState<NewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news')
        if (!response.ok) {
          throw new Error('뉴스를 가져오는데 실패했습니다')
        }
        const data: NewsResponse = await response.json()
        setNewsData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">뉴스를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 에러
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">😢 {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  // 데이터 없음
  if (!newsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">뉴스가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header date={newsData.date} updatedAt={newsData.updatedAt} />

      <main className="max-w-2xl mx-auto px-4 pb-8">
        {CATEGORY_ORDER.map((category) => (
          <CategorySection
            key={category}
            category={category}
            articles={newsData.categories[category] || []}
          />
        ))}
      </main>

      {/* 푸터 */}
      <footer className="text-center py-6 text-sm text-gray-400">
        <p>AI News Daily - 매일 아침 6:30 업데이트</p>
        <p className="mt-1">
          Powered by NewsAPI & 네이버 뉴스
        </p>
      </footer>
    </div>
  )
}
