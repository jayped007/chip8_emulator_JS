import { Display } from "./Display";
import { Memory } from "./Memory";

export class Chip8 {
    // Chip8 emulation class
    constructor() {
        console.log('Construct new Chip-8 emulator object');
        this.display = new Display();
        this.memory = new Memory();
    }
}
