import { DISPLAY_HEIGHT, DISPLAY_WIDTH, DISPLAY_MULTIPLY, BG_COLOR } from "./constants/displayConstants";
export class Display {
    constructor() {
        console.log('Construct a new Display object');
        this.screen = document.querySelector('canvas');
        this.screen.width = DISPLAY_WIDTH * DISPLAY_MULTIPLY;
        this.screen.height = DISPLAY_HEIGHT * DISPLAY_MULTIPLY;
        this.context = this.screen.getContext('2d'); // canvas -> access 2D API
        this.context.fillStyle = BG_COLOR; // black
        this.context.fillRect(0, 0, this.screen.width, this.screen.height);
    }
}