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

}

let horas, minutos, segundos, hor, min, seg;
horas=0
minutos=0
segundos=0

let CANVAS = null
let CONTEXT = null
let IMAGE = new Image()
let SCALER = 0.6

let SIZE = { x: 0, y: 0, width: 0, height: 0, rows: 3, columns: 3 }
let PIECES = []
let SELECTED_PIECE = null

function main() {

hor=document.getElementById("horas");
min=document.getElementById("minutos");
seg=document.getElementById("segundos");

  CANVAS = document.getElementById('canvas')
  CONTEXT = CANVAS.getContext("2d")
  addEventListeners()

  IMAGE.src = '../assets/imgs/pikachu.jpg'

  IMAGE.onload = function () {
    handleResize()
    window.addEventListener('resize', handleResize)
    initializePieces()
    //randomizePieces()
    updateCanvas()
    tiempo()

  }
}

function addEventListeners() {
  CANVAS.addEventListener("mousedown", onMouseDown)
  CANVAS.addEventListener("mousemove", onMouseMove)
  CANVAS.addEventListener("mouseup", onMouseUp)
}

function onMouseDown(evt) {
  SELECTED_PIECE = getPressedPiece(evt)

  if (SELECTED_PIECE != null) {
    SELECTED_PIECE.offset = {
      x: evt.x - SELECTED_PIECE.x,
      y: evt.y - SELECTED_PIECE.y
    }
  }
}

function onMouseMove(evt) {
  if (SELECTED_PIECE != null) {
    SELECTED_PIECE.x = evt.x - SELECTED_PIECE.offset.x
    SELECTED_PIECE.y = evt.y - SELECTED_PIECE.offset.y
    //console.log(SELECTED_PIECE.x)
  }
}

function onMouseUp(evt) {
  SELECTED_PIECE = null
}

function getPressedPiece(loc) {
  console.log('MOUSE => X: ' + loc.x + '  Y: ' + loc.y);

  for (let i = 0; i < PIECES.length; i++) {
    if (loc.x > PIECES[i].x && loc.x < PIECES[i].x + PIECES[i].width &&
      loc.y > PIECES[i].y && loc.y < PIECES[i].y + PIECES[i].height) {
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

function updateCanvas() {
  window.requestAnimationFrame(updateCanvas)
  CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height)

  CONTEXT.globalAlpha = 0.5
  CONTEXT.drawImage(IMAGE,
    SIZE.x, SIZE.y,
    SIZE.width, SIZE.height)
  CONTEXT.globalAlpha = 1;

  for (let i = 0; i < PIECES.length; i++) {
    PIECES[i].draw(CONTEXT)
  }
}

function initializePieces() {

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
  }
}
class Piece {
  rowIndex: number
  colIndex: number
  x: number
  y: number
  width: number
  height: number

  constructor(rowIndex, colIndex) {
    this.rowIndex = rowIndex
    this.colIndex = colIndex
    this.x = SIZE.x + SIZE.width * this.colIndex / SIZE.columns
    this.y = SIZE.y + SIZE.height * this.rowIndex / SIZE.rows
    this.width = SIZE.width / SIZE.columns
    this.height = SIZE.height / SIZE.rows
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

}

function tiempo(){
  var contador=0;
  window.setInterval(function(){
      if(contador<10){
          seg.innerHTML="0"+contador;
      }else{
          seg.innerHTML= contador;
      }
      if (contador>59){
          segundos=0;
          contador=0;
          minutos=minutos+1;
      }
      if (minutos>59){
          minutos=0;
          horas=horas+1;
      }
      if (horas>23){
          horas=0;
      }
      if (minutos<10){
          min.innerHTML="0"+minutos;
      }else{ min.innerHTML=minutos;}
      if (horas<10){
          hor.innerHTML="0"+horas;
      }else{ hor.innerHTML=horas;}
      contador++;
  },1000);
  addEventListeners()
}
