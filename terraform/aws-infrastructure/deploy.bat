@echo off
REM Script de deploy automatizado para Windows
REM Execute este arquivo para fazer o deploy da infraestrutura AWS

echo ========================================
echo  UPAE - Deploy AWS com Terraform
echo ========================================
echo.

REM Verificar se está no diretório correto
if not exist "main.tf" (
    echo ERRO: Execute este script dentro do diretorio terraform/aws-infrastructure
    pause
    exit /b 1
)

echo [1/5] Verificando pre-requisitos...
echo.

REM Verificar Terraform
terraform --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Terraform nao encontrado!
    echo Instale: https://www.terraform.io/downloads
    pause
    exit /b 1
)

REM Verificar AWS CLI
aws --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: AWS CLI nao encontrada!
    echo Instale: https://aws.amazon.com/cli/
    pause
    exit /b 1
)

echo ✓ Terraform instalado
echo ✓ AWS CLI instalada
echo.

REM Verificar credenciais AWS
echo Verificando credenciais AWS...
aws sts get-caller-identity >nul 2>&1
if errorlevel 1 (
    echo ERRO: Credenciais AWS nao configuradas!
    echo Execute: aws configure
    pause
    exit /b 1
)

echo ✓ Credenciais AWS configuradas
echo.

REM Mostrar informações da conta
echo Conta AWS detectada:
aws sts get-caller-identity
echo.

echo [2/5] Inicializando Terraform...
terraform init
if errorlevel 1 (
    echo ERRO: Falha ao inicializar Terraform
    pause
    exit /b 1
)
echo.

echo [3/5] Validando configuracao...
terraform validate
if errorlevel 1 (
    echo ERRO: Configuracao invalida
    pause
    exit /b 1
)
echo.

echo [4/5] Planejando deploy...
terraform plan -out=tfplan
if errorlevel 1 (
    echo ERRO: Falha ao criar plano
    pause
    exit /b 1
)
echo.

echo ========================================
echo  REVISAR PLANO ACIMA
echo ========================================
echo.
echo O deploy ira criar aproximadamente 40 recursos na AWS.
echo Custos estimados: ~$15-106/mes
echo.
set /p CONFIRMA="Deseja continuar com o deploy? (S/N): "

if /i not "%CONFIRMA%"=="S" (
    echo Deploy cancelado pelo usuario.
    del tfplan
    pause
    exit /b 0
)

echo.
echo [5/5] Executando deploy...
echo Esta etapa pode levar 5-10 minutos...
echo.

terraform apply tfplan
if errorlevel 1 (
    echo ERRO: Falha no deploy
    del tfplan
    pause
    exit /b 1
)

del tfplan

echo.
echo ========================================
echo  DEPLOY CONCLUIDO COM SUCESSO!
echo ========================================
echo.

echo Recuperando URL do sistema...
echo.

for /f "delims=" %%i in ('terraform output -raw load_balancer_url 2^>nul') do set LB_URL=%%i

if defined LB_URL (
    echo ✓ Seu sistema esta disponivel em:
    echo.
    echo    %LB_URL%
    echo.
    echo Aguarde 2-3 minutos para as instancias ficarem prontas.
    echo.

    set /p ABRIR="Deseja abrir o sistema no navegador? (S/N): "
    if /i "!ABRIR!"=="S" (
        start %LB_URL%
    )
) else (
    echo Execute: terraform output
    echo Para ver a URL do Load Balancer
)

echo.
echo Proximos passos:
echo 1. Acesse a URL acima
echo 2. Faca upload da aplicacao real
echo 3. Configure dominio proprio (opcional)
echo 4. Adicione certificado SSL para HTTPS (opcional)
echo.
echo Para destruir a infraestrutura: terraform destroy
echo.

pause
