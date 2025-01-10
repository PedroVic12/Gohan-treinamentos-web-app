

# Documentação do Sistema de Rastreamento e Análise de Movimentos Corporais - Goku IA Trainer

## Descrição do Sistema

Este sistema utiliza as tecnologias **MediaPipe** e **OpenCV** para rastrear os movimentos do corpo humano em tempo real, analisando os ângulos articulares e fornecendo feedback instantâneo sobre a postura e técnica. É ideal para ser usado em atividades físicas e esportivas, como flexões, exercícios de barra e artes marciais.

## Funcionalidades

- **Rastreamento de Movimentos Corporais**: O sistema identifica e mapeia os pontos-chave do corpo humano, como articulações, e exibe-os visualmente.
- **Análise de Ângulos Articulares**: O sistema calcula os ângulos entre as articulações e fornece informações sobre a postura durante o movimento.
- **Feedback Imediato**: Fornece informações em tempo real sobre os ângulos articulares e o progresso durante o exercício.
- **Aplicação Multidisciplinar**: Pode ser utilizado tanto para treinos físicos quanto para esportes como artes marciais (exemplo: karatê).

## Tecnologias Utilizadas

- **Python**: Linguagem de programação para integração das bibliotecas.
- **MediaPipe**: Biblioteca do Google para rastreamento de pontos-chave do corpo.
- **OpenCV**: Biblioteca de visão computacional para manipulação de vídeos.
- **Inteligência Artificial (Deep Learning)**: Algoritmos para rastrear e calcular os movimentos.

## Dependências

O sistema depende das bibliotecas a seguir. Para instalá-las, utilize o comando:

```bash
pip install mediapipe opencv-python
```

## Arquitetura do Sistema

1. **Rastreamento de Movimento Corporal**:
   - Utiliza o **MediaPipe** para rastrear os pontos-chave do corpo humano em vídeos (ex: ombro, cotovelo, joelho).
   
2. **Cálculo de Ângulos Articulares**:
   - Calcula os ângulos entre as articulações e fornece feedback em tempo real.
   
3. **Exibição de Feedback**:
   - O feedback sobre a postura e os ângulos das articulações é mostrado diretamente no vídeo.

## Como Usar

### Passo 1: Modificar o Caminho do Array de Vídeos

1. Abra o arquivo `goku_IA_trainer.py` no diretório.
2. Localize a linha onde o caminho para os vídeos é especificado.
3. Modifique o caminho do arquivo para apontar para o local correto onde seus vídeos estão armazenados.

Por exemplo, no código abaixo, modifique o valor do array `videos_paths`:

```python
# Caminhos para os vídeos de entrada
videos_paths = [
    "caminho/para/o/video1.mp4",
    "caminho/para/o/video2.mp4",
    "caminho/para/o/video3.mp4"
]
```

Substitua `"caminho/para/o/videoX.mp4"` pelo caminho correto do seu arquivo de vídeo.

### Passo 2: Executar o Código

Depois de modificar o caminho dos vídeos, você pode rodar o código com o seguinte comando:

```bash
python goku_IA_trainer.py
```

### Passo 3: Interagir com o Sistema

1. O sistema irá abrir o vídeo e iniciar o rastreamento dos pontos-chave do corpo.
2. Ele calculará os ângulos articulares e exibirá as informações em tempo real no vídeo.
3. O feedback será fornecido diretamente sobre o vídeo, ajudando a corrigir posturas e otimizar os movimentos.

### Passo 4: Personalização

- Se você quiser adicionar mais vídeos para análise, basta adicionar os caminhos dos arquivos de vídeo ao array `videos_paths` no arquivo `goku_IA_trainer.py`.
- O código está preparado para ser facilmente expandido para incluir novos tipos de exercícios ou técnicas esportivas.

## Exemplo de Código

Aqui está um trecho básico do código que você encontrará no arquivo `goku_IA_trainer.py`:

```python
import cv2
import mediapipe as mp
import math

# Caminhos para os vídeos de entrada
videos_paths = [
    "caminho/para/o/video1.mp4",  # Modifique para o caminho correto do vídeo
    "caminho/para/o/video2.mp4"
]

# Inicialização do MediaPipe para rastreamento de pontos-chave
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Função para calcular ângulo entre três pontos
def calcular_angulo(ponto1, ponto2, ponto3):
    angulo = math.degrees(
        math.atan2(ponto3[1] - ponto2[1], ponto3[0] - ponto2[0]) -
        math.atan2(ponto1[1] - ponto2[1], ponto1[0] - ponto2[0])
    )
    return angulo

# Processar cada vídeo
for video_path in videos_paths:
    cap = cv2.VideoCapture(video_path)

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Conversão para RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            resultado = pose.process(frame_rgb)

            # Desenho dos pontos-chave e cálculo de ângulos
            if resultado.pose_landmarks:
                mp_drawing.draw_landmarks(frame, resultado.pose_landmarks, mp_pose.POSE_CONNECTIONS)

                # Exemplo de cálculo de ângulo de flexão de braço
                ponto1 = resultado.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
                ponto2 = resultado.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW]
                ponto3 = resultado.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST]
                angulo = calcular_angulo((ponto1.x, ponto1.y), (ponto2.x, ponto2.y), (ponto3.x, ponto3.y))

                # Exibindo o ângulo calculado
                cv2.putText(frame, f'Angulo: {int(angulo)}', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            # Exibição do vídeo
            cv2.imshow('Rastreamento de Movimentos', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    cap.release()
cv2.destroyAllWindows()
```


Esse sistema oferece uma maneira prática e eficaz de analisar e melhorar a técnica de movimentos corporais em tempo real, utilizando rastreamento de pontos-chave e cálculo de ângulos articulares. Ao modificar o caminho dos vídeos no código, você pode facilmente aplicar o sistema a diferentes exercícios ou práticas esportivas.

