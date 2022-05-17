import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  constructor(public navCtrl: NavController) {
  }

  ngOnInit(): void {
    main()
  }

  restart() {
    START_TIME = new Date().getTime()
    END_TIME = null
    randomizePieces()
    document.getElementById("menuItems").style.display = "none"
  }

  setDifficulty() {
    let diff = (<HTMLInputElement>document.getElementById('difficulty')).value
    switch (diff) {
      case "easy":
        initializePieces(3, 3)
        break
      case "medium":
        initializePieces(5, 5)
        break
      case "hard":
        initializePieces(10, 10)
        break
      case "insane":
        initializePieces(25, 25)
        break

    }
  }

}

let CANVAS = null
let CONTEXT = null
let IMAGE = new Image()
let SCALER = 0.6
let SIZE = { x: 0, y: 0, width: 0, height: 0, rows: 3, columns: 3 }
let PIECES = []
let SELECTED_PIECE = null
let START_TIME = null
let END_TIME = null
let TIME = null

let POP_SOUND = new Audio("../assets/sounds/pop.mp3")
POP_SOUND.volume=0.5

let COMPLETE_SOUND = new Audio("../assets/sounds/complete.mp3")
COMPLETE_SOUND.volume=0.2

function main() {

  CANVAS = document.getElementById('canvas')
  CONTEXT = CANVAS.getContext("2d")
  addEventListeners()

  IMAGE.src = '../assets/imgs/pikachu.jpg'

  IMAGE.onload = function () {
    handleResize()
    window.addEventListener('resize', handleResize)
    initializePieces(3, 3)
    //randomizePieces()
    updateGame()
  }
}

function updateTime() {
  let now = new Date().getTime()
  if (START_TIME != null) {
    if(END_TIME!=null){
      TIME = document.getElementById("time")
      TIME.innerHTML = formatTime(END_TIME - START_TIME)
    }
    else{
      TIME = document.getElementById("time")
      TIME.innerHTML = formatTime(now - START_TIME)
    }
    //console.log(TIME);

  }
}

function isComplete(){
  for(let i=0; i<PIECES.length; i++){
    if(PIECES[i].correct==false){
      return false
    }
  }
  return true
}

function formatTime(miliseconds) {
  let seconds = Math.floor(miliseconds / 1000)
  let s = Math.floor(seconds % 60)
  let m = Math.floor(seconds % (60 * 60) / 60)
  let h = Math.floor(seconds % (60 * 60 * 24) / (60 * 60))

  let formattedTime = h.toString().padStart(2, "0")
  formattedTime += ":"
  formattedTime += m.toString().padStart(2, "0")
  formattedTime += ":"
  formattedTime += s.toString().padStart(2, "0")

  return formattedTime
}

function addEventListeners() {
  CANVAS.addEventListener("mousedown", onMouseDown)
  CANVAS.addEventListener("mousemove", onMouseMove)
  CANVAS.addEventListener("mouseup", onMouseUp)
  CANVAS.addEventListener("touchstart", onTouchStart)
  CANVAS.addEventListener("touchmove", onTouchMove)
  CANVAS.addEventListener("touchend", onTouchEnd)
}

function onTouchStart(evt) {
  let loc = {
    x: evt.touches[0].clientX,
    y: evt.touches[0].clientY
  }
  onMouseDown(loc)
}

function onTouchMove(evt) {
  let loc = {
    x: evt.touches[0].clientX,
    y: evt.touches[0].clientY
  }
  onMouseMove(loc)
}

function onTouchEnd() {
  onMouseUp()
}

function onMouseDown(evt) {
  SELECTED_PIECE = getPressedPiece(evt)
  if (SELECTED_PIECE != null) {
    const index = PIECES.indexOf(SELECTED_PIECE)
    if (index > -1) {
      PIECES.splice(index, 1)
      PIECES.push(SELECTED_PIECE)
    }
    SELECTED_PIECE.offset = {
      x: evt.x - SELECTED_PIECE.x,
      y: evt.y - SELECTED_PIECE.y
    }
    SELECTED_PIECE.correct = false
  }
}

function onMouseMove(evt) {
  if (SELECTED_PIECE != null) {
    SELECTED_PIECE.x = evt.x - SELECTED_PIECE.offset.x
    SELECTED_PIECE.y = evt.y - SELECTED_PIECE.offset.y
    //console.log(SELECTED_PIECE.x)
  }
}

