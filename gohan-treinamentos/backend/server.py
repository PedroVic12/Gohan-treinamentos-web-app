# backend/app.py
from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
import pandas as pd
import os


#! pip install flask flask_sqlalchemy pandas


"""
1) Escalabilidade do Backend Flask
Seu backend Flask atual é um bom começo. Para garantir que ele também seja escalável, considere no futuro:

- Banco de Dados: Para produção, migrar de SQLite para um banco de dados mais robusto como PostgreSQL ou MySQL.
- Workers e Filas: Usar Gunicorn ou uWSGI para rodar sua aplicação Flask com múltiplos workers. Para tarefas demoradas (como o processamento do CSV, se ele se tornar muito grande), usar filas de tarefas assíncronas (Celery com Redis/RabbitMQ).
- Caching: Implementar caching (ex: Flask-Caching com Redis ou Memcached) para endpoints frequentemente acessados e que não mudam muito.
- Containerização: Usar Docker para empacotar sua aplicação e facilitar o deploy e a escalabilidade horizontal.
- Orquestração: Para gerenciar múltiplos containers, Kubernetes ou serviços como AWS ECS/EKS, Google Kubernetes Engine.
- Load Balancer: Distribuir o tráfego entre múltiplas instâncias da sua aplicação.


2) Configure o Proxy no Vite: Durante o desenvolvimento, seu frontend Vite rodará em uma porta (ex: localhost:5173) e seu backend Flask em outra (ex: localhost:5000). Para simplificar as chamadas de API do frontend e evitar problemas de CORS, você pode configurar o Vite para atuar como um proxy.

Edite (ou crie) o arquivo vite.config.js (ou vite.config.ts) na raiz da sua pasta frontend:

// frontend/vite.config.ts (ou .js)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // ou o plugin para Vue, Svelte, etc.

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Porta para o servidor de desenvolvimento do Vite (opcional, padrão é 5173)
    proxy: {
      // Redireciona requisições que começam com '/api' para o seu backend Flask
      '/api': {
        target: 'http://localhost:5000', // URL do seu backend Flask
        changeOrigin: true, // Necessário para evitar erros de CORS e para virtual hosted sites
        // Não é necessário 'rewrite' aqui, pois suas rotas Flask já começam com /api
        // Se suas rotas Flask fossem, por exemplo, '/daily_wins' e você quisesse
        // chamá-las como '/api/daily_wins' no frontend, você usaria:
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

3) Considerações para Produção
Para produção, o fluxo é um pouco diferente:

- Build do Frontend: Você compilará seu projeto Vite usando npm run build na pasta frontend. Isso gerará uma pasta dist (ou similar) com arquivos HTML, CSS e JavaScript estáticos.

- Servir os Arquivos Estáticos: Você tem algumas opções:
    -  Configurar o Flask para servir esses arquivos estáticos: Você pode adicionar rotas no Flask para servir o index.html da pasta dist do frontend e os assets estáticos.
    - Usar um servidor web dedicado (Nginx, Apache): Configurar o Nginx (ou similar) para servir os arquivos estáticos do frontend e para fazer proxy reverso para sua API Flask em produção. Esta é uma abordagem comum e robusta.
    - Hospedar o frontend em uma CDN/Plataforma de Hospedagem Estática (Vercel, Netlify, S3): E configurar sua API Flask para rodar separadamente (ex: em um servidor VPS, Heroku, AWS EC2/ECS).

"""


app = Flask(__name__)
# Configuração do banco de dados SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///productivity.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Desativa o rastreamento de modificações do SQLAlchemy
app.config['UPLOAD_FOLDER'] = 'uploads' # Pasta para arquivos temporários de upload/exportação

db = SQLAlchemy(app)
CORS(app) # Habilita CORS para permitir requisições do frontend (Next.js)

# --- Modelos do Banco de Dados ---

