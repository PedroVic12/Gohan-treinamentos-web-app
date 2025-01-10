import cv2
import numpy as np
import mediapipe as mp
import os
import time
from typing import Dict, Tuple, Optional

class PoseDetector:
    def __init__(self, video_source: Optional[str] = None, num_people: int = 1, focus_side: str = "direita"):
        """Initialize pose detector with video source."""
        self.mp_pose = mp.solutions.pose
        self.mp_draw = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5,
            model_complexity=2  # Usar o modelo de complexidade 2 para detecção de múltiplas pessoas
        )
        
        # Video capture setup
        self.cap = cv2.VideoCapture(video_source if video_source else 0)
        
        # Set fixed dimensions for consistency
        self.frame_width = 683
        self.frame_height = 768
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.frame_width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.frame_height)
        
        self.num_people = num_people  # Número de pessoas a serem detectadas
        self.focus_side = focus_side  # Lado a ser focado (direita ou esquerda)
        self.start_time = time.time()  # Para calcular o FPS
        self.frame_count = 0  # Contador de frames


    def iniciar_captura(self, iniciar_analise = True):
        if self.video_path:
            cap = cv2.VideoCapture(self.video_path)
        else:
            cap = cv2.VideoCapture(0)

        while cap.isOpened():
            _, frame = cap.read()

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
                        print(f"Análise do frame....")

            except Exception as e:
                print(f"Erro durante a análise do frame: {e}")

            self.mp_drawing.draw_landmarks(
                image, resultados.pose_landmarks, self.mp_pose.POSE_CONNECTIONS
            )

            cv2.imshow("MediaPipe feed", image)

            k = cv2.waitKey(30) & 0xFF
            if k == 27:
                break

        cap.release()
        cv2.destroyAllWindows()

    
    def calculate_angle(self, point1: np.ndarray, point2: np.ndarray, point3: np.ndarray) -> float:
        """Calculate angle between three points."""
        a = np.array([point1.x, point1.y])
        b = np.array([point2.x, point2.y])
        c = np.array([point3.x, point3.y])
        
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - \
                 np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        
        if angle > 180.0:
            angle = 360 - angle
            
        return angle
    
    def get_pose_angles(self, landmarks) -> Dict[str, float]:
        """Calculate all relevant pose angles."""
        angles = {}
        if self.focus_side == "direita":
            # Focar na pessoa da direita
            angles['elbow'] = self.calculate_angle(
                landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value],
                landmarks[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value],
                landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value]
            )
            angles['knee'] = self.calculate_angle(
                landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP.value],
                landmarks[self.mp_pose.PoseLandmark.RIGHT_KNEE.value],
                landmarks[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value]
            )
        else:
            # Focar na pessoa da esquerda
            angles['elbow'] = self.calculate_angle(
                landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value],
                landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value],
                landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value]
            )
            angles['knee'] = self.calculate_angle(
                landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value],
                landmarks[self.mp_pose.PoseLandmark.LEFT_KNEE.value],
                landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value]
            )
        
        return angles
    
    def process_frame(self) -> Optional[np.ndarray]:
        """Process a single frame and return the annotated image."""
        if not self.cap.isOpened():
            return None

        success, frame = self.cap.read()
        if not success:
            return None

        # Resize frame
        frame = cv2.resize(frame, (self.frame_width, self.frame_height))
        
        # Convert to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        rgb_frame.flags.writeable = False
        
        # Process the frame
        results = self.pose.process(rgb_frame)
        rgb_frame.flags.writeable = True
        frame = cv2.cvtColor(rgb_frame, cv2.COLOR_RGB2BGR)

        angles = {}
        if results.pose_landmarks:
            # Draw skeleton
            self.mp_draw.draw_landmarks(
                frame,
                results.pose_landmarks,
                self.mp_pose.POSE_CONNECTIONS,
                self.mp_draw.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                self.mp_draw.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
            )
            
            # Calculate and draw angles
            angles = self.get_pose_angles(results.pose_landmarks.landmark)
            frame = self.draw_angles(frame, results.pose_landmarks.landmark, angles)
        
        # Calcular e exibir FPS
        self.frame_count += 1
        current_time = time.time()
        if current_time - self.start_time >= 1.0:  # A cada segundo
            fps = self.frame_count
            self.frame_count = 0
            self.start_time = current_time
            cv2.putText(frame, f'FPS: {fps}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        return frame, angles
    
    def draw_angles(self, image: np.ndarray, landmarks, angles: Dict[str, float]) -> np.ndarray:
        """Draw angle measurements on the image."""
        h, w = image.shape[:2]
        for joint, angle in angles.items():
            # Get landmark position based on joint name
            landmark_map = {
                'elbow': self.mp_pose.PoseLandmark.LEFT_ELBOW.value if self.focus_side == "esquerda" else self.mp_pose.PoseLandmark.RIGHT_ELBOW.value,
                'knee': self.mp_pose.PoseLandmark.LEFT_KNEE.value if self.focus_side == "esquerda" else self.mp_pose.PoseLandmark.RIGHT_KNEE.value
            }
            
            if joint in landmark_map:
                landmark = landmarks[landmark_map[joint]]
                position = tuple(np.multiply([landmark.x, landmark.y], [w, h]).astype(int))
                cv2.putText(image, f"{joint.title()}: {angle:.1f}°", position, 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        return image
    
    def release(self):
        """Release video capture resources."""
        self.cap.release()

class ReferenceDisplay:
    def __init__(self, video_path: str):
        """Initialize reference video display."""
        self.cap = cv2.VideoCapture(video_path)
        
        # Match dimensions with PoseDetector
        self.frame_width = 683
        self.frame_height = 768
        
    def get_frame(self) -> Optional[np.ndarray]:
        """Get next frame from reference video."""
        if not self.cap.isOpened():
            return None

        success, frame = self.cap.read()
        if not success:
            # Reset video to beginning if it ends
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            success, frame = self.cap.read()
            if not success:
                return None

        # Resize frame to match dimensions
        frame = cv2.resize(frame, (self.frame_width, self.frame_height))
        return frame
    
    def release(self):
        """Release video capture resources."""
        self.cap.release()




def main():
    # Get user input for video source
    escolha = input("Digite 0 para usar a webcam ou 1 para usar um vídeo: ").strip()
    
    # Set up video paths
    if escolha == "1":
        caminho_video = "/home/pedrov12/Documentos/GitHub/mvp-projects-freelancer/pythonando/Computer_Vision/opencv_modules/modules/video_analyser_IA/assets/chute_karate.webm"
        goku_video = "/home/pedrov12/Documentos/GitHub/mvp-projects-freelancer/pythonando/Computer_Vision/opencv_modules/modules/video_analyser_IA/assets/gohan_treinador_SSJ.webm"
        
        # Verificar se o arquivo de vídeo existe
        if not os.path.isfile(caminho_video):
            print(f"Arquivo de vídeo não encontrado: {caminho_video}")
            return
        if not os.path.isfile(goku_video):
            print(f"Arquivo de vídeo não encontrado: {goku_video}")
            return
    else:
        caminho_video = None  # Use webcam
        goku_video = None  # Não usar vídeo de referência quando usando a webcam

    # Perguntar o número de pessoas a serem detectadas
    num_people = int(input("Digite o número de pessoas a serem detectadas (1 ou 2): ").strip())
    focus_side = input("Digite 'direita' para focar na pessoa da direita ou 'esquerda' para focar na pessoa da esquerda: ").strip().lower()
    
    # Initialize video processors
    pose_detector = PoseDetector(caminho_video, num_people, focus_side)
    if caminho_video:
        print("Usando vídeo como fonte.")
    else:
        print("Usando webcam como fonte.")
        
    if goku_video:
        reference_display = ReferenceDisplay(goku_video)

    # Check if video capture is opened
    if not pose_detector.cap.isOpened():
        print("Erro ao abrir a captura de vídeo para PoseDetector.")
        return
    if goku_video and not reference_display.cap.isOpened():
        print("Erro ao abrir a captura de vídeo para ReferenceDisplay.")
        return

    # Create windows
    cv2.namedWindow("Pose Detector", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Pose Detector", 683, 768)
    cv2.namedWindow("Reference Display", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Reference Display", 683, 768)

    while True:
        # Get frames from both sources
        pose_frame, angles = pose_detector.process_frame()
        if pose_frame is None:
            break

        reference_frame = reference_display.get_frame() if goku_video else None
        if reference_frame is None and goku_video:
            continue

        # Display the frames in separate windows
        cv2.imshow("Pose Detector", pose_frame)
        if goku_video:
            cv2.imshow("Reference Display", reference_frame)

        # Print angles for elbows and knees
        if angles:
            print(f"Ângulos detectados - Cotovelo Esquerdo: {angles.get('left_elbow', 'N/A')}°, "
                  f"Cotovelo Direito: {angles.get('right_elbow', 'N/A')}°, "
                  f"Joelho Esquerdo: {angles.get('left_knee', 'N/A')}°, "
                  f"Joelho Direito: {angles.get('right_knee', 'N/A')}°")

        # Check for exit command
        if cv2.waitKey(1) & 0xFF == 27:  # ESC key
            break

    # Cleanup
    pose_detector.release()
    if goku_video:
        reference_display.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()