// 뉴스 기사 타입
export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  imageUrl: string | null
  source: string
  publishedAt: string
  category: Category
  isTranslated: boolean
  originalTitle?: string
  viewCount?: number
}

// 카테고리 타입 (관심종목 추가)
export type Category = 'stocks' | 'ai' | 'tech' | 'business' | 'science' | 'world'

// 카테고리 정보
export const CATEGORIES: Record<Category, { label: string; emoji: string; keywords: string[] }> = {
  stocks: {
    label: '관심 종목',
    emoji: '📈',
    keywords: ['Palantir', 'PLTR', '팔란티어', 'Palantir Technologies']
  },
  ai: {
    label: 'AI/ML',
    emoji: '🤖',
    keywords: ['AI', 'artificial intelligence', 'machine learning', 'GPT', 'LLM', 'OpenAI', 'ChatGPT', 'Claude', 'Gemini', '인공지능', '머신러닝']
  },
  tech: {
    label: 'Tech',
    emoji: '💻',
    keywords: ['technology', 'startup', 'Apple', 'Google', 'Microsoft', 'software', '기술', '스타트업', 'IT']
  },
  business: {
    label: 'Business',
    emoji: '💼',
    keywords: ['business', 'economy', 'stock', 'finance', '경제', '비즈니스', '주식', '금융']
  },
  science: {
    label: 'Science',
    emoji: '🔬',
    keywords: ['science', 'research', 'space', 'NASA', '과학', '연구', '우주']
  },
  world: {
    label: 'World',
    emoji: '🌍',
    keywords: ['world', 'international', 'global', '국제', '세계', '글로벌']
  }
}

// 카테고리 표시 순서
export const CATEGORY_ORDER: Category[] = ['stocks', 'ai', 'tech', 'business', 'science', 'world']

// 카테고리별 기사 수
export const ARTICLES_PER_CATEGORY = 5

// API 응답 타입
export interface NewsResponse {
  date: string
  updatedAt: string
  categories: Record<Category, NewsArticle[]>
}
