'use client'

import { NewsArticle } from '@/types/news'

interface NewsCardProps {
  article: NewsArticle
  index: number
}

// 시간 차이 계산
function getTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) return '방금 전'
  if (diffHours < 24) return `${diffHours}시간 전`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}일 전`

  return date.toLocaleDateString('ko-KR')
}

export default function NewsCard({ article, index }: NewsCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className="flex gap-4">
        {/* 순위 번호 */}
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
          {index + 1}
        </div>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
            {article.title}
          </h3>

          {/* 설명 */}
          {article.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
              {article.description}
            </p>
          )}

          {/* 메타 정보 */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="font-medium">{article.source}</span>
            <span>•</span>
            <span>{getTimeAgo(article.publishedAt)}</span>
            {article.isTranslated && (
              <>
                <span>•</span>
                <span className="text-blue-500">🌐 번역됨</span>
              </>
            )}
          </div>
        </div>

        {/* 이미지 */}
        {article.imageUrl && (
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}
      </div>
    </a>
  )
}
