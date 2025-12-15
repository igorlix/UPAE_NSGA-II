# Sistema de Otimização e Transparência na Distribuição de Pacientes nas UPAs

Sistema inteligente para agendamento e alocação otimizada de consultas médicas nas Unidades de Pronto Atendimento Especializado (UPAE) de Pernambuco.

## Visão Geral

O projeto implementa um algoritmo genético NSGA-II que otimiza simultaneamente múltiplos objetivos na alocação de pacientes:

- Minimização da distância entre paciente e UPAE
- Minimização do tempo de espera para consulta
- Minimização da probabilidade de não comparecimento (no-show)
- Maximização do acesso via transporte público

O algoritmo considera fatores clínicos e sociais para produzir alocações mais eficientes e equitativas, reduzindo faltas e melhorando o uso dos recursos do sistema de saúde.

## Algoritmo de Otimização

Para detalhes completos sobre o funcionamento, fórmulas e parâmetros, consulte [algoritmo/README.md](algoritmo/README.md).

**Principais características:**
- Otimização multi-objetivo com Front de Pareto
- Considera severidade clínica
- Calcula de probabilidade de no-show

**Executar o servidor da API:**
```bash
cd algoritmo
pip install -r requirements.txt
python api_server.py
# Servidor iniciado em http://localhost:5000
```

## Estrutura do Projeto

O projeto possui duas versões de interface:

### 1. Versão Web (HTML/CSS/JavaScript)
Interface web tradicional desenvolvida com HTML5, Tailwind CSS e JavaScript puro. Está na raiz do projeto.

**Tecnologias:**
- HTML5
- Tailwind CSS 3.4+
- JavaScript ES6+
- Google Maps API

**Como executar:**
```bash
# Abra o index.html em um navegador web
# Ou use um servidor local simples
python -m http.server 8000
cd algoritmo
pip install -r requirements.txt
python api_server.py
# Acesse http://localhost:8000
```

### 2. Versão Mobile (React Native + Expo)
Aplicativo mobile multiplataforma desenvolvido com React Native e Expo. Localizada em `app-mobile/`.

**Tecnologias:**
- React Native
- Expo SDK 54

**Como executar:**
```bash
cd app-mobile
npm install
npx expo start

# Para rodar em dispositivo físico:
# - Instale Expo Go no celular
# - Escaneie QR code

# Para rodar em emulador:
# - Android: npx expo start --android
# - iOS: npx expo start --ios
```

## Desenvolvido por:

O sistema foi desenvolvido pelos alunos da graduação em Engenharia na Computação na UPE na disciplina de Computação Natural.
