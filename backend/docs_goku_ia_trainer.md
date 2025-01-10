# Documentação do Sistema de Rastreamento e Análise de Movimentos Corporais

## Introdução

Este sistema realiza o rastreamento e análise dos movimentos corporais utilizando a tecnologia MediaPipe. Ele permite a visualização dos ângulos articulares em tempo real, oferecendo feedback imediato sobre a postura e técnica de movimentos realizados em atividades físicas e esportes, como flexões, exercícios de barra e artes marciais (por exemplo, karatê). A aplicação é construída utilizando as bibliotecas OpenCV, MediaPipe e Python.
Tecnologias Utilizadas

    Python: Linguagem de programação utilizada para integrar e orquestrar as bibliotecas.
    MediaPipe: Biblioteca do Google para o rastreamento de pontos-chave do corpo humano.
    OpenCV: Biblioteca de visão computacional para manipulação de imagens e vídeos.
    Inteligência Artificial (Deep Learning): Modelos de aprendizado de máquina para rastreamento de movimentos e cálculo de ângulos.

Dependências

Antes de rodar o sistema, certifique-se de ter as seguintes bibliotecas instaladas:

pip install mediapipe opencv-python

Arquitetura do Sistema

O sistema é composto por duas partes principais:

    Rastreamento de Movimento Corporal:
        A partir de vídeos em tempo real, o sistema utiliza o MediaPipe para identificar e rastrear os pontos-chave do corpo humano, como ombro, cotovelo, joelho, tornozelo, etc. Estes pontos são representados visualmente como círculos coloridos em vídeos.
    Cálculo de Ângulos Articulares:
        Após o rastreamento, o sistema calcula os ângulos formados entre os pontos-chave do corpo para analisar o movimento das articulações (como o ângulo do cotovelo durante flexões ou o ângulo da perna durante um chute). Esse valor é exibido em tempo real no vídeo.

Como Funciona

    Captura de Vídeo: O sistema captura o vídeo da câmera (ou de um arquivo de vídeo) e processa os quadros individualmente.
    Rastreamento de Pontos-chave: O MediaPipe analisa cada quadro para identificar e rastrear os pontos-chave do corpo humano.
    Cálculo dos Ângulos: Utilizando os pontos-chave identificados, o sistema calcula os ângulos articulares entre os pontos de interesse.
    Exibição de Feedback: O feedback (como os ângulos e as repetições) é exibido em tempo real no vídeo, fornecendo uma análise precisa da postura e movimento.

Estrutura do Código

Aqui está um esboço básico do código que foi utilizado para implementar o sistema:
1. Importação das Bibliotecas

import cv2
import mediapipe as mp
import math

2. Inicialização do MediaPipe e OpenCV

# Inicialização do MediaPipe para rastreamento de pontos-chave
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Inicialização do OpenCV para captura de vídeo
cap = cv2.VideoCapture(0)  # ou caminho para um arquivo de vídeo

3. Função de Rastreamento e Cálculo de Ângulos

def calcular_angulo(ponto1, ponto2, ponto3):
    # Cálculo de ângulo entre três pontos
    angulo = math.degrees(
        math.atan2(ponto3[1] - ponto2[1], ponto3[0] - ponto2[0]) -
        math.atan2(ponto1[1] - ponto2[1], ponto1[0] - ponto2[0])
    )
    return angulo

# Captura dos quadros de vídeo
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

4. Feedback Visual e Interatividade

O sistema exibe o ângulo de cada articulação e permite a análise em tempo real. O feedback pode ser fornecido de forma contínua durante o treino ou exercício, com indicadores visuais de performance (ângulos, repetições, etc.).
Exemplos de Aplicação

    Flexões: O sistema calcula o ângulo entre ombro, cotovelo e punho, ajudando a corrigir a postura durante o movimento de flexão.
    Exercícios de Barra: O sistema rastreia o movimento da barra fixa e fornece análise sobre a posição do corpo.
    Artes Marciais: O sistema analisa os movimentos de chutes e golpes, fornecendo feedback sobre a precisão dos ângulos das articulações.

Como Rodar o Sistema

    Instalar Dependências:
        Utilize o comando pip install mediapipe opencv-python para instalar as bibliotecas necessárias.

    Executar o Código:
        Execute o código principal, que abrirá a webcam ou o arquivo de vídeo para análise.
        O feedback visual será exibido diretamente no vídeo, com ângulos calculados e pontos-chave destacados.

    Personalizar e Testar:
        Experimente diferentes tipos de exercícios e movimentos para observar a precisão e a utilidade do feedback gerado.
