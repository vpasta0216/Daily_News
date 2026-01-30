// 무료 번역 API (MyMemory)
const TRANSLATE_API = 'https://api.mymemory.translated.net/get'

// 영어 → 한국어 번역
export async function translateToKorean(text: string): Promise<string> {
  if (!text) return ''

  // 이미 한국어면 번역하지 않음
  if (/[가-힣]/.test(text)) {
    return text
  }

  try {
    const response = await fetch(
      `${TRANSLATE_API}?q=${encodeURIComponent(text)}&langpair=en|ko`
    )

    if (!response.ok) {
      console.error('번역 API 오류:', response.status)
      return text
    }

    const data = await response.json()

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText
    }

    return text
  } catch (error) {
    console.error('번역 실패:', error)
    return text
  }
}

// 여러 텍스트 번역 (병렬 처리)
export async function translateMultiple(texts: string[]): Promise<string[]> {
  const results = await Promise.all(
    texts.map(text => translateToKorean(text))
  )
  return results
}