function onMouseUp() {
  if (SELECTED_PIECE != null) {
    if (SELECTED_PIECE.isClose()) {
      SELECTED_PIECE.snap()
      if(isComplete() && END_TIME == null){
        let now = new Date().getTime()
        END_TIME = now
        COMPLETE_SOUND.play()
      }
    }
    //console.log("Entra");
    SELECTED_PIECE = null
  }
}

function getPressedPiece(loc) {
  console.log('MOUSE => X: ' + loc.x + '  Y: ' + loc.y);

  for (let i = PIECES.length - 1; i >= 0; i--) {
    if (loc.x > PIECES[i].x && loc.x < PIECES[i].x + PIECES[i].width &&
      loc.y - 56 > PIECES[i].y && loc.y - 56 < PIECES[i].y + PIECES[i].height) {
      //console.log('PIECE => X: ' + PIECES[i].x + '  Y: ' + PIECES[i].y);
      return PIECES[i]

    }
  }
  return null
}

function handleResize() {
  CANVAS.width = window.innerWidth
  CANVAS.height = window.innerHeight

  let resizer = SCALER * Math.min(
    window.innerWidth / IMAGE.width,
    window.innerHeight / IMAGE.height)

  SIZE.width = resizer * IMAGE.width
  SIZE.height = resizer * IMAGE.height
  SIZE.x = window.innerWidth / 2 - SIZE.width / 2
  SIZE.y = window.innerHeight / 2 - SIZE.height / 2


}

function updateGame() {
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)

  CONTEXT.globalAlpha = 0.5
  CONTEXT.drawImage(IMAGE,
    SIZE.x, SIZE.y,
    SIZE.width, SIZE.height)
  CONTEXT.globalAlpha = 1;

  for (let i = 0; i < PIECES.length; i++) {
    PIECES[i].draw(CONTEXT)
  }

  updateTime()
  window.requestAnimationFrame(updateGame)
}

function initializePieces(rows, cols) {
  SIZE.rows = rows
  SIZE.columns = cols

  PIECES = []
  for (let i = 0; i < SIZE.rows; i++) {
    for (let j = 0; j < SIZE.columns; j++) {
      PIECES.push(new Piece(i, j))
    }
  }
}

function randomizePieces() {
  for (let i = 0; i < PIECES.length; i++) {
    let loc = {
      x: Math.random() * (CANVAS.width - PIECES[i].width),
      y: Math.random() * (CANVAS.height - PIECES[i].height)
    }
    PIECES[i].x = loc.x
    PIECES[i].y = loc.y
    PIECES[i].correct = false
  }
}
class Piece {
  rowIndex: number
  colIndex: number
  x: number
  y: number
  width: number
  height: number
  xCorrect: number
  yCorrect: number
  correct: boolean

  constructor(rowIndex, colIndex) {
    this.rowIndex = rowIndex
    this.colIndex = colIndex
    this.x = SIZE.x + SIZE.width * this.colIndex / SIZE.columns
    this.y = SIZE.y + SIZE.height * this.rowIndex / SIZE.rows
    this.width = SIZE.width / SIZE.columns
    this.height = SIZE.height / SIZE.rows
    this.xCorrect = this.x
    this.yCorrect = this.y
    this.correct = true
  }
  draw(context: any) {
    context.beginPath()

    context.drawImage(IMAGE,
      this.colIndex * IMAGE.width / SIZE.columns,
      this.rowIndex * IMAGE.height / SIZE.rows,
      IMAGE.width / SIZE.columns,
      IMAGE.height / SIZE.rows,
      this.x,
      this.y,
      this.width,
      this.height)

    context.rect(this.x, this.y, this.width, this.height)
    context.stroke()
  }

  isClose() {
    if (distance({ x: this.x, y: this.y },
      { x: this.xCorrect, y: this.yCorrect }) < this.width / 6) {
      return true
    }
    return false
  }

  snap() {
    this.x = this.xCorrect
    this.y = this.yCorrect
    this.correct = true
    POP_SOUND.play()
  }

}

function distance(p1, p2) {
  return Math.sqrt(
    (p1.x - p2.x) * (p1.x - p2.x) +
    (p1.y - p2.y) * (p1.y - p2.y)
  );
}

