import { useCallback, useState } from 'react'
import './App.css'
import OptimizedList from './OptimizedList/OptimizedList'
import GrowingItem from './GrowingItem'

function App() {
  const [items, setItems] = useState(Array.from({ length: 100 }, (_, i) => `Hello ${i}`))

  const handleAddItem = useCallback(() => {
    setItems([...items, `Hello ${items.length}`])
  }, [items])

  return (
    <div className="App">
      <div style={{ height: '400px', width: '400px', padding: '20px', border: '1px dashed black' }}>
        <OptimizedList reverse>
          {items.map((item, i) => (
            <div className="listItem" key={i}>
              <GrowingItem key={i} index={i}>
                {item}
              </GrowingItem>
              {/* <div>
              <img src={`https://picsum.photos/id/${i}/30/40`} />
              {item}
            </div> */}
            </div>
          ))}
        </OptimizedList>
      </div>
      <div>
        <button onClick={handleAddItem}>Add item</button>
      </div>
    </div>
  )
}

export default App
