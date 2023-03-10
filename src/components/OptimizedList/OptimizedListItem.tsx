import { type FunctionComponent, type ReactNode } from 'react'
import { type OptimizedListContextInterface } from './OptimizedList'
import { memo, useCallback, useContext, useEffect, useRef } from 'react'
import { OptimizedListContext } from './OptimizedList'

export interface Props {
  children: ReactNode
  index: number
}

export const listItemClassname = 'ro-list-item'

const getElementHeight: (el: HTMLElement) => number = (el) => {
  const computedStyle = window.getComputedStyle(el)
  let height = el.clientHeight

  height += parseInt(computedStyle.marginTop, 10)
  height += parseInt(computedStyle.marginBottom, 10)
  height += parseInt(computedStyle.borderTopWidth, 10)
  height += parseInt(computedStyle.borderBottomWidth, 10)

  return height
}

export type TOptimizedListItem = FunctionComponent<Props>

const OptimizedListItem: FunctionComponent<Props> = ({ children, index }) => {
  const itemTopPos = useRef<number | null>(null)
  const isInitialized = useRef<boolean>(false)
  const isRegistered = useRef<boolean>(false)
  const itemHeight = useRef<number | null>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const listContext = useContext(OptimizedListContext)
  const visibleAreaObserver = useRef<IntersectionObserver>()

  const setTopHeightRef = useCallback(() => {
    if (itemRef.current == null) return

    itemTopPos.current = itemRef.current.offsetTop
    itemHeight.current = getElementHeight(itemRef.current)
  }, [itemRef, itemTopPos, itemHeight])

  const isVisibleInContainer = useCallback(() => {
    const [topScrollArea, bottomScrollArea] = (listContext as OptimizedListContextInterface)
      .visibleArea

    if (
      itemTopPos.current !== null &&
      itemHeight.current !== null &&
      itemTopPos.current > topScrollArea &&
      itemTopPos.current - itemHeight.current < bottomScrollArea
    ) {
      return true
    }

    return false
  }, [listContext?.visibleArea, itemTopPos, itemHeight])

  const registerItemIndex = useCallback(() => {
    listContext?.registerLoadedListItem(index)
  }, [listContext?.registerLoadedListItem])

  const registerItemWhenShown = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const isVisible = entries.some((entry) => entry.isIntersecting)

      if (isVisible && !isRegistered.current) {
        registerItemIndex()
        visibleAreaObserver.current?.disconnect()
        isRegistered.current = true
      }
    },
    [visibleAreaObserver, isRegistered],
  )

  useEffect(() => {
    if (itemRef.current == null || listContext?.visibleArea == null) return

    setTopHeightRef()
  }, [itemRef, listContext])

  useEffect(() => {
    if (isInitialized.current || itemRef.current === null) return

    if (isVisibleInContainer()) {
      registerItemIndex()
      isInitialized.current = true
    } else {
      visibleAreaObserver.current = new IntersectionObserver(registerItemWhenShown, {
        root: listContext?.listRef.current,
        rootMargin: '0px',
        threshold: 0.1,
      })
      visibleAreaObserver.current.observe(itemRef.current)
    }

    return () => {
      if (visibleAreaObserver.current == null) return

      visibleAreaObserver.current.disconnect()
    }
  }, [itemTopPos, itemHeight, isInitialized, listContext?.listRef, itemRef])

  return (
    <div className={listItemClassname} ref={itemRef}>
      {children}
    </div>
  )
}

export default memo(OptimizedListItem)
