import os
import cv2
import numpy as np
import mediapipe as mp
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv
import time

load_dotenv()


class VideoAnalyzer:
    def __init__(self, gemini_api_key):
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel("gemini-pro-vision")

    def analyze_video_frame(self, frame):
        _, buffer = cv2.imencode(".jpg", frame)
        image_bytes = buffer.tobytes()

        response = self.model.generate_content(
            [
                "Analyze this image and list the objects, people, and actions you can see. Format as a comma-separated list.",
                image_bytes,
            ]
        )
        return response.text


class CapturaDeVideo:
    def __init__(self, video_path=None):
        self.video_path = video_path
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.7, min_tracking_confidence=0.5
        )

    def calc_angle(self, a, b, c):
        a = np.array([a.x, a.y])
        b = np.array([b.x, b.y])
        c = np.array([c.x, c.y])

        ab = np.subtract(a, b)
        bc = np.subtract(b, c)

        theta = np.arccos(
            np.dot(ab, bc) / np.multiply(np.linalg.norm(ab), np.linalg.norm(bc))
        )
        theta = 180 - 180 * theta / 3.14
        return np.round(theta, 2)

    def iniciar_captura_separada(self, video_analyzer, iniciar_analise):
        if self.video_path:
            cap = cv2.VideoCapture(self.video_path)
        else:
            cap = cv2.VideoCapture(0)

        # Reduzir a resolução do vídeo para aumentar a taxa de quadros
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        prev_frame_time = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            new_frame_time = time.time()
            fps = 1 / (new_frame_time - prev_frame_time)
            prev_frame_time = new_frame_time

            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False

            resultados = self.pose.process(image)

            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            try:
                if resultados.pose_landmarks:
                    landmarks = resultados.pose_landmarks.landmark
                    left_shoulder = landmarks[
                        self.mp_pose.PoseLandmark.LEFT_SHOULDER.value
                    ]
                    left_elbow = landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value]
                    left_wrist = landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value]
                    right_shoulder = landmarks[
                        self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value
                    ]
                    right_elbow = landmarks[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value]
                    right_wrist = landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value]
                    left_hip = landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value]
                    left_knee = landmarks[self.mp_pose.PoseLandmark.LEFT_KNEE.value]
                    left_ankle = landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value]
                    right_hip = landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP.value]
                    right_knee = landmarks[self.mp_pose.PoseLandmark.RIGHT_KNEE.value]
                    right_ankle = landmarks[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value]

                    left_elbow_angle = self.calc_angle(
                        left_shoulder, left_elbow, left_wrist
                    )
                    right_elbow_angle = self.calc_angle(
                        right_shoulder, right_elbow, right_wrist
                    )
                    left_knee_angle = self.calc_angle(left_hip, left_knee, left_ankle)
                    right_knee_angle = self.calc_angle(
                        right_hip, right_knee, right_ankle
                    )

                    cv2.putText(
                        image,
                        str(left_elbow_angle),
                        tuple(
                            np.multiply(
                                [left_elbow.x, left_elbow.y], [640, 480]
                            ).astype(int)
                        ),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (255, 255, 255),
                        2,
                        cv2.LINE_AA,
                    )
                    cv2.putText(
                        image,
                        str(right_elbow_angle),
                        tuple(
                            np.multiply(
                                [right_elbow.x, right_elbow.y], [640, 480]
                            ).astype(int)
                        ),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (255, 255, 255),
                        2,
                        cv2.LINE_AA,
                    )
                    cv2.putText(
                        image,
                        str(left_knee_angle),
                        tuple(
                            np.multiply([left_knee.x, left_knee.y], [640, 480]).astype(
                                int
                            )
                        ),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (255, 255, 255),
                        2,
                        cv2.LINE_AA,
                    )
                    cv2.putText(
                        image,
                        str(right_knee_angle),
                        tuple(
                            np.multiply(
                                [right_knee.x, right_knee.y], [640, 480]
                            ).astype(int)
                        ),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (255, 255, 255),
                        2,
                        cv2.LINE_AA,
                    )

                    if iniciar_analise:
                        print("Analisando frame... com gemini vision ")
                        # resultado_analise = video_analyzer.analyze_video_frame(frame)
                        # print(f"Análise do frame: {resultado_analise}")

                        # # Adicionar a análise como legenda no frame
                        # cv2.putText(
                        #     image,
                        #     resultado_analise,
                        #     (10, 450),
                        #     cv2.FONT_HERSHEY_SIMPLEX,
                        #     0.5,
                        #     (0, 255, 0),
                        #     2,
                        #     cv2.LINE_AA,
                        # )

            except Exception as e:
                print(f"Erro durante a análise do frame: {e}")

            self.mp_drawing.draw_landmarks(
                image, resultados.pose_landmarks, self.mp_pose.POSE_CONNECTIONS
            )

            # Adicionar FPS no canto da tela do MediaPipe
            cv2.putText(
                image,
                f"FPS: {int(fps)}",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2,
                cv2.LINE_AA,
            )

            # Concatenar os dois frames (original e com legendas) lado a lado
            combined_frame = np.hstack((frame, image))

            cv2.imshow("MediaPipe feed", combined_frame)

            k = cv2.waitKey(1) & 0xFF
            if k == 27:
                break

        cap.release()
        cv2.destroyAllWindows()

    def show_video_trainer(self, video_analyzer):
        if self.video_path:
            cap = cv2.VideoCapture(self.video_path)
        else:
            cap = cv2.VideoCapture(0)

        # Reduzir a resolução do vídeo para aumentar a taxa de quadros
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        prev_frame_time = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            new_frame_time = time.time()
            fps = 1 / (new_frame_time - prev_frame_time)
            prev_frame_time = new_frame_time

            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False

            resultados = self.pose.process(image)

            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            try:
                if resultados.pose_landmarks:
                    landmarks = resultados.pose_landmarks.landmark
                    left_shoulder = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value]
                    left_elbow = landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value]
                    left_wrist = landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value]
                    right_shoulder = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
                    right_elbow = landmarks[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value]
                    right_wrist = landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value]
                    left_hip = landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value]
                    left_knee = landmarks[self.mp_pose.PoseLandmark.LEFT_KNEE.value]
                    left_ankle = landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value]
                    right_hip = landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP.value]
                    right_knee = landmarks[self.mp_pose.PoseLandmark.RIGHT_KNEE.value]
                    right_ankle = landmarks[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value]

                    left_elbow_angle = self.calc_angle(left_shoulder, left_elbow, left_wrist)
                    right_elbow_angle = self.calc_angle(right_shoulder, right_elbow, right_wrist)
                    left_knee_angle = self.calc_angle(left_hip, left_knee, left_ankle)
                    right_knee_angle = self.calc_angle(right_hip, right_knee, right_ankle)

                    cv2.putText(image, str(left_elbow_angle),
                                tuple(np.multiply([left_elbow.x, left_elbow.y], [640, 480]).astype(int)),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

                    cv2.putText(image, str(right_elbow_angle),
                                tuple(np.multiply([right_elbow.x, right_elbow.y], [640, 480]).astype(int)),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

                    cv2.putText(image, str(left_knee_angle),
                                tuple(np.multiply([left_knee.x, left_knee.y], [640, 480]).astype(int)),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

                    cv2.putText(image, str(right_knee_angle),
                                tuple(np.multiply([right_knee.x, right_knee.y], [640, 480]).astype(int)),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

            except Exception as e:
                print(f"Erro durante a análise do frame: {e}")

            self.mp_drawing.draw_landmarks(image, resultados.pose_landmarks, self.mp_pose.POSE_CONNECTIONS)

            # Adicionar FPS no canto da tela do MediaPipe
            cv2.putText(image, f"FPS: {int(fps)}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

            # Exibir apenas o frame do MediaPipe
            #cv2.imshow("MediaPipe feed", image)

            if cv2.waitKey(1) & 0xFF == 27:  # Pressione 'Esc' para sair
                break

        cap.release()
        cv2.destroyAllWindows()




class FrameDisplay:
    def __init__(self, video_path):
        self.video_path = video_path

    def display_video_goku(self, media_pipe_frame):
        cap = cv2.VideoCapture(self.video_path)

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # Reiniciar o vídeo
                continue

            # Redimensionar o frame do vídeo para a mesma altura do frame do MediaPipe
            height, width, _ = media_pipe_frame.shape
            frame_resized = cv2.resize(frame, (int(width * (frame.shape[0] / height)), height))

            # Desenhar um retângulo na parte inferior do vídeo
            start_point = (width // 2 - 50, height - 200)  # Ponto inicial do retângulo
            end_point = (width // 2 + 50, height)  # Ponto final do retângulo
            color = (255, 255, 255)  # Cor branca
            thickness = -1  # Preencher o retângulo
            cv2.rectangle(frame_resized, start_point, end_point, color, thickness)

            # Adicionar texto dentro do retângulo
            text = "hello world"
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 1  # Escala da fonte
            color_text = (0, 0, 0)  # Cor do texto (preto)
            thickness_text = 2  # Espessura do texto
            text_size = cv2.getTextSize(text, font, font_scale, thickness_text)[0]
            text_x = start_point[0] + (end_point[0] - start_point[0]) // 2 - text_size[0] // 2
            text_y = start_point[1] + (end_point[1] - start_point[1]) // 2 + text_size[1] // 2
            cv2.putText(frame_resized, text, (text_x, text_y), font, font_scale, color_text, thickness_text)

            # Exibir o frame do vídeo e o frame do MediaPipe lado a lado
            combined_frame = np.hstack((frame_resized, media_pipe_frame))
            cv2.imshow("Frame Separado e MediaPipe", combined_frame)

            if cv2.waitKey(1) & 0xFF == 27:  # Pressione 'Esc' para sair
                break

        cap.release()
        cv2.destroyAllWindows()


def main():
    # genai config
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("API key não configurada")
    else:
        video_analyzer = VideoAnalyzer(api_key)

    # videos
    escolha = input("Digite 0 para usar a webcam ou 1 para usar um vídeo: ").strip()
    goku_video = "/home/pedrov12/Documentos/GitHub/mvp-projects-freelancer/Computer_Vision/opencv_modules/modules/video_analyser_IA/assets/gohan_treinador_SSJ.webm"

    if escolha == "1":
        caminho_video = "/home/pedrov12/Documentos/GitHub/mvp-projects-freelancer/Computer_Vision/opencv_modules/modules/video_analyser_IA/assets/chute_karate.webm"
    else:
        caminho_video = None

    # instancia classes
    captura_de_video = CapturaDeVideo(caminho_video)
    frame_display = FrameDisplay(goku_video)

    while True:
        # Captura o frame do MediaPipe
        media_pipe_frame = captura_de_video.show_video_trainer(video_analyzer)

        # Captura o frame do vídeo Goku
        goku_frame = frame_display.display_video_goku(media_pipe_frame)

        # Verifica se os frames foram capturados corretamente
        if media_pipe_frame is not None and goku_frame is not None:
            # Redimensiona o frame do Goku para a mesma altura do frame do MediaPipe
            height, width, _ = media_pipe_frame.shape
            goku_frame_resized = cv2.resize(goku_frame, (int(width * (goku_frame.shape[0] / height)), height))

            # Exibir os frames lado a lado
            combined_frame = np.hstack((media_pipe_frame, goku_frame_resized))
            cv2.imshow("MediaPipe e Goku", combined_frame)

        if cv2.waitKey(1) & 0xFF == 27:  # Pressione 'Esc' para sair
            break

    captura_de_video.release()
    frame_display.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()