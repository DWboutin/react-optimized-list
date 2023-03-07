import { type FunctionComponent, type ReactNode, type RefObject } from 'react'
import { Children, createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { node as PropTypeNode, bool as PropTypeBool } from 'prop-types'

import OptimizedListItem from './OptimizedListItem'
import createDebouncedFunction from '../libs/createDebouncedFunction'

export interface Props {
  children: ReactNode
  reverse?: boolean
}

export interface OptimizedListContextInterface {
  listRef: RefObject<HTMLDivElement>
  visibleArea: [number, number]
  registerLoadedListItem: (index: number) => void
  maintainScrollPosition: () => void
}

export type TOptimizedList = FunctionComponent<Props>

export const OptimizedListContext = createContext<OptimizedListContextInterface | null>(null)

const OptimizedList: TOptimizedList = ({ children, reverse = true }) => {
  const scrollerClassNames = ['ro-list-scroller', reverse ? 'reverse' : null].filter(Boolean)
  const childrenCount = Children.count(children)
  const itemChildren = useMemo(() => {
    return !reverse ? children : Children.toArray(children).reverse()
  }, [children, reverse])
  const listRef = useRef<HTMLDivElement>(null)
  const [renderedLastIndex, setRenderedLastIndex] = useState<number>(0)
  const [visibleArea, setVisibleArea] = useState<[number, number]>([0, 0])
  const scrollObserver = useRef<MutationObserver>()
  const lastScrollPos = useRef<number>()
  const debouncedSaveScroll = createDebouncedFunction(() => {
    if (!lastScrollPos.current || listRef.current == null) return

    lastScrollPos.current = listRef.current?.scrollHeight - listRef.current.scrollTop
  }, 100)

  const registerLoadedListItem = useCallback(
    (index: number) => {
      if (listRef.current == null || index >= childrenCount - 1) return

      setScrollToBottom()

      setRenderedLastIndex(index + 1)
    },
    [listRef, renderedLastIndex],
  )

  const handleOnScroll = useCallback(() => {
    const scrollTop = listRef.current?.scrollTop ?? 0
    const itemHeight = listRef.current?.getBoundingClientRect().height ?? 0
    const scrollBottomLimit = itemHeight + scrollTop

    debouncedSaveScroll()

    setVisibleArea([scrollTop, scrollBottomLimit])
  }, [listRef])

  const setScrollToBottom: () => void = () => {
    if (listRef.current == null) return

    lastScrollPos.current = listRef.current?.scrollHeight - listRef.current.scrollTop

    listRef.current.scrollTop = listRef.current?.scrollHeight
  }

  const maintainScrollPosition: () => void = () => {
    if (listRef.current == null || !lastScrollPos.current) return

    const scrollTop = listRef.current?.scrollHeight - lastScrollPos.current

    listRef.current.scrollTop = scrollTop
  }

  useEffect(() => {
    if (listRef.current === null) return

    listRef.current.addEventListener('scroll', handleOnScroll)

    handleOnScroll()

    return () => {
      if (listRef.current === null) return

      listRef.current.removeEventListener('scroll', handleOnScroll)
    }
  }, [listRef])

  useEffect(() => {
    if (listRef.current == null || scrollObserver.current != null) return

    scrollObserver.current = new MutationObserver(maintainScrollPosition)

    scrollObserver.current.observe(listRef.current, {
      childList: true,
      subtree: true,
    })
  }, [listRef])

  return (
    <OptimizedListContext.Provider
      value={{
        listRef,
        visibleArea,
        registerLoadedListItem,
        maintainScrollPosition,
      }}
    >
      <div className="ro-list" ref={listRef}>
        <div className={scrollerClassNames.join(' ')}>
          {Children.map(itemChildren, (child, i) => {
            if (i > renderedLastIndex) return null

            return (
              <OptimizedListItem key={i} index={i}>
                {child}
              </OptimizedListItem>
            )
          })}
        </div>
      </div>
    </OptimizedListContext.Provider>
  )
}

OptimizedList.propTypes = {
  children: PropTypeNode.isRequired,
  reverse: PropTypeBool,
}

export default OptimizedList
