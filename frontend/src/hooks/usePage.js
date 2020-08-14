import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useKirbyApi } from './useKirbyApi'
import { useAnnouncer } from './useAnnouncer'

/**
 * Hook for the corresponding page of the current path
 *
 * @returns {object} Current page object
 */
export const usePage = () => {
  const { path } = useRoute()
  const { getPage } = useKirbyApi()
  const { setAnnouncer } = useAnnouncer()

  // Setup reactive `page` object with some commonly used keys
  const page = reactive({
    title: null,
    metaTitle: null,
    children: null,
    text: null
  })

  // Setup up page waiter
  let resolve
  let promise = new Promise(r => { // eslint-disable-line promise/param-names
    resolve = r
  })

  /**
   * Define a promise to wait for until the page data is available
   *
   * @example
   * const page = usePage()
   * (async () => {
   *   await page.isLoaded
   *   console.log(page.title)
   * })()
   */
  Object.defineProperty(page, 'isLoaded', {
    get: () => promise
  })

  ;(async () => {
    // Get page from cache or freshly fetch it
    const data = await getPage(path)
    if (!data) return

    // Append page data to reactive page object
    Object.assign(page, data)

    // Set document title
    document.title = page.metaTitle

    // Announce new route
    setAnnouncer(`Navigated to ${page.title}`)

    // Flush page waiter
    resolve && resolve()
    resolve = undefined
    promise = undefined
  })()

  return page
}
