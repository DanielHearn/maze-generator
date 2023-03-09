import { useCallback, useEffect, useState } from 'react'
import MazePreview from '../MazePreview'
import SideEditor from '../SideEditor'
import { generateDefaultOptions, copyToClipboard } from '../helpers'
import { useColorScheme } from '@mui/joy/styles';
import Button from '@mui/joy/Button';
import { useSearchParams } from "react-router-dom";
import './style.css';

function MazeEditor() {
  const { mode, setMode } = useColorScheme({ theme: 'dark' });
  const [options, setOptions] = useState(generateDefaultOptions())
  const [loaded, setLoaded] = useState(false)
  const [maze, setMaze] = useState(null)
  let [searchParams, setSearchParams] = useSearchParams();

  const copyUrl = () => {
    copyToClipboard(window.location.href)
  }

  const updateUrl = useCallback((options) => {    
    setSearchParams(options);
  }, [setSearchParams])

  useEffect(() => {
    if (searchParams) {
      if (!loaded) {
        const newOptions = generateDefaultOptions()

        for (const [key, value] of searchParams.entries()) {
          newOptions[key] = value
        }

        setOptions(newOptions)
      }
      setLoaded(true)
    }
  }, [searchParams, loaded])

  useEffect(() => {
    if (options && loaded) {
      updateUrl(options)
    }
  }, [options, loaded, updateUrl])
  
  return (
    <div className="MazeEditor">
      <div className="MazeEditor__header">
        <span>Maze Generator (WIP) by <a href="https://www.danielhearn.co.uk">Daniel Hearn</a></span>
        <div>
          <Button
            variant="outlined"
            onClick={copyUrl}
          >
            Copy Url
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setMode(mode === 'light' ? 'dark' : 'light');
            }}
          >
            {mode === 'light' ? 'Turn dark' : 'Turn light'}
          </Button>
        </div>
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
