import { useEffect, useState, useRef } from 'react'
import MazePreview from '../MazePreview'
import SideEditor from '../SideEditor'
import { generateDefaultOptions } from '../helpers'

function MazeEditor() {
  const [options, setOptions] = useState(generateDefaultOptions())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (options) {
      setLoaded(true)
    }
  }, [options])

  return (
    <div className="MazeEditor">
      { loaded && 
        <>
          <MazePreview options={options}/>
          <SideEditor options={options} setOptions={setOptions}/>
        </>
      }
    </div>
  );
}

export default MazeEditor;
