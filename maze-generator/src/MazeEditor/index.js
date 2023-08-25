import { useCallback, useEffect, useState } from 'react'
import MazePreview from '../MazePreview'
import SideEditor from '../SideEditor'
import { generateDefaultOptions } from '../helpers'
import { useColorScheme } from '@mui/joy/styles'
import Button from '@mui/joy/Button'
import { useSearchParams } from 'react-router-dom'
import './style.css'

function MazeEditor() {
  const { mode, setMode } = useColorScheme({ theme: 'dark' })
  const [options, setOptions] = useState(generateDefaultOptions())
  const [loaded, setLoaded] = useState(false)
  const [maze, setMaze] = useState(null)
  let [searchParams, setSearchParams] = useSearchParams()

  /*const copyUrl = () => {
    toast.clearWaitingQueue();
    toast(`Copied URL to clipboard`);
    copyToClipboard(window.location.href)
  }*/

  const updateUrl = useCallback(
    (options) => {
      setSearchParams(options)
    },
    [setSearchParams],
  )

  const loadMaze = (mazeData, options) => {
    if (maze) {
      setOptions(options)
      maze.setMaze(mazeData, options)
    }
  }

  useEffect(() => {
    if (searchParams) {
      if (!loaded) {
        const newOptions = generateDefaultOptions()

        for (const [key, value] of searchParams.entries()) {
          let parsedValue = value
          if (typeof parsedValue === 'string') {
            try {
              parsedValue = JSON.parse(value)
            } catch (e) {
              // prob ok just not bool/num
            }
          }
          newOptions[key] = parsedValue
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
        <span>
          Maze Generator (WIP) by <a href="https://www.danielhearn.co.uk">Daniel Hearn</a>
        </span>
        <div>
          {/*<Button
            variant="outlined"
            onClick={copyUrl}
          >
            Copy Url
          </Button>*/}
          <Button
            variant="outlined"
            onClick={() => {
              setMode(mode === 'light' ? 'dark' : 'light')
            }}
          >
            {mode === 'light' ? 'Toggle Dark Mode' : 'Toggle Light Mode'}
          </Button>
        </div>
      </div>
      <div className="MazeEditor__content">
        {loaded && (
          <>
            <MazePreview maze={maze} setMaze={setMaze} options={options} setOptions={setOptions} />
            <SideEditor maze={maze} options={options} setOptions={setOptions} loadMaze={loadMaze} />
          </>
        )}
      </div>
    </div>
  )
}

export default MazeEditor
