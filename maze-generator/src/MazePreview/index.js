import { useEffect, useState, useRef } from 'react'
import Sheet from '@mui/joy/Sheet';
import MazeGenerator from '../mazeGenerator'

function MazePreview(props) {
  const { options } = props
  const [maze, setMaze] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const mazeTargetRef = useRef(null)

  useEffect(() => {
    setLoaded(false)
  }, [options])


  useEffect(() => {
    if (mazeTargetRef?.current && !loaded) {
      setLoaded(true)
      if (maze) {
        maze.remove()
        mazeTargetRef.current.innerHTML = ''
      }
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
