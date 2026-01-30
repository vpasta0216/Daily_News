import { NextResponse } from 'next/server'
import { fetchAllNewsFromNewsAPI } from '@/lib/newsapi'
import { fetchAllNewsFromNaver } from '@/lib/naver'
import { translateToKorean } from '@/lib/translate'
import { NewsArticle, Category, NewsResponse, CATEGORY_ORDER, ARTICLES_PER_CATEGORY } from '@/types/news'

// 글로벌 뉴스 번역
async function translateGlobalNews(articles: NewsArticle[]): Promise<NewsArticle[]> {
  const translated = await Promise.all(
    articles.map(async (article) => {
      // 이미 한국어면 번역하지 않음
      if (/[가-힣]/.test(article.title)) {
        return article
      }

      const translatedTitle = await translateToKorean(article.title)

      return {
        ...article,
        originalTitle: article.title,
        title: translatedTitle,
        isTranslated: true
      }
    })
  )

  return translated
}

// 뉴스 합치기 (글로벌 + 한국, 중복 제거)
async function mergeNews(
  globalNews: Record<Category, NewsArticle[]>,
  koreanNews: Record<Category, NewsArticle[]>
): Promise<Record<Category, NewsArticle[]>> {
  const result: Record<Category, NewsArticle[]> = {} as Record<Category, NewsArticle[]>

  for (const category of CATEGORY_ORDER) {
    const global = globalNews[category] || []
    const korean = koreanNews[category] || []

    // 글로벌 뉴스 번역
    const translatedGlobal = await translateGlobalNews(global.slice(0, 3))

    // 글로벌 3개 + 한국 2개 합치기 (총 5개)
    const merged = [...translatedGlobal, ...korean.slice(0, 2)]

    // 5개 미만이면 남은 것으로 채우기
    if (merged.length < ARTICLES_PER_CATEGORY) {
      const remaining = ARTICLES_PER_CATEGORY - merged.length
      const moreGlobal = await translateGlobalNews(global.slice(3, 3 + remaining))
      const moreKorean = korean.slice(2, 2 + remaining - moreGlobal.length)
      merged.push(...moreGlobal, ...moreKorean)
    }

    result[category] = merged.slice(0, ARTICLES_PER_CATEGORY)
  }

  return result
}

export async function GET() {
  try {
    // 병렬로 뉴스 가져오기
    const [globalNews, koreanNews] = await Promise.all([
      fetchAllNewsFromNewsAPI(),
      fetchAllNewsFromNaver()
    ])

    // 뉴스 합치기 (번역 포함)
    const mergedNews = await mergeNews(globalNews, koreanNews)

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
