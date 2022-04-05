import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  constructor(public navCtrl: NavController) {

  }
  ngOnInit() {
    trocearImagen()
  }
}

function trocearImagen() {

  var startX, startY
  var areaX, areaY
  var posX, posY
  var width, height
  var cont1, cont2
  var i, j
  var rows, columns
  const scale = 100

  var image = new Image(),
    canvas = <HTMLCanvasElement>document.getElementById('canvas')
  var ctx = canvas.getContext('2d')

  image.src = '../assets/imgs/pikachu.jpg'

  image.onload = function () {

    height = image.height
    width = image.width
    startX = 0
    startY = 0
    posX = 0
    posY = 0
    rows = 3
    columns = 3
    areaX = width / rows
    areaY = height / columns
    cont1 = 0
    cont2 = 0

    for (i = 0; i < columns; i++) {
      if (cont1 != 0) {
        startY = startY + areaY
        posY = posY + scale + 1
        cont1++
      }
      else {
        cont1++
      }
      for (j = 0; j < rows; j++) {
        if (cont2 == 3) {
          cont2 = 0
          startX = 0
          posX = 0
        }
        if (cont2 != 0) {
          startX = startX + areaX
          posX = posX + scale + 1
          cont2++
        }
        else {
          cont2++
        }
        ctx.drawImage(image,
          startX, startY,   // Start at 70/20 pixels from the left and the top of the image (crop),
          areaX, areaY,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
          posX, posY,     // Place the result at 0, 0 in the canvas,
          scale, scale); // With as width / height: 100 * 100 (scale)

      }
    }
    /*
    ctx.drawImage(image,
      0, 0,   // Start at 70/20 pixels from the left and the top of the image (crop),
      400, 300,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
      0, 0,     // Place the result at 0, 0 in the canvas,
      100, 100); // With as width / height: 100 * 100 (scale)

    ctx.drawImage(image,
      400, 0,   // Start at 70/20 pixels from the left and the top of the image (crop),
      400, 300,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
      101, 0,     // Place the result at 0, 0 in the canvas,
      100, 100); // With as width / height: 100 * 100 (scale)

    ctx.drawImage(image,
      800, 0,   // Start at 70/20 pixels from the left and the top of the image (crop),
      400, 300,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
      202, 0,     // Place the result at 0, 0 in the canvas,
      100, 100); // With as width / height: 100 * 100 (scale)

    ctx.drawImage(image,
      0, 300,   // Start at 70/20 pixels from the left and the top of the image (crop),
      400, 300,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
      0, 101,     // Place the result at 0, 0 in the canvas,
      100, 100); // With as width / height: 100 * 100 (scale)

    ctx.drawImage(image,
      400, 300,   // Start at 70/20 pixels from the left and the top of the image (crop),
      400, 300,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
      101, 101,     // Place the result at 0, 0 in the canvas,
      100, 100); // With as width / height: 100 * 100 (scale)

    ctx.drawImage(image,
      800, 300,   // Start at 70/20 pixels from the left and the top of the image (crop),
      400, 300,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
      202, 101,     // Place the result at 0, 0 in the canvas,
      100, 100); // With as width / height: 100 * 100 (scale)

    ctx.drawImage(image,
      0, 600,   // Start at 70/20 pixels from the left and the top of the image (crop),
      400, 300,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
      0, 202,     // Place the result at 0, 0 in the canvas,
      100, 100); // With as width / height: 100 * 100 (scale)

    ctx.drawImage(image,
      400, 600,   // Start at 70/20 pixels from the left and the top of the image (crop),
      400, 300,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
      101, 202,     // Place the result at 0, 0 in the canvas,
      100, 100); // With as width / height: 100 * 100 (scale)

    ctx.drawImage(image,
      800, 600,   // Start at 70/20 pixels from the left and the top of the image (crop),
      400, 300,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
      202, 202,     // Place the result at 0, 0 in the canvas,
      100, 100); // With as width / height: 100 * 100 (scale)
     */

  }
}










