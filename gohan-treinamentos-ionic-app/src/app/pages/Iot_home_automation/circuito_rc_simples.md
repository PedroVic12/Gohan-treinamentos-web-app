
## Sobre os componentes e sabendo fazer boas praticas

Sobre o botão push com 4 pinos:
O botão push de 4 pinos na verdade tem apenas 2 conexões internamente. Os pinos são duplicados para maior estabilidade mecânica. Os pinos de cada lado são conectados internamente, então você pode usar qualquer um dos pinos de cada lado.
Sobre os LEDs:

Perna longa (ânodo): terminal positivo (+)
Perna curta (cátodo): terminal negativo (-)

## Calculando a queda de tensão entre os componentes
- Para a versão com ESP32 (3.3V):

Tensão típica do LED: ~2V
Queda de tensão no resistor: 3.3V - 2V = 1.3V
Com resistor de 220Ω, a corrente será: 1.3V/220Ω = ~6mA
Este valor é seguro para os LEDs!

- Versão com bateria 9V:
Queda de tensão no resistor: 9V - 2V = 7V
Com resistor de 220Ω, a corrente seria: 7V/220Ω = ~32mA
Isso é muito alto! Vamos precisar de resistores em série:
Dois resistores de 220Ω em série = 440Ω
Nova corrente: 7V/440Ω = ~16mA (agora está seguro!)

## VERSÃO 1 - ESP32:

Organização inicial da protoboard:

Conecte um jumper vermelho na linha + (como você mencionou, boa prática!)
Conecte um jumper preto na linha - (GND)
Conecte o ESP32 3.3V à linha vermelha
Conecte o ESP32 GND à linha preta


Conexão do botão push:

Identifique os pares de pinos (use um multímetro se possível)
Um lado do botão vai para a linha vermelha (3.3V) através de um resistor 220Ω
O outro lado vai para:

GPIO12 do ESP32 (para leitura)
Positivo do capacitor




Capacitor:

Terminal positivo (+) conectado ao lado do botão
Terminal negativo (-) para a linha preta (GND)


LEDs (use linhas diferentes da protoboard para organização):
LED Verde:

Perna longa → GPIO25 através de jumper
Perna curta → resistor 220Ω → linha preta

LED Amarelo:

Perna longa → GPIO26 através de jumper
Perna curta → resistor 220Ω → linha preta

LED Vermelho:

Perna longa → GPIO27 através de jumper
Perna curta → resistor 220Ω → linha preta



## VERSÃO 2 - Bateria 9V:

Organização inicial:

Conecte o positivo da bateria à linha vermelha
Conecte o negativo da bateria à linha preta


Conexão do botão:

Um lado para linha vermelha através de resistor 220Ω
Outro lado para o positivo do capacitor


Capacitor:

Terminal positivo (+) ao lado do botão
Terminal negativo (-) à linha preta


LEDs (cada um com dois resistores 220Ω em série):
Para cada LED:

Perna longa → primeiro resistor 220Ω → segundo resistor 220Ω → linha preta
Perna curta → positivo do capacitor



Dicas de organização:

Use cores diferentes de jumpers:

Vermelho: para conexões com 3.3V/9V
Preto: para conexões com GND
Outras cores: para sinais


Mantenha os componentes alinhados:

LEDs em uma área
Circuito do capacitor em outra
Botão em posição de fácil acesso


Teste cada parte separadamente:

Primeiro os LEDs
Depois o botão
Por fim o capacitor