# Modelo base com funcionalidades CRUD básicas
class BaseModel(db.Model):
    __abstract__ = True # Indica que esta é uma classe abstrata e não será criada como tabela no banco

    id = db.Column(db.Integer, primary_key=True) # Coluna de ID primária
    created_at = db.Column(db.DateTime, default=datetime.utcnow) # Data de criação (UTC)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) # Data de última atualização (UTC)

    # Método para salvar o objeto no banco de dados
    def save(self):
        db.session.add(self)
        db.session.commit()
        return self

    # Método para deletar o objeto do banco de dados
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    # Método para converter o objeto em um dicionário (útil para JSON)
    def to_dict(self):
        data = {}
        for c in self.__table__.columns:
            value = getattr(self, c.name)
            if isinstance(value, datetime):
                data[c.name] = value.isoformat() # Formata datetime para ISO
            elif isinstance(value, datetime.date):
                data[c.name] = value.isoformat() # Formata date para ISO
            else:
                data[c.name] = value
        return data

# Modelo para Vitórias Diárias
class DailyWin(BaseModel):
    __tablename__ = 'daily_wins' # Nome da tabela no banco
    
    text = db.Column(db.String(255), nullable=False) # Texto da vitória (não pode ser nulo)
    category = db.Column(db.String(100), default='geral') # Categoria da vitória (ex: 'espiritual', 'profissional')
    completed = db.Column(db.Boolean, default=False) # Indica se a vitória foi completada
    notes = db.Column(db.Text) # Notas adicionais
    date = db.Column(db.Date, default=datetime.utcnow().date) # Data da vitória
    xp_gained = db.Column(db.Integer, default=20) # XP ganho por esta vitória (valor fixo por enquanto)
    
    # Sobrescreve to_dict para garantir formatação correta de datas
    def to_dict(self):
        return super().to_dict()

# Modelo para Projetos
class Project(BaseModel):
    __tablename__ = 'projects' # Nome da tabela no banco
    
    name = db.Column(db.String(255), nullable=False) # Nome do projeto
    description = db.Column(db.Text) # Descrição do projeto
    status = db.Column(db.String(50), default='Em andamento') # Status (ex: 'Em andamento', 'Pausado', 'Finalizado')
    area = db.Column(db.String(100))  # Área do projeto (ex: 'UFF', 'ONS', 'Coding')
    priority = db.Column(db.Integer, default=1) # Prioridade (1-5)
    estimated_hours = db.Column(db.Float) # Horas estimadas
    actual_hours = db.Column(db.Float, default=0) # Horas reais gastas
    
    # Sobrescreve to_dict para garantir formatação correta de datas
    def to_dict(self):
        return super().to_dict()

# Modelo para Tarefas (associadas a Projetos)
class Task(BaseModel):
    __tablename__ = 'tasks' # Nome da tabela no banco
    
    title = db.Column(db.String(255), nullable=False) # Título da tarefa
    description = db.Column(db.Text) # Descrição da tarefa
    completed = db.Column(db.Boolean, default=False) # Indica se a tarefa foi completada
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id')) # Chave estrangeira para Project
    due_date = db.Column(db.Date) # Data de vencimento da tarefa
    
    project = db.relationship('Project', backref='tasks') # Relacionamento com Project
    
    # Sobrescreve to_dict para garantir formatação correta de datas
    def to_dict(self):
        return super().to_dict()

# --- Rotas da API (CRUD genérico) ---

