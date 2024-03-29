import { generateDefaultOptions } from './helpers'
import { cloneDeep } from 'lodash-es'
import { SHAPE_OPTION_TYPES, SIDE_OPTION_TYPES } from './constants'

export default class MazeGenerator {
  constructor(targetElement, options = generateDefaultOptions()) {
    this.setOptions(options)
    this.targetElement = targetElement
    this.path = []

    this.createCanvas()
    this.generate()

    return this
  }
  setOptions(options) {
    this.options = cloneDeep(options)
    this.options.scale = 12 + this.options.scale * 0.5
    this.options.wallWidth = this.options.wallWidth * 0.5

    this.colors = {
      wall: this.options.wallColor,
      border: this.options.borderColor,
      path: this.options.pathColor,
      empty: this.options.emptyColor,
      start: this.options.startColor,
      end: this.options.endColor,
      solved: this.options.solvedColor,
    }
  }
  regenerate() {
    this.setCanvasSize()
    this.generate()
  }
  redraw() {
    //this.rotate()
    this.clearCanvas()
    this.setCanvasSize()
    this.drawMaze()
  }
  stringifyMaze() {
    if (this.maze?.maze) {
      return JSON.stringify(this.maze.maze)
    }

    return ''
  }
  setMaze(maze, options) {
    if (maze && options) {
      this.setOptions(options)
      this.maze.setMaze(maze)
      this.mazeMap = this.maze.getMaze()
      this.start = this.maze.getStart()
      this.end = this.maze.getEnd()
      this.redraw()
    }
  }
  generate() {
    this.maze = new Maze(
      this.options.width,
      this.options.height,
      this.options.startLocation,
      this.options.endLocation,
      this.options.shape,
    )
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
  rotate() {
    if (this.ctx) {
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2)
      this.ctx.rotate((this.options.rotate * Math.PI) / 180)
      this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2)
    }
  }
  drawMaze() {
    const maze = this.mazeMap
    if (maze && maze.length) {
      this.rotate()
      for (let x = 0; x < this.options.width; x++) {
        for (let y = 0; y < this.options.height; y++) {
          if (maze?.[x]?.[y]) {
            this.drawCell(maze[x][y])
          }
        }
      }
    }
  }
  drawCell(cell, solved) {
    const cellType = cell.getType()
    const cellSubType = cell.getSubType()
    const cellColor = cell.solved ? this.colors.solved : this.colors[cellType]
    const cellSubColor = this.colors[cellSubType]
    const cellX = cell.getX()
    const cellY = cell.getY()
    const scale = this.options.scale

    // Draw cell interior
    this.ctx.fillStyle = cellSubColor || cellColor
    this.ctx.fillRect(cellX * scale, cellY * scale, scale, scale)

    // Draw cell walls but not on maze borders
    if (cellType !== 'border' && cellType !== 'solved' && cell.walls) {
      this.ctx.fillStyle = this.colors.wall
      const wallWidth = this.options.wallWidth
      const cellWalls = cell.getWalls()

      if (cellWalls.top) {
        this.ctx.fillRect(cellX * scale, cellY * scale, scale, wallWidth)
      }
      if (cellWalls.bottom) {
        this.ctx.fillRect(cellX * scale, cellY * scale + (scale - wallWidth), scale, wallWidth)
      }
      if (cellWalls.left) {
        this.ctx.fillRect(cellX * scale, cellY * scale, wallWidth, scale)
      }
      if (cellWalls.right) {
        this.ctx.fillRect(cellX * scale + (scale - wallWidth), cellY * scale, wallWidth, scale)
      }
    }
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  dfs(cell) {
    if (cell) {
      const cellX = cell.getX()
      const cellY = cell.getY()
      const neighbors = []
      cell.visited = true

      // Get neigbors if it exits in the maze
      if (!cell.walls.right && this.mazeMap[cellX + 1] && this.mazeMap[cellX + 1][cellY]) {
        neighbors.push({ cell: this.mazeMap[cellX + 1][cellY], direction: 'right' })
      }
      if (!cell.walls.left && this.mazeMap[cellX - 1] && this.mazeMap[cellX - 1][cellY]) {
        neighbors.push({ cell: this.mazeMap[cellX - 1][cellY], direction: 'left' })
      }
      if (!cell.walls.bottom && this.mazeMap[cellX] && this.mazeMap[cellX][cellY + 1]) {
        neighbors.push({ cell: this.mazeMap[cellX][cellY + 1], direction: 'bottom' })
      }
      if (!cell.walls.top && this.mazeMap[cellX] && this.mazeMap[cellX][cellY - 1]) {
        neighbors.push({ cell: this.mazeMap[cellX][cellY - 1], direction: 'top' })
      }

      // Filter out only traversable neigboring cells
      const potential = neighbors.filter((neighbor) => {
        if (!(neighbor && neighbor.cell)) {
          return false
        }
        const type = neighbor.cell.getType()
        return !neighbor.cell.visited && (type === 'path' || type === 'end')
      })

      if (potential.length) {
        this.path.push(cell)
        const direction = this.randomIntInRange(0, potential.length - 1)
        const next = potential[direction]

        if (next.cell === this.end) {
          this.path.push(next.cell)
        } else {
          this.dfs(next.cell)
        }
      } else if (this.path.length) {
        this.dfs(this.path.pop())
      }
    }
  }
  solve() {
    this.path = []
    this.dfs(this.maze.getStart())

    for (let i = 0; i < this.path.length; i++) {
      const cell = this.path[i]
      cell.solved = true
      cell.visited = true
      this.drawCell(cell)
    }
  }
  unsolve() {
    for (let x = 0; x < this.options.width; x++) {
      for (let y = 0; y < this.options.height; y++) {
        const cell = this.maze?.maze?.[x]?.[y]
        if (cell) {
          cell.visited = false
          cell.solved = false

          this.drawCell(cell, false)
        }
      }
    }

    this.path = []
  }
  randomIntInRange(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  save() {
    if (this.canvas) {
      const link = document.createElement('a')
      let fileName = `maze_${new Date().toISOString()}_${
        this.options?.solved ? 'solved' : 'unsolved'
      }`
      link.download = `${fileName}.png`
      link.href = this.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      link.click()
      link.remove()
    }
  }
  print() {
    if (this.canvas) {
      const image = document.createElement('img')
      image.src = this.canvas.toDataURL('image/png')
      image.style.maxWidth = '100%'

      const iframe = document.createElement('iframe')

      iframe.style.height = 0
      iframe.style.visibility = 'hidden'
      iframe.style.width = 0

      iframe.setAttribute('srcdoc', '<html><body></body></html>')

      document.body.appendChild(iframe)

      iframe.addEventListener('load', function () {
        const body = iframe.contentDocument.body
        body.style.textAlign = 'center'
        body.appendChild(image)

        image.addEventListener('load', function () {
          iframe.contentWindow.print()
        })
        iframe.contentWindow.addEventListener('afterprint', function () {
          iframe.parentNode.removeChild(iframe)
        })
      })
    }
  }
}

class Maze {
  constructor(
    sizeX = 20,
    sizeY = 20,
    startLocation = SIDE_OPTION_TYPES.TOP,
    endLocation = SIDE_OPTION_TYPES.BOTTOM,
    shape = SHAPE_OPTION_TYPES.SQUARE,
  ) {
    this.sizeX = sizeX
    this.sizeY = sizeY
    this.startLocation = startLocation
    this.endLocation = endLocation
    this.paused = false
    this.shape = shape

    this.generate()
  }
  setMaze(maze) {
    this.maze = []
    this.path = []
    for (let x = 0; x < maze.length; x++) {
      this.maze[x] = []
      for (let y = 0; y < maze[x].length; y++) {
        const rawCellData = maze[x][y]

        const cell = new Cell(
          rawCellData.x,
          rawCellData.y,
          rawCellData.type,
          rawCellData.subType,
          rawCellData.walls,
        )
        if (cell.getSubType() === 'start') {
          this.start = cell
        }
        if (cell.getSubType() === 'end') {
          this.end = cell
        }
        this.maze[x][y] = cell
      }
    }
  }
  randomIntInRange(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  isMazeBorder(x, y) {
    return x === 0 || x === this.sizeX - 1 || y === 0 || y === this.sizeY - 1
  }
  clearState() {
    this.maze = []
    this.path = []
  }
  generateCellType(x, y) {
    if (this.shape === SHAPE_OPTION_TYPES.HOLLOW_SQUARE) {
      const centerTop = Math.ceil(this.sizeY / 3) - 1
      const centerBottom = Math.ceil((this.sizeY / 3) * 2)
      const centerLeft = Math.ceil(this.sizeX / 3) - 1
      const centerRight = Math.ceil((this.sizeX / 3) * 2)
      if (x > centerLeft && x < centerRight && y > centerTop && y < centerBottom) {
        return 'border'
      }
    } else if (this.shape === SHAPE_OPTION_TYPES.DIAMOND && this.sizeX > 8 && this.sizeY > 8) {
      if (
        x + y < Math.floor(this.sizeX / 2) ||
        this.sizeX - x + (this.sizeY - y) < Math.ceil(this.sizeX / 2) ||
        y - x > Math.floor(this.sizeX / 2) ||
        x - y > Math.ceil(this.sizeX / 2)
      ) {
        return 'border'
      }
    } else if (this.shape === SHAPE_OPTION_TYPES.CIRCLE && this.sizeX > 8 && this.sizeY > 8) {
      return 'border'
    } else if (
      this.shape === SHAPE_OPTION_TYPES.HOLLOW_CIRCLE &&
      this.sizeX > 8 &&
      this.sizeY > 8
    ) {
      return 'border'
    }

    return this.isMazeBorder(x, y) ? 'border' : 'empty'
  }
  initCells() {
    const generateCircle = (maxRadius, minRadius) => {
      for (let r = maxRadius; r >= minRadius; r--) {
        let x1, y1
        const x = Math.floor(this.sizeX / 2)
        const y = Math.floor(this.sizeX / 2)

        const minAngle = Math.acos(1 - 1 / r)
        for (let angle = 0; angle <= 360; angle += minAngle) {
          x1 = r * Math.cos(angle)
          y1 = r * Math.sin(angle)
          const cellX = Math.floor(x + x1)
          const cellY = Math.floor(y + y1)
          const cell = new Cell(cellX, cellY, 'empty')
          if (this.maze[cellX] && this.maze[cellY]) {
            this.maze[cellX][cellY] = cell
          }
        }
      }
    }

    // Init maze 2d array and walls
    for (let x = 0; x < this.sizeX; x++) {
      this.maze[x] = []
      for (let y = 0; y < this.sizeY; y++) {
        const cellType = this.generateCellType(x, y)
        const cell = new Cell(x, y, cellType)

        this.maze[x][y] = cell
      }
    }

    if (this.shape === SHAPE_OPTION_TYPES.CIRCLE && this.sizeX > 8 && this.sizeY > 8) {
      generateCircle(Math.floor(this.sizeX / 2), 0)
    }
    if (this.shape === SHAPE_OPTION_TYPES.HOLLOW_CIRCLE && this.sizeX > 8 && this.sizeY > 8) {
      generateCircle(Math.floor(this.sizeX / 2), Math.floor(this.sizeX / 4))
    }

    // Init start and end points
    let startX = 1
    let startY = 0

    let endX = 0
    let endY = this.sizeY - 1
    switch (this.startLocation) {
      case SIDE_OPTION_TYPES.TOP:
      default:
        startX = this.randomIntInRange(1, this.sizeX - 2)
        startY = 0
        break
      case SIDE_OPTION_TYPES.BOTTOM:
        startX = this.randomIntInRange(1, this.sizeX - 2)
        startY = this.sizeY - 1
        break
      case SIDE_OPTION_TYPES.LEFT:
        startX = 0
        startY = this.randomIntInRange(1, this.sizeY - 2)
        break
      case SIDE_OPTION_TYPES.RIGHT:
        startX = this.sizeX - 1
        startY = this.randomIntInRange(1, this.sizeY - 2)
        break
      case SIDE_OPTION_TYPES.CENTER:
        startX = Math.floor(this.sizeX / 2)
        startY = Math.floor(this.sizeY / 2)
        break
    }

    switch (this.endLocation) {
      case SIDE_OPTION_TYPES.TOP:
      default:
        endX = this.randomIntInRange(1, this.sizeX - 2)
        endY = 0
        break
      case SIDE_OPTION_TYPES.BOTTOM:
        endX = this.randomIntInRange(1, this.sizeX - 2)
        endY = this.sizeY - 1
        break
      case SIDE_OPTION_TYPES.LEFT:
        endX = 0
        endY = this.randomIntInRange(1, this.sizeY - 2)
        break
      case SIDE_OPTION_TYPES.RIGHT:
        endX = this.sizeX - 1
        endY = this.randomIntInRange(1, this.sizeY - 2)
        break
    }

    if (
      this.shape === SHAPE_OPTION_TYPES.DIAMOND ||
      this.shape === SHAPE_OPTION_TYPES.CIRCLE ||
      this.shape === SHAPE_OPTION_TYPES.HOLLOW_CIRCLE
    ) {
      switch (this.startLocation) {
        case SIDE_OPTION_TYPES.TOP:
        default:
          startX = Math.ceil(this.sizeX / 2)
          startY = 0
          break
        case SIDE_OPTION_TYPES.BOTTOM:
          startX = Math.ceil(this.sizeX / 2)
          startY = this.sizeY - 1
          break
        case SIDE_OPTION_TYPES.LEFT:
          startX = 0
          startY = Math.ceil(this.sizeY / 2)
          break
        case SIDE_OPTION_TYPES.RIGHT:
          startX = this.sizeX - 1
          startY = Math.ceil(this.sizeY / 2)
          break
        case SIDE_OPTION_TYPES.CENTER:
          startX = Math.floor(this.sizeX / 2)
          startY = Math.floor(this.sizeY / 2)
          break
      }
      switch (this.endLocation) {
        case SIDE_OPTION_TYPES.TOP:
        default:
          endX = Math.ceil(this.sizeX / 2)
          endY = 0
          break
        case SIDE_OPTION_TYPES.BOTTOM:
          endX = Math.ceil(this.sizeX / 2)
          endY = this.sizeY - 1
          break
        case SIDE_OPTION_TYPES.LEFT:
          endX = 0
          endY = Math.ceil(this.sizeY / 2)
          break
        case SIDE_OPTION_TYPES.RIGHT:
          endX = this.sizeX - 1
          endY = Math.ceil(this.sizeY / 2)
          break
      }
    }

    const startCell = new Cell(startX, startY, 'start', 'start')
    const endCell = new Cell(endX, endY, 'end', 'end')

    this.maze[startX][startY] = startCell
    this.maze[endX][endY] = endCell
    this.start = startCell
    this.end = endCell

    return { start: startCell, end: endCell, maze: this.maze }
  }
  generate() {
    this.clearState()
    const { start, end, maze } = this.initCells()

    // DFS through map to create maze path
    this.createMazePath(start)

    return { start: start, end: end, maze: maze }
  }
  createMazePath(cell) {
    if (cell) {
      cell.setType('path')
      const cellX = cell.getX()
      const cellY = cell.getY()
      const neighbors = []

      // Get neigbors if it exits in the maze
      if (this.maze[cellX + 1] && this.maze[cellX + 1][cellY]) {
        neighbors.push({ cell: this.maze[cellX + 1][cellY], direction: 'right' })
      }
      if (this.maze[cellX - 1] && this.maze[cellX - 1][cellY]) {
        neighbors.push({ cell: this.maze[cellX - 1][cellY], direction: 'left' })
      }
      if (this.maze[cellX] && this.maze[cellX][cellY + 1]) {
        neighbors.push({ cell: this.maze[cellX][cellY + 1], direction: 'bottom' })
      }
      if (this.maze[cellX] && this.maze[cellX][cellY - 1]) {
        neighbors.push({ cell: this.maze[cellX][cellY - 1], direction: 'top' })
      }

      // Filter out only traversable neigboring cells
      const potential = neighbors.filter((neighbor) => {
        if (!(neighbor && neighbor.cell)) {
          return false
        }
        const type = neighbor.cell.getType()
        return type === 'empty' || type === 'end'
      })

      if (!this.paused) {
        if (potential.length) {
          this.path.push(cell)
          const direction = this.randomIntInRange(0, potential.length - 1)
          const next = potential[direction]

          // Clear walls to create path
          if (next.direction === 'bottom') {
            cell.setWall('bottom', false)
            next.cell.setWall('top', false)
          } else if (next.direction === 'top') {
            cell.setWall('top', false)
            next.cell.setWall('bottom', false)
          } else if (next.direction === 'left') {
            cell.setWall('left', false)
            next.cell.setWall('right', false)
          } else if (next.direction === 'right') {
            cell.setWall('right', false)
            next.cell.setWall('left', false)
          }

          this.createMazePath(next.cell)
        } else if (this.path.length) {
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
  constructor(
    x,
    y,
    type,
    subType = null,
    walls = {
      top: true,
      bottom: true,
      left: true,
      right: true,
    },
  ) {
    this.x = x
    this.y = y
    this.type = type
    this.subType = subType
    this.walls = walls
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
  getSubType() {
    return this.subType
  }
  getWalls() {
    return this.walls
  }
  setWall(wall, value) {
    this.walls[wall] = value
  }
}
