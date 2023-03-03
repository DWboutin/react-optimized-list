import {
  Children,
  FunctionComponent,
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import OptimizedListItem from './OptimizedListItem'
import createDebouncedFunction from './libs/createDebouncedFunction'
import './style.css'

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

export const OptimizedListContext = createContext<OptimizedListContextInterface | null>(null)

const OptimizedList: FunctionComponent<Props> = ({ children, reverse = true }) => {
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
    if (!lastScrollPos.current || !listRef.current) return

    lastScrollPos.current = listRef.current?.scrollHeight - listRef.current.scrollTop
  }, 100)

  const registerLoadedListItem = useCallback(
    (index: number) => {
      if (!listRef.current || index >= childrenCount - 1) return

      setScrollToBottom()

      setRenderedLastIndex(index + 1)
    },
    [listRef, renderedLastIndex],
  )

  const handleOnScroll = useCallback(() => {
    const scrollTop = listRef.current?.scrollTop || 0
    const itemHeight = listRef.current?.getBoundingClientRect().height || 0
    const scrollBottomLimit = itemHeight + scrollTop

    debouncedSaveScroll()

    setVisibleArea([scrollTop, scrollBottomLimit])
  }, [listRef])

  const setScrollToBottom = () => {
    if (!listRef.current) return

    lastScrollPos.current = listRef.current?.scrollHeight - listRef.current.scrollTop

    listRef.current.scrollTop = listRef.current?.scrollHeight
  }

  const maintainScrollPosition = () => {
    if (!listRef.current || !lastScrollPos.current) return

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
    if (!listRef.current || scrollObserver.current) return

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
        {listRef.current && (
          <div className={`ro-list-scroller ${reverse && 'reverse'}`}>
            {Children.map(itemChildren, (child, i) => {
              if (i > renderedLastIndex) return null

              return (
                <OptimizedListItem key={i} index={i}>
                  {child}
                </OptimizedListItem>
              )
            })}
          </div>
        )}
      </div>
    </OptimizedListContext.Provider>
  )
}

export default OptimizedList
