@echo off
echo ==========================================
echo        LIMPEZA DO PROJETO MRP2
echo ==========================================
echo.

echo [1/6] Removendo node_modules do frontend...
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo    ✓ node_modules removido
) else (
    echo    ⚠ node_modules não encontrado
)

echo.
echo [2/6] Removendo dist do frontend...
if exist "dist" (
    rmdir /s /q "dist"
    echo    ✓ dist removido
) else (
    echo    ⚠ dist não encontrado
)

echo.
echo [3/6] Removendo node_modules do backend...
if exist "backend\node_modules" (
    rmdir /s /q "backend\node_modules"
    echo    ✓ backend/node_modules removido
) else (
    echo    ⚠ backend/node_modules não encontrado
)

echo.
echo [4/6] Removendo dist do backend...
if exist "backend\dist" (
    rmdir /s /q "backend\dist"
    echo    ✓ backend/dist removido
) else (
    echo    ⚠ backend/dist não encontrado
)

echo.
echo [5/6] Removendo arquivos temporários...
if exist ".vite" rmdir /s /q ".vite"
if exist ".cache" rmdir /s /q ".cache"
if exist "tmp" rmdir /s /q "tmp"
if exist "temp" rmdir /s /q "temp"
del /q *.log 2>nul
del /q *.tmp 2>nul
echo    ✓ Arquivos temporários removidos

echo.
echo [6/6] Limpeza concluída!
echo.
echo ==========================================
echo     PROJETO LIMPO COM SUCESSO!
echo ==========================================
echo.
echo Para reinstalar as dependências:
echo   1. npm install (no frontend)
echo   2. cd backend ^&^& npm install (no backend)
echo.
pause 