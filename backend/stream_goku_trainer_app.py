import streamlit as st
import cv2
import time
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from goku_IA_trainer import PoseDetector


@dataclass
class VideoSource:
    name: str
    path: any

class StreamlitPoseDetectorApp:
    def __init__(self):
        """Initialize the Streamlit Pose Detector application."""
        self.available_videos = [
            VideoSource("Karate Kick", "assets/chute_karate.webm"),
            VideoSource("Karate Dataset", "assets/dataset_golpes_karate.webm"),
            VideoSource("Webcam", 0)
        ]
        
        self.detector: Optional[PoseDetector] = None
        self.setup_page()
        self.setup_sidebar()
        self.initialize_placeholders()

    def setup_page(self) -> None:
        """Setup the main page configuration and title."""
        st.set_page_config(
            page_title="Pose Detection Analysis",
            page_icon="🥋",
            layout="wide"
        )
        st.title("Pose Detection Analysis")

    def setup_sidebar(self) -> None:
        """Setup the sidebar with all configuration options."""
        st.sidebar.title("Settings")
        
        # Video selection
        self.selected_video = st.sidebar.selectbox(
            "Select Video Source",
            options=self.available_videos,
            format_func=lambda x: x.name
        )
        
        # Focus side selection
        self.focus_side = st.sidebar.radio(
            "Focus Side",
            options=["direita", "esquerda"],
            format_func=lambda x: "Right" if x == "direita" else "Left"
        )

    def initialize_placeholders(self) -> None:
        """Initialize placeholders for dynamic content."""
        self.frame_placeholder = st.empty()
        self.info_placeholder = st.empty()
        self.status_placeholder = st.empty()
        
    def get_video_source(self) -> List[str]:
        """Convert selected video to appropriate format for PoseDetector."""
        if self.selected_video.name == "Webcam":
            return [0]
        return [self.selected_video.path]

    def format_angles(self, angles: Dict[str, float]) -> str:
        """Format angles data for display."""
        return f"""
        **Detected Angles:**
        - Left Elbow: {angles.get('left_elbow', 'N/A'):.1f}°
        - Right Elbow: {angles.get('right_elbow', 'N/A'):.1f}°
        - Left Knee: {angles.get('left_knee', 'N/A'):.1f}°
        - Right Knee: {angles.get('right_knee', 'N/A'):.1f}°
        """

    def initialize_detector(self) -> None:
        """Initialize the PoseDetector with current settings."""
        try:
            video_sources = self.get_video_source()
            self.detector = PoseDetector(
                video_sources=video_sources,
                focus_side=self.focus_side,
                video_index=0
            )
        except Exception as e:
            st.error(f"Failed to initialize detector: {str(e)}")
            raise

    def process_video(self) -> None:
        """Main video processing loop."""
        stop_button = st.button("Stop Processing")
        
        try:
            while not stop_button:
                frame_data = self.detector.process_frame()
                
                if frame_data is None:
                    self.status_placeholder.warning("End of video or video source not available")
                    break
                    
                frame, angles = frame_data
                
                # Convert frame from BGR to RGB
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Update display
                self.frame_placeholder.image(frame, channels="RGB", use_column_width=True)
                
                if angles:
                    self.info_placeholder.markdown(self.format_angles(angles))
                
                time.sleep(0.01)  # Prevent UI overwhelming
                
        except Exception as e:
            st.error(f"Error during processing: {str(e)}")
        finally:
            if self.detector:
                self.detector.release()

    def run(self) -> None:
        """Main application execution method."""
        try:
            st.markdown("### Configuration")
            st.write(f"Selected Video: {self.selected_video.name}")
            st.write(f"Focus Side: {self.focus_side}")
            
            if st.button("Start Processing"):
                self.initialize_detector()
                self.process_video()
                
        except Exception as e:
            st.error(f"Application error: {str(e)}")
            if self.detector:
                self.detector.release()

def main():
    app = StreamlitPoseDetectorApp()
    app.run()

if __name__ == "__main__":
    main()