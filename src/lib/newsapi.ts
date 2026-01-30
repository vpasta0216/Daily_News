import { NewsArticle, Category, CATEGORIES, CATEGORY_ORDER, ARTICLES_PER_CATEGORY } from '@/types/news'

const NEWSAPI_KEY = process.env.NEWSAPI_KEY
const NEWSAPI_URL = 'https://newsapi.org/v2'

interface NewsAPIArticle {
  title: string
  description: string
  url: string
  urlToImage: string | null
  source: { name: string }
  publishedAt: string
}

interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: NewsAPIArticle[]
}

// NewsAPI에서 뉴스 가져오기
export async function fetchNewsFromNewsAPI(category: Category): Promise<NewsArticle[]> {
  if (!NEWSAPI_KEY) {
    console.error('NewsAPI 키가 없습니다')
    return []
  }

  const keywords = CATEGORIES[category].keywords.slice(0, 3).join(' OR ')

  try {
    const response = await fetch(
      `${NEWSAPI_URL}/everything?q=${encodeURIComponent(keywords)}&language=en&sortBy=popularity&pageSize=10`,
      {
        headers: {
          'X-Api-Key': NEWSAPI_KEY
        }
      }
    )

    if (!response.ok) {
      console.error('NewsAPI 오류:', response.status)
      return []
    }

    const data: NewsAPIResponse = await response.json()

    return data.articles
      .filter(article => article.title && article.title !== '[Removed]')
      .slice(0, ARTICLES_PER_CATEGORY)
      .map((article, index) => ({
        id: `newsapi-${category}-${index}-${Date.now()}`,
        title: article.title,
        description: article.description || '',
        url: article.url,
        imageUrl: article.urlToImage,
        source: article.source.name,
        publishedAt: article.publishedAt,
        category,
        isTranslated: false
      }))
  } catch (error) {
    console.error('NewsAPI 요청 실패:', error)
    return []
  }
}

// 모든 카테고리 뉴스 가져오기
export async function fetchAllNewsFromNewsAPI(): Promise<Record<Category, NewsArticle[]>> {
  const results = await Promise.all(
    CATEGORY_ORDER.map(async (category) => {
      const articles = await fetchNewsFromNewsAPI(category)
      return { category, articles }
    })
  )

  return results.reduce((acc, { category, articles }) => {
    acc[category] = articles
    return acc
  }, {} as Record<Category, NewsArticle[]>)
}
