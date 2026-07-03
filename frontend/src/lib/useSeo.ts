import { useEffect } from 'react'

type Seo = {
  title: string
  description?: string
  path?: string
  image?: string
}

const BASE_URL = 'https://ncpbuild.com'
const SITE_NAME = 'NCP Contracting'

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  let el = document.head.querySelector(selector) as HTMLElement | null
  if (!el) return
  el.setAttribute(attr, value)
}

export function useSeo({ title, description, path, image }: Seo) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME
    document.title = fullTitle

    if (description) {
      setMeta('meta[name="description"]', 'content', description)
      setMeta('meta[name="twitter:description"]', 'content', description)
      setMeta('meta[property="og:description"]', 'content', description)
    }

    const url = `${BASE_URL}${path ?? ''}`
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)

    if (image) {
      const abs = image.startsWith('http') ? image : `${BASE_URL}${image}`
      setMeta('meta[property="og:image"]', 'content', abs)
      setMeta('meta[name="twitter:image"]', 'content', abs)
    }
  }, [title, description, path, image])
}
