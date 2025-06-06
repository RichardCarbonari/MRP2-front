@echo off
echo Iniciando o Sistema de Manutencao...
echo.

:: Definir o título da janela
title Sistema de Manutencao - Iniciando...

:: Verificar se o Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Erro: Node.js nao encontrado!
    echo Por favor, instale o Node.js para executar o sistema.
    pause
    exit /b 1
)

:: Remover node_modules e reinstalar tudo do zero
echo Limpando instalacoes anteriores...
rmdir /s /q node_modules 2>nul
cd backend
rmdir /s /q node_modules 2>nul

:: Instalar e configurar o Backend
echo Instalando dependencias do Backend...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Erro ao instalar dependencias do Backend!
    pause
    exit /b 1
)

:: Configurar o banco de dados
echo Configurando o banco de dados...
call npx prisma migrate reset --force
call npx prisma generate
call npx prisma db seed

:: Iniciar o Backend (na porta 3002)
echo Iniciando o Backend...
start "Backend - Sistema de Manutencao" cmd /k "npm run dev"

:: Voltar para a pasta raiz e configurar o Frontend
cd ..
echo Instalando dependencias do Frontend...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Erro ao instalar dependencias do Frontend!
    pause
    exit /b 1
)

:: Aguardar 5 segundos para o backend iniciar
timeout /t 5 /nobreak

:: Iniciar o Frontend
echo Iniciando o Frontend...
start "Frontend - Sistema de Manutencao" cmd /k "npm run dev"

:: Aguardar 3 segundos
timeout /t 3 /nobreak

:: Abrir o navegador
echo Abrindo o sistema no navegador...
start http://localhost:5173

echo.
echo Sistema iniciado com sucesso!
echo Backend (API): http://localhost:3002
echo Frontend (Interface Web): http://localhost:5173
echo.
echo Usuarios disponiveis:
echo.
echo Administrador:
echo Email: admin@example.com
echo Senha: admin123
echo.
echo Manutencao:
echo Email: manutencao@example.com
echo Senha: manutencao123
echo.
echo Funcionario:
echo Email: funcionario@example.com
echo Senha: funcionario123
echo.
echo Para encerrar o sistema, feche as janelas do terminal ou pressione Ctrl+C em cada uma delas.
echo.
pause 