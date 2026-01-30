import { NextResponse } from 'next/server'
import { fetchAllNewsFromNewsAPI } from '@/lib/newsapi'
import { fetchAllNewsFromNaver } from '@/lib/naver'
import { NewsArticle, Category, NewsResponse, CATEGORY_ORDER, ARTICLES_PER_CATEGORY } from '@/types/news'

// 뉴스 합치기 (글로벌 + 한국, 중복 제거)
function mergeNews(
  globalNews: Record<Category, NewsArticle[]>,
  koreanNews: Record<Category, NewsArticle[]>
): Record<Category, NewsArticle[]> {
  return CATEGORY_ORDER.reduce((acc, category) => {
    const global = globalNews[category] || []
    const korean = koreanNews[category] || []

    // 글로벌 뉴스에 번역 필요 표시
    const globalWithFlag = global.map(article => ({
      ...article,
      isTranslated: false,
      originalTitle: article.title
    }))

    // 글로벌 3개 + 한국 2개 합치기 (총 5개)
    const merged = [...globalWithFlag.slice(0, 3), ...korean.slice(0, 2)]

    // 5개 미만이면 남은 것으로 채우기
    if (merged.length < ARTICLES_PER_CATEGORY) {
      const remaining = ARTICLES_PER_CATEGORY - merged.length
      const moreGlobal = globalWithFlag.slice(3, 3 + remaining)
      const moreKorean = korean.slice(2, 2 + remaining - moreGlobal.length)
      merged.push(...moreGlobal, ...moreKorean)
    }

    acc[category] = merged.slice(0, ARTICLES_PER_CATEGORY)
    return acc
  }, {} as Record<Category, NewsArticle[]>)
}

export async function GET() {
  try {
    // 병렬로 뉴스 가져오기
    const [globalNews, koreanNews] = await Promise.all([
      fetchAllNewsFromNewsAPI(),
      fetchAllNewsFromNaver()
    ])

    // 뉴스 합치기
    const mergedNews = mergeNews(globalNews, koreanNews)

    const response: NewsResponse = {
      date: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      categories: mergedNews
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('뉴스 가져오기 실패:', error)
    return NextResponse.json(
      { error: '뉴스를 가져오는데 실패했습니다' },
      { status: 500 }
    )
  }
}
