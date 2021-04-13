const w : number = window.innerWidth 
const h : number = window.innerHeight 
const scGap : number = 0.02 
const delay : number = 20 
const sizeFactor : number = 2 
const imageFactor : string = `car`;
const size : number = Math.min(w, h) / sizeFactor

class PixelContainer {

    pixels  : Array<Uint8ClampedArray> = []

    loadImage(i : number) {
        const r : HTMLImageElement = new Image()
        r.src = `${imageFactor}${i}.jpg`
        r.onload = () => {
            const canvas : HTMLCanvasElement = document.createElement('canvas')
            canvas.width = size 
            canvas.height = size 
            const context = canvas.getContext('2d')
            context.drawImage(r, 0, 0, size, size)
            const imageData : ImageData  = context.getImageData(0, 0, size, size)
            this.pixels.push(imageData.data)
            console.log("img", imageData.data)
        }
    }

    getPixels(i : number) : Uint8ClampedArray {
        return this.pixels[i]
    }
}

const pixelContainer : PixelContainer = new PixelContainer()

for (var j = 1; j < 6; j++) {
    pixelContainer.loadImage(j)
}

class DrawingUtil {

    static drawPixelImage(context : CanvasRenderingContext2D, images : Array<HTMLImageElement>, i : number, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const pixel1 : Uint8ClampedArray = pixelContainer.getPixels(i)
        const pixel2 : Uint8ClampedArray = pixelContainer.getPixels(i)
        const imageData : ImageData = context.getImageData(0, 0, size, size)
        const data = imageData.data;
        for (var j = 0; j < pixel1.length; j++) {
            data[j] = pixel1[j] + (pixel2[j] - pixel1[j]) * scale 
            data[j + 1] = pixel1[j + 1] + (pixel2[j + 1] - pixel1[j + 1]) * scale
            data[j + 2] = pixel1[j + 2] + (pixel2[j + 2] - pixel1[j + 2]) * scale
        }
         
        context.putImageData(imageData, 0, 0)
    }
}

class State {

    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : Function) {
        this.scale += this.dir * scGap  
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0 
            this.prevScale = this.scale 
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
        }
    }
}

class Animator {

    animated : boolean = false 
    interval : number 
    
    start(cb : Function) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }
    
    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = "#bdbdbd" 
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}