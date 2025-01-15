import streamlit as st
import matplotlib.pyplot as plt
import pandas as pd
import random

# --- Model (Dados e Lógica) ---
class DataModel:
    def __init__(self):
        self.data = {}

    def generate_data(self, page_name):
        if page_name == "Tela 1":
            self.data[page_name] = {"x": range(10), "y": [random.randint(1, 10) for _ in range(10)]}
        elif page_name == "Tela 2":
            self.data[page_name] = pd.DataFrame({'Categoria': ['A', 'B', 'C', 'D'], 'Valores': [random.randint(5, 20) for _ in range(4)]})
        elif page_name == "Tela 3":
          self.data[page_name] = {'rotulos': ['A', 'B', 'C'], 'valores': [random.randint(10, 30) for _ in range(3)]}
        elif page_name == "Tela 4":
          self.data[page_name] = {'x': [1, 2, 3, 4, 5], 'y': [2, 4, 1, 3, 5]}
        else:
            self.data[page_name] = None
        return self.data[page_name]

# --- View (Layout e Estilo) ---
def create_container(page_data):
    st.markdown(f"""
        <style>
            .container {{
                background-color: {page_data['cor']};
                padding: 20px;
                border: 1px solid black;
                min-height: 50vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }}
            .chart-container {{
                width: 80%; /* Largura do gráfico */
                margin: 20px auto; /* Centraliza o gráfico */
            }}
        </style>
    """, unsafe_allow_html=True)
    with st.container():
        st.markdown(f'<div class="container">', unsafe_allow_html=True)
        st.header(page_data["titulo"])
        st.write(page_data["texto"])
        st.markdown('<div class="chart-container">', unsafe_allow_html=True) # Container para o gráfico
        yield  # Permite adicionar conteúdo dinâmico
        st.markdown('</div>', unsafe_allow_html=True) # Fecha o container do gráfico
        st.markdown(f'</div>', unsafe_allow_html=True)

# --- Controller (Lógica de Controle) ---
class AppController:
    def __init__(self):
        self.model = DataModel()
        self.PAGES = {
            "Tela 1": {"cor": "lightblue", "titulo": "Tela 1", "texto": "Gráfico de Linhas", "chart_type": self.line_chart},
            "Tela 2": {"cor": "lightgreen", "titulo": "Tela 2", "texto": "Gráfico de Barras", "chart_type": self.bar_chart},
            "Tela 3": {"cor": "lightcoral", "titulo": "Tela 3", "texto": "Gráfico de Pizza", "chart_type": self.pizza_chart},
            "Tela 4": {"cor": "lightyellow", "titulo": "Tela 4", "texto": "Gráfico de Dispersão", "chart_type": self.scatter_chart},
        }

    def run(self):
        st.set_page_config(page_title="App com Menu Lateral", layout="wide")
        st.title("Meu Aplicativo com Menu Lateral")

        selection = st.sidebar.radio("Navegação", list(self.PAGES.keys()))
        page_data = self.PAGES[selection]
        chart_data = self.model.generate_data(selection)

        with create_container(page_data) as content:
            if chart_data:
                page_data["chart_type"](chart_data)
            else:
                st.write("Dados não disponíveis para esta tela.")

    def line_chart(self, data):
        plt.figure(figsize=(8, 5))
        plt.plot(data["x"], data["y"])
        plt.xlabel("Eixo X")
        plt.ylabel("Eixo Y")
        plt.title("Gráfico de Linhas")
        st.pyplot(plt)
        plt.close() # Importante para liberar memória

    def bar_chart(self, data):
        plt.figure(figsize=(8, 5))
        plt.bar(data['Categoria'], data['Valores'])
        plt.xlabel("Categorias")
        plt.ylabel("Valores")
        plt.title("Gráfico de Barras")
        st.pyplot(plt)
        plt.close() # Importante para liberar memória
    
    def pizza_chart(self, data):
        plt.figure(figsize=(8, 5))
        plt.pie(data['valores'], labels=data['rotulos'], autopct='%1.1f%%', startangle=90)
        plt.title('Gráfico de Pizza')
        st.pyplot(plt)
        plt.close()

    def scatter_chart(self, data):
        plt.figure(figsize=(8, 5))
        plt.scatter(data['x'], data['y'])
        plt.xlabel("Eixo X")
        plt.ylabel("Eixo Y")
        plt.title("Gráfico de Dispersão")
        st.pyplot(plt)
        plt.close()

# --- Execução do Aplicativo ---
if __name__ == "__main__":
    controller = AppController()
    controller.run()