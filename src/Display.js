import { DISPLAY_HEIGHT, DISPLAY_WIDTH, DISPLAY_MULTIPLY, BG_COLOR, COLOR } from "./constants/displayConstants";
export class Display {
    constructor() {
        console.log('Construct a new Display object');
        this.screen = document.querySelector('canvas');
        this.screen.width = DISPLAY_WIDTH * DISPLAY_MULTIPLY;
        this.screen.height = DISPLAY_HEIGHT * DISPLAY_MULTIPLY;
        this.context = this.screen.getContext('2d'); // canvas -> access 2D API
        this.context.fillStyle = BG_COLOR; // black
        this.frameBuffer = [];
        this.reset();
    }

    reset() {
        let loops = 0;
        for (let i = 0; i < DISPLAY_HEIGHT; i++) {
            loops++;
            this.frameBuffer.push([]); // creates [i] as an array, 2D array
            for (let j = 0; j < DISPLAY_WIDTH; j++) {
                loops++;
                this.frameBuffer[i].push((loops & 1 == 1) ? 1 : 0); // buf[i][j] = 0
            }
        }
        this.context.fillRect(0, 0, this.screen.width, this.screen.height);
        this.drawBuffer();
        console.log('reset display');
    }

    drawBuffer() {
        console.log('drawBuffer()');
        for (let i = 0; i < DISPLAY_HEIGHT; i++) {
            this.frameBuffer.push([]); // creates [i] as an array, 2D array
            for (let j = 0; j < DISPLAY_WIDTH; j++) {
                this.drawPixel(i, j, this.frameBuffer[i][j]); // (y, x)
            }
        }        
    }

    drawPixel(y, x, value) {
        this.context.fillStyle = value ? COLOR : BG_COLOR;
        this.context.fillRect(
            x * DISPLAY_MULTIPLY, y*DISPLAY_MULTIPLY,
            (x+1)*DISPLAY_MULTIPLY, (y+1)*DISPLAY_MULTIPLY);
    }
}