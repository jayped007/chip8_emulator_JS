import { Chip8 } from './Chip8';

const chip8 = new Chip8();
//chip8.memory.setMemory(0x05, 0x1B);
console.log(`mem location 0x05 : [${chip8.memory.getMemory(0x05)}]`);
chip8.registers.stackPush(55);
console.log(`stack pop: [${chip8.registers.stackPop()}]`);
for (let i = 0; i < 16; i++) {
    let o = i*5; // offset
    console.log(`${i} sprite: [${chip8.memory.getMemory(o).toString(16)}, ${chip8.memory.getMemory(o+1).toString(16)}, ${chip8.memory.getMemory(o+2).toString(16)}, ${chip8.memory.getMemory(o+3).toString(16)}, ${chip8.memory.getMemory(o+4).toString(16)}]`);
}
chip8.display.drawSprite(1, 1, 0x0a, 5);