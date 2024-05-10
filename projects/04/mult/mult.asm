// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// Assumes that R0 >= 0, R1 >= 0, and R0 * R1 < 32768.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// RO * R1 を計算して R2 に格納する
// 残念ながら、+と-しか使えないのでどうするか？
// 実は、掛け算は足し算を繰り返すことで実現できる

  // まずR2を0で初期化、これをしとかないと実はバグる
  @R2
  M=0 // R2 = 0
(LOOP) // LOOPラベル
  // R1が0なら、ENDに飛んで終了
  @R1 
  D=M // D=R1
  @END // jumpラベルを設定
  D;JEQ // R1==0なら、ENDに飛ぶ
  // R2にR0を足す
  @R0
  D=M // D=R0
  @R2
  M=M+D // R2=R2+R0
  // R1を1減らす
  @R1
  M=M-1 // R1=R1-1
  // ループラベルに飛ぶ
  @LOOP
  0;JMP
(END) // ここでEND後ループし続けるようにする
  @END
  0;JMP