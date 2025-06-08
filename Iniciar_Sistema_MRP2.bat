@echo off
cls
echo ========================================
echo     INICIANDO SISTEMA MRP2
echo ========================================
echo.

title Sistema MRP2 - Iniciando...

:: Verificar Node.js
echo Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Node.js nao encontrado!
    echo Instale o Node.js primeiro: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js encontrado!

echo.
echo Configurando Backend...
cd backend

:: Instalar dependencias do backend se necessario
if not exist "node_modules" (
    echo Instalando dependencias do Backend...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERRO ao instalar dependencias do Backend!
        pause
        exit /b 1
    )
)

:: Configurar banco de dados se necessario
echo Configurando banco de dados...
call npx prisma generate >nul 2>nul
if not exist "prisma/dev.db" (
    echo Criando banco de dados...
    call npx prisma migrate deploy
    if %ERRORLEVEL% NEQ 0 (
        call npx prisma migrate dev --name init
    )
    call npx prisma db seed
)

:: Iniciar Backend
echo Iniciando Backend...
start "Backend MRP2 - Porta 3006" cmd /k "echo BACKEND ATIVO - Porta 3006 && echo API: http://localhost:3006 && npm run dev"

:: Voltar para raiz
cd ..

echo.
echo Configurando Frontend...

:: Instalar dependencias do frontend se necessario
if not exist "node_modules" (
    echo Instalando dependencias do Frontend...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERRO ao instalar dependencias do Frontend!
        pause
        exit /b 1
    )
)

:: Aguardar backend iniciar
echo Aguardando Backend inicializar...
timeout /t 8 /nobreak >nul

:: Verificar se backend esta respondendo
echo Verificando conexao com Backend...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3006/health' -UseBasicParsing -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host 'Backend OK!' } else { Write-Host 'Backend com problemas' } } catch { Write-Host 'Backend nao esta respondendo ainda...' }"

:: Iniciar Frontend
echo Iniciando Frontend...
start "Frontend MRP2 - Porta 3000" cmd /k "echo FRONTEND ATIVO - Porta 3000 && echo Interface: http://localhost:3000 && npm run dev"

:: Aguardar frontend iniciar
timeout /t 5 /nobreak >nul

:: Abrir navegador
echo Abrindo sistema no navegador...
start http://localhost:3000

echo.
echo ========================================
echo     SISTEMA INICIADO COM SUCESSO!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3006
echo.
echo USUARIOS PARA TESTE:
echo.
echo Admin:      carlos.diretor@mrp2cpu.com.br    / admin123
echo Manutencao: joao.manutencao@mrp2cpu.com.br   / manutencao123  
echo Funcionario: maria.substrato@mrp2cpu.com.br  / funcionario123
echo.
echo Para parar: feche as janelas do terminal
echo ========================================
pause 