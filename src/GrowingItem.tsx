import { type FunctionComponent, type ReactNode, useEffect, useState } from 'react'

export interface Props {
  children: ReactNode
  index: number
}

const GrowingItem: FunctionComponent<Props> = ({ children, index }) => {
  const [items, setItems] = useState<string[]>([])

  useEffect(() => {
    if (index !== 96) return

    setTimeout(() => {
      setItems([...items, '1'])
    }, 5000)
  }, [items, index])

  return (
    <div>
      {children}{' '}
      {items.map((_, i) => (
        <br key={i} />
      ))}
    </div>
  )
}

export default GrowingItem
