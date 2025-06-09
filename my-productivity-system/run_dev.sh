#!/bin/bash

# run_dev.sh

echo "Iniciando o backend Flask..."
# Inicia o backend em um processo em segundo plano
# `nohup` para que continue rodando mesmo se o terminal fechar
# `&` para colocar em segundo plano
nohup python backend/app.py > backend/flask.log 2>&1 &
FLASK_PID=$!
echo "Backend Flask iniciado com PID: $FLASK_PID. Logs em backend/flask.log"

echo "Aguarde 5 segundos para o Flask iniciar..."
sleep 5

echo "Iniciando o frontend Next.js..."
# Navega para o diretório frontend e inicia o Next.js
cd frontend
npm install # Garante que as dependências do frontend estejam instaladas
npm run dev &
NEXTJS_PID=$!
echo "Frontend Next.js iniciado com PID: $NEXTJS_PID."
echo "Abra seu navegador em http://localhost:3000"

# Função para parar os processos ao sair
cleanup() {
    echo "Parando o frontend Next.js (PID: $NEXTJS_PID)..."
    kill $NEXTJS_PID
    echo "Parando o backend Flask (PID: $FLASK_PID)..."
    kill $FLASK_PID
    echo "Todos os processos de desenvolvimento foram parados."
    exit 0
}

# Captura sinais de interrupção (Ctrl+C)
trap cleanup SIGINT

# Mantém o script rodando para que os processos em segundo plano continuem
wait
