import { Display } from "./Display";
import { Keyboard } from "./Keyboard";
import { Memory } from "./Memory";
import { Registers } from "./Registers";

export class Chip8 {
    // Chip8 emulation class
    constructor() {
        console.log('Construct new Chip-8 emulator object');
        this.display = new Display();
        this.memory = new Memory();
        this.registers = new Registers();
        this.keyboard = new Keyboard();
    }
}
