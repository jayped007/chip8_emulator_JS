import { CHAR_SET } from './constants/charSetConstants';
import { CHAR_SET_ADDRESS } from './constants/memoryConstants';
import { TIMER_60_HZ } from './constants/registerConstants';
import { Disassembler } from './Disassembler';

import { Display } from "./Display";
import { Keyboard } from "./Keyboard";
import { Memory } from "./Memory";
import { Registers } from "./Registers";
import { SoundCard } from './SoundCard';

export class Chip8 {
    // Chip8 emulation class
    constructor() {
        console.log('Construct new Chip-8 emulator object');
        this.memory = new Memory();
        this.registers = new Registers();
        this.keyboard = new Keyboard();
        this.soundCard = new SoundCard();
        this.disassembler = new Disassembler();
        this.loadCharSet();
        this.display = new Display(this.memory);
    }

    sleep(ms = TIMER_60_HZ) { // is not itself async but returns a Promise?
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    
    loadCharSet() {
        this.memory.memory.set(CHAR_SET, CHAR_SET_ADDRESS);
    }

}
