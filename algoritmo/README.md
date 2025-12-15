# UPAE NSGA-II Optimizer - Versão 2.0

Sistema de otimização multi-objetivo para alocação inteligente de pacientes em Unidades de Pronto Atendimento Especializado (UPAE) usando algoritmo genético NSGA-II.

---

## Algoritmo NSGA-II

O algoritmo genético considera múltiplos objetivos simultaneamente:

### Objetivos de Otimização:
- **Distância**: Minimizar deslocamento do paciente
- **Tempo de Espera**: Minimizar dias até consulta
- **Probabilidade de No-Show**: Minimizar faltas (agora com 5 fatores)
- **Transporte Público**: Priorizar locais com melhor acesso

### Parâmetros do GA:
- População: 120 indivíduos
- Gerações: 400
- Taxa de Crossover: 0.7
- Taxa de Mutação: 0.3
- Elitismo: 15%

### Escassez de Vagas:
- Pacientes: 60
- Vagas disponíveis: **65** (8% de escassez)

## Versão 2.0

### Recursos

- **Classificação de Severidade** 
- **Suporte a TFD** 
- **Descrição de Condição Clínica**
- **Campos Gestante/Deficiência**

### Melhorias no Algoritmo

- Fórmula de no-show agora considera **5 fatores** (anteriormente 2)
- Integração de severidade
- Ajuste na escassez de vagas

---

## Instalação

### 1. Instale as dependências:
```bash
pip install -r requirements.txt
```

### 2. Inicie o servidor:
```bash
python api_server.py
```

### 3. O servidor estará rodando em:
```
http://localhost:5000
```

---

## Classificação de Severidade (Verde/Amarelo/Vermelho)

Sistema de urgência clínica que afeta a probabilidade de no-show:

### VERDE (Não urgente)
- **Exemplos**: Perda de peso, check-up cardiológico, consultas de rotina
- **Impacto**: +40% na probabilidade base de falta
- **Comportamento**: Pacientes mais propensos a faltar se distância/espera for alta

### AMARELO (Moderado)
- **Exemplos**: Diabetes controlado, acompanhamento pós-cirúrgico
- **Impacto**: Baseline (sem alteração)
- **Comportamento**: Padrão de no-show esperado

### VERMELHO (Urgente)
- **Exemplos**: Diabetes descontrolado, dor aguda, condições descompensadas
- **Impacto**: -50% na probabilidade base de falta
- **Comportamento**: Paciente não falta mesmo com distância/espera alta

---

## TFD (Tratamento Fora de Domicílio)

Pacientes elegíveis para transporte custeado pelo SUS:

- Transporte garantido (passagem, ambulância, aéreo)
- Ajuda de custo para alimentação e pernoite
- **Impacto**: Redução de 70% na penalidade de distância
- Permite alocação em UPAEs distantes sem aumento significativo de no-show
---

## Integração com Frontend

O frontend em `index.html` faz requisições POST para `/api/otimizar` passando:
1. Dados do paciente (incluindo novos campos v2.0)
2. Lista de UPAEs disponíveis

Os novos campos são capturados automaticamente pelo formulário na seção **"Informações Clínicas"**.

---

## Desenvolvimento

### Arquivos Principais:
- `api_server.py`: API Flask com endpoints REST
- `otimizador_genetico.py`: Implementação do NSGA-II e cálculo de no-show
- `upae_nsga2.py`: Funções auxiliares e geração de dados de teste

---