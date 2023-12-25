// キーボードの値をDレジスタに格納し続けるだけのプログラム
(LOOP) 
    @KBD
    D=M
    @LOOP
    0;JMP