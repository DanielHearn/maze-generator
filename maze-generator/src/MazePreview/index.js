import { useEffect, useState, useRef, useMemo } from 'react'
import Sheet from '@mui/joy/Sheet'
import MazeGenerator from '../mazeGenerator'
import { cloneDeep, isEqual } from 'lodash-es'
import { OPTIONS } from '../constants'
import './style.css'

function MazePreview(props) {
  const { options, maze, setMaze, loadMaze } = props
  const mazeTargetRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [prevOptionsThatRegenerated, setPrevOptionsThatRegenerated] = useState(null)

  const optionsThatRegenerated = useMemo(() => {
    const filteredOptions = cloneDeep(options)
    for (const option in OPTIONS) {
      if (OPTIONS?.[option]?.items) {
        for (const subOption in OPTIONS[option].items) {
          if (!OPTIONS[option].items[subOption]?.regen) {
            delete filteredOptions[subOption]
          }
        }
      } else if (!OPTIONS?.[option]?.regen) {
        delete filteredOptions[option]
      }
    }
    return filteredOptions
  }, [options])

  const optionsChanged = useMemo(() => {
    return !isEqual(optionsThatRegenerated, prevOptionsThatRegenerated)
  }, [optionsThatRegenerated, prevOptionsThatRegenerated])

  useEffect(() => {
    if (loaded && maze) {
      maze.setOptions(options)
      if (optionsChanged && !loadMaze) {
        maze.regenerate()
      }
      setPrevOptionsThatRegenerated(optionsThatRegenerated)
      maze.redraw()
      if (options?.solved) {
        maze.solve()
      } else {
        maze.unsolve()
      }
    }
  }, [loaded, loadMaze, maze, options, optionsThatRegenerated, optionsChanged])

  useEffect(() => {
    if (mazeTargetRef?.current && !loaded && options && !maze) {
      mazeTargetRef.current.innerHTML = ''
      setLoaded(true)
      setMaze(new MazeGenerator(mazeTargetRef.current, options))
    }
  }, [mazeTargetRef, maze, options, loaded, setMaze])

  return (
    <div className="MazePreview">
      <Sheet variant="outlined">
        <div id="MazeCanvas" ref={mazeTargetRef} />
      </Sheet>
    </div>
  )
}

export default MazePreview
