import { Chip8 } from './Chip8';

const chip8 = new Chip8();
chip8.memory.setMemory(0x05, 0x1B);
console.log(`mem location 0x05 : [${chip8.memory.getMemory(0x05)}]`);
chip8.registers.stackPush(55);
console.log(`stack pop: [${chip8.registers.stackPop()}]`);
