'use client'

import { NewsArticle, Category, CATEGORIES } from '@/types/news'
import NewsCard from './NewsCard'

interface CategorySectionProps {
  category: Category
  articles: NewsArticle[]
}

export default function CategorySection({ category, articles }: CategorySectionProps) {
  const categoryInfo = CATEGORIES[category]

  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <section className="mb-8">
      {/* 카테고리 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{categoryInfo.emoji}</span>
        <h2 className="text-xl font-bold text-gray-800">{categoryInfo.label}</h2>
        <span className="text-sm text-gray-400">Top {articles.length}</span>
      </div>

      {/* 뉴스 카드 목록 */}
      <div className="space-y-3">
        {articles.map((article, index) => (
          <NewsCard key={article.id} article={article} index={index} />
        ))}
      </div>
    </section>
  )
}
