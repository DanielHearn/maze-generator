import { useEffect, useState } from 'react'
import MazePreview from '../MazePreview'
import SideEditor from '../SideEditor'
import { generateDefaultOptions } from '../helpers'
import { useColorScheme } from '@mui/joy/styles';
import Button from '@mui/joy/Button';
import './style.css';

function MazeEditor() {
  const { mode, setMode } = useColorScheme({ theme: 'dark' });
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
        <span>Maze Generator (WIP) by <a href="https://www.danielhearn.co.uk">Daniel Hearn</a></span>
        <Button
          variant="outlined"
          onClick={() => {
            setMode(mode === 'light' ? 'dark' : 'light');
          }}
        >
          {mode === 'light' ? 'Turn dark' : 'Turn light'}
        </Button>
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
