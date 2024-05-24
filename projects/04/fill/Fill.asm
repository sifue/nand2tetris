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

// 無限ループ処理
// まずは、スクリーンを黒くする実装を考える

// SCREENの位置にアドレスを合わせる
// そこから8192回、メモリに書き込むため、カウンタに8191をセットする
// R0をカウンタとして利用する
// M=-1
// アドレスにカウンタを足して、下から塗りつぶす
// 8192回繰り返す、カウンタを1でデクリメントとする
// カウンタ変数が-1になったら終了
// 無限ループに戻る

(LOOP) // 無限ループ処理ジャンプラベル
  @KBD
  D=M // キーボードの値をDレジスタに取得
  @DRAWB
  D;JNE // もしキーボードが押されている(0ではない)ならDRAWB処理へジャンプ

(DRAWW) // スクリーン全体の描画 (白)
  @8191 // 8192を持ってくるために一旦AレジスタからDレジスタにコピー
  D=A
  @R0 // R0をカウンタとして利用して、8191をセット
  M=D
(DRAWLW) // 16bit分の描画用ループ処理ジャンプラベル (下から塗る)
  @R0 // Dレジスタにカウンタを取る
  D=M
  @SCREEN // SCREENの位置にアドレスを合わせててカウンタを足す
  A=A+D
  M=0 // 白で塗りつぶす
  @R0 // R0カウンタをデクリメント
  M=M-1
  D=M // 比較のために一度DにR0の値をコピー
  @DRAWLW // DRAWループ処理へのジャンプ
  D;JGE // カウンタが0以上の時はDRAWループ処理へ戻る
@LOOP
0;JMP

(DRAWB) // スクリーン全体の描画 (黒)
  @8191 // 8192を持ってくるために一旦AレジスタからDレジスタにコピー
  D=A
  @R0 // R0をカウンタとして利用して、8191をセット
  M=D
(DRAWLB) // 16bit分の描画用ループ処理ジャンプラベル (下から塗る)
  @R0 // Dレジスタにカウンタを取る
  D=M
  @SCREEN // SCREENの位置にアドレスを合わせててカウンタを足す
  A=A+D
  M=-1 // 黒で塗りつぶす
  @R0 // R0カウンタをデクリメント
  M=M-1
  D=M // 比較のために一度DにR0の値をコピー
  @DRAWLB // DRAWループ処理へのジャンプ
  D;JGE // カウンタが0以上の時はDRAWループ処理へ戻る
@LOOP
0;JMP