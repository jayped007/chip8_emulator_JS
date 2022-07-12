import { Chip8 } from './Chip8';

// function startupTests(chip8) {
//     chip8.registers.stackPush(55);
//     console.log(`stack pop: [${chip8.registers.stackPop()}]`);
//     for (let i = 0; i < 16; i++) {
//         let o = i*5; // offset
//         console.log(`${i} sprite: [${chip8.memory.getMemory(o).toString(16)}, ${chip8.memory.getMemory(o+1).toString(16)}, ${chip8.memory.getMemory(o+2).toString(16)}, ${chip8.memory.getMemory(o+3).toString(16)}, ${chip8.memory.getMemory(o+4).toString(16)}]`);
//     }
//     chip8.display.drawSprite(30, 30, 0x0a, 5);
// }

// async function loadRom() {
//     const rom = await fetch('./roms/test_opcode');
//     console.log("after fetch of rom");
//     console.log(`rom: ${rom}`);
//     const arrayBuffer = await rom.arrayBuffer();
//     const romBuffer = new Uint8Array(arrayBuffer);
//     console.log(`romBuffer: ${romBuffer}`);
//     return romBuffer;
// }

async function runChip8() {
    const rom = await fetch('./roms/test_opcode');
    const arrayBuffer = await rom.arrayBuffer();
    const romBuffer = new Uint8Array(arrayBuffer);
    const chip8 = new Chip8(romBuffer);
    while (1) {
      await chip8.sleep(5); // 200
      if (chip8.registers.DT > 0) {
        await chip8.sleep();
        chip8.registers.DT--;
      }
      if (chip8.registers.ST > 0) {
        chip8.soundCard.enableSound();
        await chip8.sleep();
        chip8.registers.ST--;
      }
      if (chip8.registers.ST === 0) {
        chip8.soundCard.disableSound();
      }
      let opcode = chip8.memory.getOpcode(chip8.registers.PC);
      chip8.execute(opcode);

    //   if (chip8.registers.PC > 0x200+romBuffer.length) {
    //     alert("PC out of range!");
    //     exit(1);
    //   }
    }
}

console.log("Start me up");
runChip8();
