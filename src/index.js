import { Chip8 } from './Chip8';

function startupTests(chip8) {
    chip8.registers.stackPush(55);
    console.log(`stack pop: [${chip8.registers.stackPop()}]`);
    for (let i = 0; i < 16; i++) {
        let o = i*5; // offset
        console.log(`${i} sprite: [${chip8.memory.getMemory(o).toString(16)}, ${chip8.memory.getMemory(o+1).toString(16)}, ${chip8.memory.getMemory(o+2).toString(16)}, ${chip8.memory.getMemory(o+3).toString(16)}, ${chip8.memory.getMemory(o+4).toString(16)}]`);
    }
    chip8.display.drawSprite(30, 30, 0x0a, 5);
}

const chip8 = new Chip8();

async function runChip8() {
    // const rom = await fetch('./roms/test_opcode');
    // const arrayBuffer = await rom.arrayBuffer();
    // const romBuffer = new Uint8Array(arrayBuffer);
    // const chip8 = new Chip8(romBuffer);
    // startupTests(chip8);
    // chip8.registers.ST = 2;
    // while (1) {
    //   await chip8.sleep(200);
    //   if (chip8.registers.DT > 0) {
    //     await chip8.sleep();
    //     chip8.registers.DT--;
    //   }
    //   if (chip8.registers.ST > 0) {
    //     chip8.soundCard.enableSound();
    //     await chip8.sleep();
    //     chip8.registers.ST--;
    //   }
    //   if (chip8.registers.ST === 0) {
    //     chip8.soundCard.disableSound();
    //   }
    // }
}
  
//runChip8();

console.log('disassembling');
let result = chip8.disassembler.disassemble(0x00e0);
console.log(`${result ? result : "fail"}`);
