// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen
// by writing 'black' in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen by writing
// 'white' in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// 何かしらのキーが押されたら、画面を黒くする

// 何かしらのキーが押されているかをチェックする
// R1はスクリーン塗りつぶりカウンター

(LOOP)
    // R0に16bitが黒となる数値をセット
    @0
    D=!A
    @R0
    M=D
    // R1にループカウンタの初期化、なぜか全面分のメモリアクセスするとエラーになるので、
    // 128(4行)にセット
    @128
    D=A
    @R1
    M=D
    // スクリーンのアドレスをR2セット
    @16484 // 実は 16482説あり...。微妙にずれてる。
    D=A
    @R2
    M=D
    @KBD  // 何かのキーが押されているれば、BSLPにジャンプする。
    // キーボードはシミュレーターのキーボードボタンを押したあと、
    // さらにキー入力する必要がある
    D=M
    @BSLP
    D;JNE
(WSLP) // 白スクリーンループ
    @R0
    D=0
    @R2
    A=M // スクリーンのアドレスを取得
    M=D // スクリーンに色をセット
    @R1 // ループカウンタをデクリメント
    M=M-1
    @R2 // スクリーンのアドレスをインクリメント
    M=M+1
    @R1
    D=M // ループカウンタをDに取得
    @WSLP // ループカウンタが0なら、LOOPに戻る
    D;JNE
    // 全部終えたら、LOOPに戻る
    @LOOP
    0;JMP
(BSLP)  // 黒スクリーンループ
    @R0
    D=M // 色をDに取得
    @R2
    A=M // スクリーンのアドレスを取得
    M=D // スクリーンに色をセット
    @R1 // ループカウンタをデクリメント
    M=M-1
    @R2 // スクリーンのアドレスをインクリメント
    M=M+1
    @R1
    D=M // ループカウンタをDに取得
    @BSLP // ループカウンタが0なら、LOOPに戻る
    D;JNE
    // 全部終えたら、LOOPに戻る
    @LOOP
    0;JMP