import { useEffect, useState, useRef } from 'react'
import Sheet from '@mui/joy/Sheet';
import MazeGenerator from '../mazeGenerator'

function MazePreview(props) {
  const { mazeOptions } = props
  const [maze, setMaze] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const mazeTargetRef = useRef(null)

  useEffect(() => {
    console.log(loaded)
    if (mazeTargetRef?.current && !loaded) {
      setLoaded(true)
      if (maze) {
        maze.remove()
      }
      setMaze(new MazeGenerator(mazeTargetRef?.current))
    }
  }, [mazeTargetRef, maze, mazeOptions, loaded])

  return (
    <div className="MazePreview">
        <Sheet variant="outlined">
          <div ref={mazeTargetRef}/>
      </Sheet>
    </div>
  );
}

export default MazePreview;
