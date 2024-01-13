(async () => {
    console.log('Assembler started...');

    const filename = process.argv[2];
    console.log(`Filename: ${filename}`);

    const fs = require('fs');
    const readline = require('readline');
    const readInterface = readline.createInterface({
        input: fs.createReadStream(filename),
        output: process.stdout,
        console: false
    });

    // 二回パースをするので一旦メモリに全部読み込む
    const lines = [];
    for await (const line of readInterface) {
        lines.push(line);
    }

    // コマンドの種類の定義
    const A_COMMAND = "A_COMMAND";
    const C_COMMAND = "C_COMMAND";
    const L_COMMAND = "L_COMMAND";

    // パースのためのモジュール
    const Parser = {
        currentLineIndex: 0,
        init: () => {
            Parser.currentLineIndex = 0;
        },
        currentLine: () => {
            return lines[Parser.currentLineIndex];
        }, 
        hasMoreCommands: () => {
            return Parser.currentLineIndex < lines.length;
        },
        advance: () => {
            Parser.currentLineIndex++;
        },
        trimAndRemoveComment: () => {
            const line = Parser.currentLine();
            const commentIndex = line.indexOf('//');
            if (commentIndex === -1) {
                return line.trim();
            } else {
                return line.substring(0, commentIndex).trim();
            }
        },
        commandType: () => {
            const line = Parser.trimAndRemoveComment();
            if (line.startsWith('@')) {
                return A_COMMAND;
            } else if (line.startsWith('(')) {
                return L_COMMAND;
            } else if (line.includes('=') || line.includes(';')) {
                return C_COMMAND;
            } else {
                return null;
            }
        },
        symbol: () => {
            const line = Parser.trimAndRemoveComment();
            const commandType = Parser.commandType();
            if (commandType === A_COMMAND) {
                return line.substring(1);
            } else if (commandType === L_COMMAND) {
                return line.substring(1, line.length - 1);
            } else {
                throw new Error('invalid command type');
            }
        },
        dest: () => {
            const line = Parser.trimAndRemoveComment();
            const commandType = Parser.commandType();
            if (commandType === C_COMMAND) {
                if (line.includes('=')) {
                    return line.split('=')[0];
                } else {
                    return null;
                }
            } else {
                throw new Error('invalid command type');
            }
        },
        comp: () => {
            const line = Parser.trimAndRemoveComment();
            const commandType = Parser.commandType();
            if (commandType === C_COMMAND) {
                if (line.includes('=')) {
                    return line.split('=')[1];
                } else if (line.includes(';')) {
                    return line.split(';')[0];
                } else {
                    throw new Error('invalid command type');
                }
            } else {
                throw new Error('invalid command type');
            }
        },
        jump: () => {
            const line = Parser.trimAndRemoveComment();
            const commandType = Parser.commandType();
            if (commandType === C_COMMAND) {
                if (line.includes(';')) {
                    return line.split(';')[1];
                } else {
                    return null;
                }
            } else {
                throw new Error('invalid command type');
            }
        }
    };

    // バイナリコードへの変換モジュール
    const Code = {
        dest: (mnemonic) => {
            if (mnemonic === 'null' || mnemonic == '' || mnemonic === null) {
                return '000';
            } else if (mnemonic === 'M') {
                return '001';
            } else if (mnemonic === 'D') {
                return '010';
            } else if (mnemonic === 'MD') {
                return '011';
            } else if (mnemonic === 'A') {
                return '100';
            } else if (mnemonic === 'AM') {
                return '101';
            } else if (mnemonic === 'AD') {
                return '110';
            } else if (mnemonic === 'AMD') {
                return '111';
            } else {
                throw new Error('invalid mnemonic');
            }
        },
        comp: (mnemonic) => {
            if (mnemonic === '0') {
                return '0101010';
            } else if (mnemonic === '1') {
                return '0111111';
            } else if (mnemonic === '-1') {
                return '0111010';
            } else if (mnemonic === 'D') {
                return '0001100';
            } else if (mnemonic === 'A') {
                return '0110000';
            } else if (mnemonic === '!D') {
                return '0001101';
            } else if (mnemonic === '!A') {
                return '0110001';
            } else if (mnemonic === '-D') {
                return '0001111';
            } else if (mnemonic === '-A') {
                return '0110011';
            } else if (mnemonic === 'D+1') {
                return '0011111';
            } else if (mnemonic === 'A+1') {
                return '0110111';
            } else if (mnemonic === 'D-1') {
                return '0001110';
            } else if (mnemonic === 'A-1') {
                return '0110010';
            } else if (mnemonic === 'D+A') {
                return '0000010';
            } else if (mnemonic === 'D-A') {
                return '0010011';
            } else if (mnemonic === 'A-D') {
                return '0000111';
            } else if (mnemonic === 'D&A') {
                return '0000000';
            } else if (mnemonic === 'D|A') {
                return '0010101';
            } else if (mnemonic === 'M') {
                return '1110000';
            } else if (mnemonic === '!M') {
                return '1110001';
            } else if (mnemonic === '-M') {
                return '1110011';
            } else if (mnemonic === 'M+1') {
                return '1110111';
            } else if (mnemonic === 'M-1') {
                return '1110010';
            } else if (mnemonic === 'D+M') {
                return '1000010';
            } else if (mnemonic === 'D-M') {
                return '1010011';
            } else if (mnemonic === 'M-D') {
                return '1000111';
            } else if (mnemonic === 'D&M') {
                return '1000000';
            } else if (mnemonic === 'D|M') {    
                return '1010101';
            } else {
                throw new Error('invalid mnemonic');
            }
        },
        jump: (mnemonic) => {
            if (mnemonic === 'null' || mnemonic == '' || mnemonic === null) {
                return '000';
            } else if (mnemonic === 'JGT') {
                return '001';
            } else if (mnemonic === 'JEQ') {
                return '010';
            } else if (mnemonic === 'JGE') {
                return '011';
            } else if (mnemonic === 'JLT') {
                return '100';
            } else if (mnemonic === 'JNE') {
                return '101';
            } else if (mnemonic === 'JLE') {
                return '110';
            } else if (mnemonic === 'JMP') {
                return '111';
            } else {
                throw new Error('invalid mnemonic');
            }
        }
    };
    const SymbolTable = {
        map : new Map(),
        init: () => {
            SymbolTable.map.set('SP', 0);
            SymbolTable.map.set('LCL', 1);
            SymbolTable.map.set('ARG', 2);
            SymbolTable.map.set('THIS', 3);
            SymbolTable.map.set('THAT', 4);
            SymbolTable.map.set('R0', 0);
            SymbolTable.map.set('R1', 1);
            SymbolTable.map.set('R2', 2);
            SymbolTable.map.set('R3', 3);
            SymbolTable.map.set('R4', 4);
            SymbolTable.map.set('R5', 5);
            SymbolTable.map.set('R6', 6);
            SymbolTable.map.set('R7', 7);
            SymbolTable.map.set('R8', 8);
            SymbolTable.map.set('R9', 9);
            SymbolTable.map.set('R10', 10);
            SymbolTable.map.set('R11', 11);
            SymbolTable.map.set('R12', 12);
            SymbolTable.map.set('R13', 13);
            SymbolTable.map.set('R14', 14);
            SymbolTable.map.set('R15', 15);
            SymbolTable.map.set('SCREEN', 16384);
            SymbolTable.map.set('KBD', 24576);
        },
        addEntry: (symbol, address) => {
            SymbolTable.map.set(symbol, address);
        },
        contains: (symbol) => {
            return SymbolTable.map.has(symbol);
        },
        getAddress: (symbol) => {
            return SymbolTable.map.get(symbol);
        }
    };


    // メインの処理
    // 一度目のパース
    Parser.init();
    let romAddress = 0;
    while (Parser.hasMoreCommands()) {
        const commandType = Parser.commandType();
        if (commandType === A_COMMAND || commandType === C_COMMAND) {
            romAddress++;
        } else if (commandType === L_COMMAND) {
            SymbolTable.addEntry(Parser.symbol(), romAddress);
        }
        Parser.advance();
    }

    // 二度目のパース
    Parser.init();
    let ramAddress = 16;
    while (Parser.hasMoreCommands()) {
        const commandType = Parser.commandType();
        if (commandType === A_COMMAND) {
            const symbol = Parser.symbol();
            if (Number.isInteger(Number(symbol))) {
                // 数値の場合はそのまま
            } else if (SymbolTable.contains(symbol)) {
                // シンボルテーブルに登録されている場合はそのアドレスを取得
                SymbolTable.getAddress(symbol);
            } else {
                // それ以外の場合は新しい変数として登録
                SymbolTable.addEntry(symbol, ramAddress);
                ramAddress++;
            }
        }
        Parser.advance();
    }

    // 三度目のパース
    Parser.init();
    let hackCode = '';
    while (Parser.hasMoreCommands()) {
        const commandType = Parser.commandType();
        if (commandType === A_COMMAND) {
            const symbol = Parser.symbol();
            if (Number.isInteger(Number(symbol))) {
                hackCode += '0' + Number(symbol).toString(2).padStart(15, '0') + '\n';
            } else {
                hackCode += '0' + SymbolTable.getAddress(symbol).toString(2).padStart(15, '0') + '\n';
            }
        } else if (commandType === C_COMMAND) {
            hackCode += '111' + Code.comp(Parser.comp()) + Code.dest(Parser.dest()) + Code.jump(Parser.jump()) + '\n';
        }
        Parser.advance();
    }

    // ファイルに書き込み
    const hackFilename = filename.replace('.asm', '.hack');
    fs.writeFileSync(hackFilename, hackCode);

    console.log('Assembler finished...');
})();