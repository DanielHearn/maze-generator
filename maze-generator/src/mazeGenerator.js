import { generateDefaultOptions } from "./helpers"
import { cloneDeep } from 'lodash-es'

export default class MazeGenerator {
  constructor (targetElement, options = generateDefaultOptions()) {
    this.setOptions(options)
    this.targetElement = targetElement
      
    this.colors = {
      wall: '#1a282f',
      border: '#000000',
      path: '#cfcfcf',
      empty: '#ffffff',
      start: '#ffd100',
      end: '#2ce141',
      solved: '#456ecf'
    }
    this.path = []
    
    this.createCanvas()
    this.generate()

    return this
  }
  setOptions(options) {
    this.options = cloneDeep(options)
    this.options.scale = this.options.scale * 8
  }
  regenerate() {
    this.setCanvasSize()
    this.generate()
  }
  redraw() {
    this.clearCanvas()
    this.setCanvasSize()
    this.drawMaze()
  }
  generate() {
    this.maze = new Maze(this.options.width, this.options.height)
    this.mazeMap = this.maze.getMaze()
    this.start = this.maze.getStart()
    this.end = this.maze.getEnd()
    this.drawMaze()
  }
  setCanvasSize() {
    this.canvas.width = this.options.width * this.options.scale
    this.canvas.height = this.options.height * this.options.scale
  }
  createCanvas() {
    this.canvas = document.createElement('canvas')
    this.canvas.classList.add('maze')
    this.setCanvasSize()
    
    this.targetElement.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')
  }
  remove() {
    this.clearCanvas()
    this.canvas.remove()
  }
  drawMaze() {
    const maze = this.mazeMap
    if(maze && maze.length) {
      for (let x = 0; x < this.options.width; x++) {
        for (let y = 0; y < this.options.height; y++) {
          this.drawCell(maze[x][y])
        }
      }
    }
  }
  drawCell(cell, solved) {
    const cellType = cell.getType()
    const cellColor = cell.solved ? this.colors.solved : this.colors[cellType]
    const cellX = cell.getX()
    const cellY = cell.getY()
    const scale = this.options.scale
    
    // Draw cell interior
    this.ctx.fillStyle = cellColor
    this.ctx.fillRect(
      cellX * scale,
      cellY * scale,
      scale,
      scale
    )
    
    // Draw cell walls but not on maze borders
    if(cellType !== 'border' && cellType !== 'solved' && cell.walls) {
       this.ctx.fillStyle = this.colors.wall
       const wallWidth = this.options.wallWidth
       const cellWalls = cell.getWalls()
       
       if(cellWalls.top) {
          this.ctx.fillRect(
            cellX * scale,
            cellY * scale,
            scale,
            wallWidth
          )
       }
       if(cellWalls.bottom) {
          this.ctx.fillRect(
            cellX * scale,
            cellY * scale + (scale - wallWidth),
            scale,
            wallWidth
          )
       }
       if(cellWalls.left) {
          this.ctx.fillRect(
            cellX * scale,
            cellY * scale,
            wallWidth,
            scale
          )
       }
       if(cellWalls.right) {
          this.ctx.fillRect(
            (cellX * scale) + (scale - wallWidth),
            cellY * scale,
            wallWidth,
            scale
          )
       }
    }
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  dfs(cell) {
    if(cell) {
      const cellX = cell.getX()
      const cellY = cell.getY()
      const neighbors = []
      cell.visited = true
      
      // Get neigbors if it exits in the maze
      if(!cell.walls.right && this.mazeMap[cellX+1] && this.mazeMap[cellX+1][cellY]) {
        neighbors.push({cell: this.mazeMap[cellX+1][cellY], direction: 'right'})
      }
      if(!cell.walls.left && this.mazeMap[cellX-1] && this.mazeMap[cellX-1][cellY]) {
        neighbors.push({cell: this.mazeMap[cellX-1][cellY], direction: 'left'})
      }
      if(!cell.walls.bottom && this.mazeMap[cellX] && this.mazeMap[cellX][cellY+1]) {
        neighbors.push({cell: this.mazeMap[cellX][cellY+1], direction: 'bottom'})
      }
      if(!cell.walls.top && this.mazeMap[cellX] && this.mazeMap[cellX][cellY-1]) {
        neighbors.push({cell: this.mazeMap[cellX][cellY-1], direction: 'top'})
      }
      
      // Filter out only traversable neigboring cells
      const potential = neighbors.filter((neighbor) => {
        if(!(neighbor && neighbor.cell)) {
          return false
        }
        const type = neighbor.cell.getType()
        return !neighbor.cell.visited && (type === 'path' || type === 'end')
      })
      
      if(potential.length) {
        this.path.push(cell)
        const direction = this.randomIntInRange(0, potential.length - 1)
        const next = potential[direction]

        if(next.cell === this.end) {
          this.path.push(next.cell)
        } else {
          this.dfs(next.cell)
        }
      } else if(this.path.length) {
        this.dfs(this.path.pop())
      }
    } 
  }
  solve() {
    this.path = []
    this.dfs(this.maze.getStart())
    
    for(let i = 0; i < this.path.length; i++) {
      const cell = this.path[i]
      cell.solved = true;
      this.drawCell(cell)
    }
  }
  unsolve() {
    for(let i = 0; i < this.path.length; i++) {
      const cell = this.path[i]
      cell.visited = false
      cell.solved = false
      this.drawCell(cell)
    }
    this.path = []
  }
  randomIntInRange(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  save() {
    if (this.canvas) {
      const link = document.createElement('a');
      link.download = `maze_${new Date().toISOString()}.png`;
      link.href = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      link.click();
      link.remove();
    }
  }
  print() {
    if (this.canvas) {
      const image = document.createElement('img');
      image.src = this.canvas.toDataURL("image/png")
      image.style.maxWidth = '100%';

      const iframe = document.createElement('iframe');

      iframe.style.height = 0;
      iframe.style.visibility = 'hidden';
      iframe.style.width = 0;
      
      iframe.setAttribute('srcdoc', '<html><body></body></html>');
      
      document.body.appendChild(iframe);

      iframe.addEventListener('load', function () {
        const body = iframe.contentDocument.body;
        body.style.textAlign = 'center';
        body.appendChild(image);

        image.addEventListener('load', function() {
          iframe.contentWindow.print();
        });
        iframe.contentWindow.addEventListener('afterprint', function () {
          iframe.parentNode.removeChild(iframe);
        });
      });
    }
  }
}

class Maze {
  constructor(
    sizeX = 20,
    sizeY = 20
  ) {
      
    this.sizeX = sizeX
    this.sizeY = sizeY
    this.paused = false
    
    this.generate()
  }
  randomIntInRange(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  isMazeBorder(x, y) {
    return (
      x === 0
      || x === (this.sizeX - 1)
      || y === 0
      || y === (this.sizeY - 1)
    )
  }
  clearState() {
    this.maze = []
    this.path = []
  }
  generateCellType(x, y) {
      return this.isMazeBorder(x, y) ? 'border' : 'empty'
  }
  initCells() {
    // Init maze 2d array and walls
    for (let x = 0; x < this.sizeX; x++) {
      this.maze[x] = []
      for (let y = 0; y < this.sizeY; y++) {
        const cellType = this.generateCellType(x, y)
        const cell = new Cell(x, y, cellType)
        
        this.maze[x][y] = cell
      }
    }
    
    // Init start and end points
    const startX = this.randomIntInRange(1, this.sizeX - 2)
    const startY = 0
    const endX = this.randomIntInRange(1, this.sizeX - 2)
    const endY = this.sizeY - 1
    
    const startCell = new Cell(startX, startY, 'start')
    const endCell = new Cell(endX, endY, 'end')
    
    this.maze[startX][startY] = startCell
    this.maze[endX][endY] = endCell
    this.start = startCell
    this.end = endCell
    
    return {start: startCell, end: endCell, maze: this.maze}
  }
  generate() {
    this.clearState()
    const { start, end, maze} = this.initCells()
    
    // DFS through map to create maze path
    this.createMazePath(start)
    
    return {start: start, end: end, maze: maze}
  }
  createMazePath(cell) {
    if(cell) {
      cell.setType('path')
      const cellX = cell.getX()
      const cellY = cell.getY()
      const neighbors = []
      
      // Get neigbors if it exits in the maze
      if(this.maze[cellX+1] && this.maze[cellX+1][cellY]) {
        neighbors.push({cell: this.maze[cellX+1][cellY], direction: 'right'})
      }
      if(this.maze[cellX-1] && this.maze[cellX-1][cellY]) {
        neighbors.push({cell: this.maze[cellX-1][cellY], direction: 'left'})
      }
      if(this.maze[cellX] && this.maze[cellX][cellY+1]) {
        neighbors.push({cell: this.maze[cellX][cellY+1], direction: 'bottom'})
      }
      if(this.maze[cellX] && this.maze[cellX][cellY-1]) {
        neighbors.push({cell: this.maze[cellX][cellY-1], direction: 'top'})
      }
      
      
      // Filter out only traversable neigboring cells
      const potential = neighbors.filter((neighbor) => {
        if(!(neighbor && neighbor.cell)) {
          return false
        }
        const type = neighbor.cell.getType()
        return type === 'empty' || type === 'end'
      })
      
      if(!this.paused) {
        if(potential.length) {
          this.path.push(cell)
          const direction = this.randomIntInRange(0, potential.length - 1)
          const next = potential[direction]
          
          // Clear walls to create path
          if(next.direction === 'bottom') {
            cell.setWall('bottom', false)
            next.cell.setWall('top', false)
          } else if(next.direction === 'top') {
            cell.setWall('top', false)
            next.cell.setWall('bottom', false)
          } else if(next.direction === 'left') {
            cell.setWall('left', false)
            next.cell.setWall('right', false)
          } else if(next.direction === 'right') {
            cell.setWall('right', false)
            next.cell.setWall('left', false)
          }
          
          this.createMazePath(next.cell)
        } else if(this.path.length) {
          // Backtrack 
          this.createMazePath(this.path.pop())
        }
      }
    } 
  }
  remove() {
    this.paused = true
    this.clearState()
  }
  getMaze() {
    return this.maze
  }
  getStart() {
    return this.start
  }
  getEnd() {
    return this.end
  }
}

class Cell {
  constructor(x, y, type) {
    this.x = x
    this.y = y
    this.type = type
    this.walls = {
      top: true,
      bottom: true,
      left: true,
      right: true
    }
  }
  getX() {
    return this.x
  }
  getY() {
    return this.y
  }
  setType(type) {
    this.type = type
  }
  getType() {
    return this.type
  }
  getWalls() {
    return this.walls
  }
  setWall(wall, value) {
    this.walls[wall] = value
  }
}