# Decorador para gerar rotas CRUD automaticamente para um modelo
def create_crud_routes(model, name):
    """Gera rotas CRUD automaticamente para um modelo, com filtros e paginação."""
    
    # Rota para listar todos os itens (GET /api/<name>)
    @app.route(f'/api/{name}', methods=['GET'])
    def list_items():
        try:
            page = request.args.get('page', 1, type=int) # Número da página
            per_page = request.args.get('per_page', 10, type=int) # Itens por página
            
            query = model.query
            
            # Aplicar filtros dinamicamente
            for key, value in request.args.items():
                if hasattr(model, key) and key not in ['page', 'per_page']:
                    column = getattr(model, key)
                    # Tratamento especial para booleanos
                    if isinstance(column.type, db.Boolean):
                        if value.lower() == 'true':
                            query = query.filter(column == True)
                        elif value.lower() == 'false':
                            query = query.filter(column == False)
                    # Tratamento especial para datas
                    elif isinstance(column.type, db.Date):
                        try:
                            date_obj = datetime.strptime(value, '%Y-%m-%d').date()
                            query = query.filter(column == date_obj)
                        except ValueError:
                            # Ignora filtros de data com formato inválido
                            pass
                    # Filtro padrão para strings (LIKE)
                    elif isinstance(column.type, db.String) or isinstance(column.type, db.Text):
                        query = query.filter(column.like(f'%{value}%'))
                    # Filtro exato para outros tipos
                    else:
                        query = query.filter(column == value)
            
            # Paginação
            items_pagination = query.paginate(page=page, per_page=per_page, error_out=False)
            
            return jsonify({
                'items': [item.to_dict() for item in items_pagination.items],
                'total': items_pagination.total,
                'page': page,
                'pages': items_pagination.pages,
                'has_next': items_pagination.has_next,
                'has_prev': items_pagination.has_prev
            })
        except Exception as e:
            app.logger.error(f"Error listing {name}: {e}") # Loga o erro
            db.session.rollback()
            return jsonify({'message': f'Error listing {name}', 'error': str(e)}), 500

    # Rota para obter um item específico por ID (GET /api/<name>/<id>)
    @app.route(f'/api/{name}/<int:item_id>', methods=['GET'])
    def get_item(item_id):
        try:
            item = model.query.get_or_404(item_id) # Busca item ou retorna 404
            return jsonify(item.to_dict())
        except Exception as e:
            app.logger.error(f"Error getting {name} with ID {item_id}: {e}")
            return jsonify({'message': f'Error getting {name}', 'error': str(e)}), 500

    # Rota para criar um novo item (POST /api/<name>)
    @app.route(f'/api/{name}', methods=['POST'])
    def create_item():
        try:
            data = request.get_json()
            if not data:
                return jsonify({'message': 'No input data provided'}), 400

            # Converte strings de data para objetos date/datetime
            for key, value in data.items():
                if hasattr(model, key):
                    column_type = getattr(model, key).type
                    if isinstance(column_type, db.Date) and value:
                        try:
                            data[key] = datetime.strptime(value, '%Y-%m-%d').date()
                        except ValueError:
                            return jsonify({'message': f"Invalid date format for {key}. Expected YYYY-MM-DD."}), 400
                    elif isinstance(column_type, db.DateTime) and value:
                        try:
                            data[key] = datetime.fromisoformat(value.replace('Z', '+00:00')) # Handle Z for UTC
                        except ValueError:
                            return jsonify({'message': f"Invalid datetime format for {key}. Expected ISO format."}), 400

            new_item = model(**data)
            new_item.save()
            return jsonify(new_item.to_dict()), 201 # Retorna 201 Created
        except Exception as e:
            app.logger.error(f"Error creating {name}: {e}")
            db.session.rollback() # Desfaz a transação em caso de erro
            return jsonify({'message': f'Error creating {name}', 'error': str(e)}), 400

    # Rota para atualizar um item existente (PUT /api/<name>/<id>)
    @app.route(f'/api/{name}/<int:item_id>', methods=['PUT'])
    def update_item(item_id):
        try:
            item = model.query.get_or_404(item_id)
            data = request.get_json()
            if not data:
                return jsonify({'message': 'No input data provided'}), 400
            
            for key, value in data.items():
                if hasattr(item, key):
                    column_type = getattr(model, key).type
                    if isinstance(column_type, db.Date) and value:
                        try:
                            setattr(item, key, datetime.strptime(value, '%Y-%m-%d').date())
                        except ValueError:
                            return jsonify({'message': f"Invalid date format for {key}. Expected YYYY-MM-DD."}), 400
                    elif isinstance(column_type, db.DateTime) and value:
                        try:
                            setattr(item, key, datetime.fromisoformat(value.replace('Z', '+00:00')))
                        except ValueError:
                            return jsonify({'message': f"Invalid datetime format for {key}. Expected ISO format."}), 400
                    else:
                        setattr(item, key, value) # Atualiza o atributo do objeto
            
            item.save()
            return jsonify(item.to_dict())
        except Exception as e:
            app.logger.error(f"Error updating {name} with ID {item_id}: {e}")
            db.session.rollback()
            return jsonify({'message': f'Error updating {name}', 'error': str(e)}), 400

    # Rota para deletar um item (DELETE /api/<name>/<id>)
    @app.route(f'/api/{name}/<int:item_id>', methods=['DELETE'])
    def delete_item(item_id):
        try:
            item = model.query.get_or_404(item_id)
            item.delete()
            return jsonify({'message': f'{name.capitalize()} deleted successfully'}), 204 # 204 No Content
        except Exception as e:
            app.logger.error(f"Error deleting {name} with ID {item_id}: {e}")
            db.session.rollback()
            return jsonify({'message': f'Error deleting {name}', 'error': str(e)}), 500

