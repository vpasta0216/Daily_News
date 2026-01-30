import { NewsArticle, Category, CATEGORIES, CATEGORY_ORDER, ARTICLES_PER_CATEGORY } from '@/types/news'

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET
const NAVER_API_URL = 'https://openapi.naver.com/v1/search/news.json'

interface NaverNewsItem {
  title: string
  originallink: string
  link: string
  description: string
  pubDate: string
}

interface NaverNewsResponse {
  lastBuildDate: string
  total: number
  start: number
  display: number
  items: NaverNewsItem[]
}

// HTML 태그 제거
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
}

// 네이버 뉴스 가져오기
export async function fetchNewsFromNaver(category: Category): Promise<NewsArticle[]> {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.error('네이버 API 키가 없습니다')
    return []
  }

  // 한국어 키워드 우선, 없으면 영어 키워드 사용
  const koreanKeywords = CATEGORIES[category].keywords.filter(k => /[가-힣]/.test(k))
  const query = koreanKeywords.length > 0 ? koreanKeywords[0] : CATEGORIES[category].keywords[0]

  try {
    const response = await fetch(
      `${NAVER_API_URL}?query=${encodeURIComponent(query)}&display=${ARTICLES_PER_CATEGORY}&sort=sim`,
      {
        headers: {
          'X-Naver-Client-Id': NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
        }
      }
    )

    if (!response.ok) {
      console.error('네이버 API 오류:', response.status)
      return []
    }

    const data: NaverNewsResponse = await response.json()

    return data.items.map((item, index) => ({
      id: `naver-${category}-${index}-${Date.now()}`,
      title: stripHtml(item.title),
      description: stripHtml(item.description),
      url: item.originallink || item.link,
      imageUrl: null,
      source: '네이버 뉴스',
      publishedAt: new Date(item.pubDate).toISOString(),
      category,
      isTranslated: false
    }))
  } catch (error) {
    console.error('네이버 API 요청 실패:', error)
    return []
  }
}

// 모든 카테고리 네이버 뉴스 가져오기
export async function fetchAllNewsFromNaver(): Promise<Record<Category, NewsArticle[]>> {
  const results = await Promise.all(
    CATEGORY_ORDER.map(async (category) => {
      const articles = await fetchNewsFromNaver(category)
      return { category, articles }
    })
  )

  return results.reduce((acc, { category, articles }) => {
    acc[category] = articles
    return acc
  }, {} as Record<Category, NewsArticle[]>)
}
