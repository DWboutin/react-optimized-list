import { type ReactElement, useCallback, useState } from 'react'
import ReactOptimizedList from './components'
import './App.css'

import './components/style.css'

function App(): ReactElement {
  const [items, setItems] = useState(Array.from({ length: 100 }, (_, i) => `Hello ${i}`))

  const handleAddItem = useCallback(() => {
    setItems([...items, `Hello ${items.length}`])
  }, [items])

  return (
    <div className="App">
      <div style={{ height: '400px', width: '400px', padding: '20px', border: '1px dashed black' }}>
        <ReactOptimizedList>
          {items.map((item, i) => (
            <div className="listItem" key={i}>
              <div>
                <img src={`https://picsum.photos/id/${i}/30/40`} />
                {item}
              </div>
            </div>
          ))}
        </ReactOptimizedList>
      </div>
      <div>
        <button onClick={handleAddItem}>Add item</button>
      </div>
    </div>
  )
}

export default App