# Registra as rotas CRUD para os modelos
create_crud_routes(DailyWin, 'daily_wins')
create_crud_routes(Project, 'projects')
create_crud_routes(Task, 'tasks')


# config endpoints
@app.route("/channels")
def channel():
    return {
        "canal": ["canal 1", "canal 2", "canal 3"]
    }

# Endpoint para exportar todos os dados para CSV
@app.route('/api/export_all_csv', methods=['GET'])
def export_all_csv():
    try:
        # Verifica se a pasta de uploads existe, senão cria
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])

        # Export DailyWins
        wins = DailyWin.query.all()
        # Converte para DataFrame, lidando com None em campos de data
        wins_data = []
        for win in wins:
            win_dict = win.to_dict()
            if win_dict.get('date') is None:
                win_dict['date'] = '' # Substitui None por string vazia para CSV
            wins_data.append(win_dict)
        wins_df = pd.DataFrame(wins_data)
        # Usa ';' como separador e ',' como decimal para compatibilidade com Excel em PT-BR
        wins_csv = wins_df.to_csv(index=False, sep=';', decimal=',') 
        
        # Export Projects
        projects = Project.query.all()
        projects_data = []
        for proj in projects:
            proj_dict = proj.to_dict()
            projects_data.append(proj_dict)
        projects_df = pd.DataFrame(projects_data)
        projects_csv = projects_df.to_csv(index=False, sep=';', decimal=',')

        # Export Tasks
        tasks = Task.query.all()
        tasks_data = []
        for task_obj in tasks:
            task_dict = task_obj.to_dict()
            if task_dict.get('due_date') is None:
                task_dict['due_date'] = '' # Substitui None por string vazia para CSV
            tasks_data.append(task_dict)
        tasks_df = pd.DataFrame(tasks_data)
        tasks_csv = tasks_df.to_csv(index=False, sep=';', decimal=',')

        # Combina tudo em um único conteúdo CSV
        full_csv_content = (
            "Daily Wins\n" + wins_csv + "\n\n" +
            "Projects\n" + projects_csv + "\n\n" +
            "Tasks\n" + tasks_csv
        )
        
        temp_file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'productivity_data.csv')
        with open(temp_file_path, 'w', encoding='utf-8') as f:
            f.write(full_csv_content)

        return send_file(
            temp_file_path,
            as_attachment=True,
            download_name='productivity_data.csv',
            mimetype='text/csv'
        )

    except Exception as e:
        app.logger.error(f"Error exporting data: {e}")
        return jsonify({'message': 'Error exporting data', 'error': str(e)}), 500

# Inicializa o banco de dados e cria as tabelas
with app.app_context():
    db.create_all()

# Garante que a pasta de uploads existe ao iniciar o app
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
