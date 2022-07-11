import { DISPLAY_HEIGHT, DISPLAY_WIDTH, DISPLAY_MULTIPLY, BG_COLOR } from "./constants/displayConstants";
export class Display {
    constructor() {
        console.log('Construct a new Display object');
        this.screen = document.querySelector('canvas');
        this.screen.width = DISPLAY_WIDTH * DISPLAY_MULTIPLY;
        this.screen.height = DISPLAY_HEIGHT * DISPLAY_MULTIPLY;
        this.context = this.screen.getContext('2d'); // canvas -> access 2D API
        this.context.fillStyle = BG_COLOR; // black
        this.screenBuffer = [];
        this.context.fillRect(0, 0, this.screen.width, this.screen.height);
    }

    reset() {
        for (i = 0; i < this.screen.height; i++) {
            this.screenBuffer.push([]); // creates [i] as an array, 2D array
            for (j = 0; j < this.screen.width; j++) {
                this.screenBuffer[i].push(0); // buf[i][j] = 0
            }
        }
    }
}