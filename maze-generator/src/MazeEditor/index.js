import { useEffect, useState } from 'react'
import MazePreview from '../MazePreview'
import SideEditor from '../SideEditor'
import { generateDefaultOptions } from '../helpers'
import './style.css';

function MazeEditor() {
  const [options, setOptions] = useState(generateDefaultOptions())
  const [loaded, setLoaded] = useState(false)
  const [maze, setMaze] = useState(null)

  useEffect(() => {
    if (options) {
      setLoaded(true)
    }
  }, [options])

  return (
    <div className="MazeEditor">
      <div className="MazeEditor__header">
        Maze Generator
      </div>
      <div className="MazeEditor__content">
        {loaded && 
          <>
            <MazePreview maze={maze} setMaze={setMaze} options={options} setOptions={setOptions}/>
            <SideEditor maze={maze} options={options} setOptions={setOptions}/>
          </>
        }
      </div>
    </div>
  );
}

export default MazeEditor;
