import { useEffect, useState, useRef, useMemo } from 'react'
import Sheet from '@mui/joy/Sheet';
import MazeGenerator from '../mazeGenerator'
import { cloneDeep, isEqual } from 'lodash-es'
import { OPTIONS } from '../constants';
import './style.css';

function MazePreview(props) {
  const { options } = props
  const mazeTargetRef = useRef(null)
  const [maze, setMaze] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [prevOptionsThatRegenerated, setPrevOptionsThatRegenerated] = useState(null)

  const optionsThatRegenerated = useMemo(() => {
    const filteredOptions = cloneDeep(options)
    for (const option in filteredOptions) {
      if (!OPTIONS[option]?.regen) {
        delete filteredOptions[option]
      }
    }
    return filteredOptions
  }, [options])

  useEffect(() => {
    if (loaded && maze && !isEqual(optionsThatRegenerated, prevOptionsThatRegenerated)) {
      maze.setOptions(options)
      maze.regenerate()
      setPrevOptionsThatRegenerated(optionsThatRegenerated)
    }
  }, [loaded, maze, options, optionsThatRegenerated, prevOptionsThatRegenerated])

  useEffect(() => {
    if (loaded && maze) {
      maze.setOptions(options)
      if (options?.solved) {
        maze.solve()
      } else {
        maze.unsolve()
      }
    }
  }, [loaded, maze, options, options.solved])

  useEffect(() => {
    if (mazeTargetRef?.current && !loaded && options && !maze) {
      mazeTargetRef.current.innerHTML = ''
      setLoaded(true)
      setMaze(new MazeGenerator(mazeTargetRef.current, options))
    }
  }, [mazeTargetRef, maze, options, loaded])

  return (
    <div className="MazePreview">
        <Sheet variant="outlined">
          <div ref={mazeTargetRef}/>
      </Sheet>
    </div>
  );
}

export default MazePreview;
