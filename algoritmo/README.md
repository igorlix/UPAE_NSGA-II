# UPAE NSGA-II Optimizer - Versão 2.0

Sistema de otimização multi-objetivo para alocação inteligente de pacientes em Unidades de Pronto Atendimento Especializado (UPAE) usando algoritmo genético NSGA-II.

---

## 🆕 Novidades da Versão 2.0

### Recursos Adicionados

- ✅ **Classificação de Severidade** (Verde/Amarelo/Vermelho)
- ✅ **Suporte a TFD** (Tratamento Fora de Domicílio)
- ✅ **Vulnerabilidade Social** (Baixa/Média/Alta)
- ✅ **Descrição de Condição Clínica** (32+ especialidades)
- ✅ **Campos Gestante/Deficiência** agora funcionais

### Melhorias no Algoritmo

- Fórmula de no-show agora considera **5 fatores** (anteriormente 2)
- Matriz de interação vulnerabilidade × severidade
- Ajuste realista de escassez de vagas (80→65)
- **Backward compatibility completa** (requisições antigas continuam funcionando)

---

## 📋 Instalação

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

## 🎯 Classificação de Severidade (Verde/Amarelo/Vermelho)

Sistema de urgência clínica que afeta a probabilidade de no-show:

### 🟢 VERDE (Não urgente)
- **Exemplos**: Perda de peso, check-up cardiológico, consultas de rotina
- **Impacto**: +40% na probabilidade base de falta
- **Comportamento**: Pacientes mais propensos a faltar se distância/espera for alta

### 🟡 AMARELO (Moderado)
- **Exemplos**: Diabetes controlado, acompanhamento pós-cirúrgico
- **Impacto**: Baseline (sem alteração)
- **Comportamento**: Padrão de no-show esperado

### 🔴 VERMELHO (Urgente)
- **Exemplos**: Diabetes descontrolado, dor aguda, condições descompensadas
- **Impacto**: -50% na probabilidade base de falta
- **Comportamento**: Paciente não falta mesmo com distância/espera alta

---

## 🚑 TFD (Tratamento Fora de Domicílio)

Pacientes elegíveis para transporte custeado pelo SUS:

- ✅ Transporte garantido (passagem, ambulância, aéreo)
- ✅ Ajuda de custo para alimentação e pernoite
- ✅ **Impacto**: Redução de 70% na penalidade de distância
- ✅ Permite alocação em UPAEs distantes sem aumento significativo de no-show

---

## 👥 Vulnerabilidade Social

Avaliação simplificada que interage com a severidade clínica:

- **Baixa**: Renda estável, moradia fixa, suporte familiar
- **Média**: Instabilidade moderada (padrão)
- **Alta**: Instabilidade habitacional, baixa renda, sem suporte

### Interação com Severidade:
- Alta vulnerabilidade + Verde (não urgente) → **1.5x no-show** (paciente não prioriza)
- Alta vulnerabilidade + Vermelho (urgente) → **1.0x no-show** (urgência supera barreiras)
- Baixa vulnerabilidade → **0.9x no-show** (mais confiável)

---

## 📊 Fórmula de No-Show Aprimorada

### Versão Anterior (2 fatores)
```python
p_noshow = base * (1 + λ_dist * dist/30) * (1 - λ_transport * transport)
```

### Versão Nova (5 fatores)
```python
# 1. Ajuste por severidade
adjusted_base = base_no_show * SEVERITY_MULT[severity]

# 2. Ajuste TFD (se elegível)
if tfd_eligible:
    effective_transport = min(1.0, transport + 0.7)
    effective_lambda_d = LAMBDA_D * 0.3
else:
    effective_transport = transport
    effective_lambda_d = LAMBDA_D

# 3. Aplicar distância e transporte
p_intermediate = adjusted_base * (1 + effective_lambda_d * dist/30) * \
                 (1 - LAMBDA_T * effective_transport)

# 4. Aplicar interação vulnerabilidade-severidade
vuln_sev_mult = VULN_SEV_MATRIX[(vulnerability, severity)]
p_final = clamp(p_intermediate * vuln_sev_mult, 0.0, 0.95)
```

### Constantes
```python
LAMBDA_D = 0.02           # Sensibilidade à distância
LAMBDA_T = 0.5            # Sensibilidade ao transporte
LAMBDA_SEV = 0.6          # Impacto de severidade (documentado)
LAMBDA_TFD = 0.7          # Fator TFD
LAMBDA_VULN = 0.3         # Impacto de vulnerabilidade (documentado)

SEVERITY_MULTIPLIERS = {
    'verde': 1.4,         # +40%
    'amarelo': 1.0,       # Baseline
    'vermelho': 0.5       # -50%
}

VULN_SEV_INTERACTION = {
    ('baixa', 'verde'): 0.9,
    ('baixa', 'amarelo'): 0.85,
    ('baixa', 'vermelho'): 0.8,
    ('media', 'verde'): 1.1,
    ('media', 'amarelo'): 1.0,
    ('media', 'vermelho'): 0.9,
    ('alta', 'verde'): 1.5,
    ('alta', 'amarelo'): 1.2,
    ('alta', 'vermelho'): 1.0
}
```

---

## 📡 API Endpoints

### POST /api/otimizar
Otimiza alocação para um único paciente.

**Request Body**:
```json
{
  "paciente": {
    "id": "pac-123",
    "nome": "João Silva",
    "especialidade": "Endocrinologia",
    "lat": -8.0476,
    "lon": -34.8770,

    // NOVOS CAMPOS v2.0 (opcionais)
    "severity_level": "vermelho",
    "condition_description": "Diabetes descontrolado",
    "tfd_eligible": false,
    "vulnerability_level": "alta",
    "gestante": false,
    "deficiencia": false
  },
  "upaes": [
    {
      "id": "upae-arruda",
      "nome": "UPAE Arruda",
      "endereco": "Av. Prof. José dos Anjos, s/n",
      "lat": -8.0397,
      "lon": -34.9147,
      "especialidades": ["Endocrinologia", "Cardiologia"],
      "tempo_espera_dias": 7,
      "transport_score": 0.7
    }
  ]
}
```

**Response**:
```json
{
  "sucesso": true,
  "melhor_opcao": {
    "upae": {
      "id": "upae-arruda",
      "nome": "UPAE Arruda (Recife)",
      "endereco": "Av. Prof. José dos Anjos, s/n",
      "lat": -8.0397,
      "lon": -34.9147
    },
    "distancia_km": 12.5,
    "prob_noshow": 8.2,
    "tempo_espera_dias": 7,
    "tipo": "compromisso"
  },
  "alternativas": [
    {
      "upae": {...},
      "distancia_km": 8.2,
      "prob_noshow": 18.1,
      "tempo_espera_dias": 14,
      "tipo": "minima_distancia"
    }
  ],
  "diagnosticos": {
    "distancia_media_km": 10.3,
    "espera_media_dias": 10.5,
    "prob_noshow_media": 16.7
  }
}
```

### POST /api/otimizar-lote
Otimiza alocação para múltiplos pacientes simultaneamente.

### GET /health
Health check do servidor.

---

## 💾 Modelo de Dados do Paciente

### Campos Obrigatórios
```python
{
    'id': str,                      # Identificador único
    'especialidade': str,           # Especialidade requerida
    'lat': float,                   # Latitude (geocodificada)
    'lon': float                    # Longitude (geocodificada)
}
```

### Campos Novos v2.0 (Opcionais com Defaults)
```python
{
    'severity_level': str,          # 'verde' | 'amarelo' | 'vermelho'
                                    # Default: 'amarelo'

    'condition_description': str,   # Descrição da condição clínica
                                    # Default: ''

    'tfd_eligible': bool,           # Elegibilidade para TFD
                                    # Default: False

    'vulnerability_level': str,     # 'baixa' | 'media' | 'alta'
                                    # Default: 'media'
}
```

### Campos Existentes (Agora Funcionais)
```python
{
    'gestante': bool,               # Gravidez
    'deficiencia': bool             # Pessoa com Deficiência
}
```

---

## 🔄 Backward Compatibility

Requisições antigas sem novos campos são **totalmente compatíveis**:

```python
# Se campos ausentes, o sistema usa defaults:
severity_level = 'amarelo'
tfd_eligible = False
vulnerability_level = 'media'
condition_description = ''
gestante = False
deficiencia = False
```

---

## 📚 Exemplos de Uso

### Caso 1: Paciente Vulnerável com Problema Simples
```python
paciente = {
    'especialidade': 'Endocrinologia',
    'lat': -8.05, 'lon': -34.88,
    'severity_level': 'verde',          # Não urgente
    'vulnerability_level': 'alta',      # Alta vulnerabilidade
    'tfd_eligible': False,
    'condition_description': 'Controle de peso'
}
# Resultado: Alta probabilidade de no-show se distância > 20km
# Algoritmo priorizará UPAE próxima
```

### Caso 2: Paciente Vulnerável com Problema Grave
```python
paciente = {
    'especialidade': 'Cardiologia',
    'lat': -8.05, 'lon': -34.88,
    'severity_level': 'vermelho',       # Urgente
    'vulnerability_level': 'alta',      # Alta vulnerabilidade
    'tfd_eligible': False,
    'condition_description': 'Insuficiência cardíaca descompensada'
}
# Resultado: Baixa probabilidade de no-show mesmo com distância alta
# Urgência supera barreiras - pode alocar em UPAE distante se necessário
```

### Caso 3: Paciente TFD
```python
paciente = {
    'especialidade': 'Neurologia',
    'lat': -8.05, 'lon': -34.88,
    'severity_level': 'amarelo',
    'vulnerability_level': 'media',
    'tfd_eligible': True,               # Transporte garantido
    'condition_description': 'Epilepsia'
}
# Resultado: Penalidade de distância reduzida em 70%
# Pode ser alocado em UPAE de outro município sem grande aumento de no-show
```

---

## ⚙️ Algoritmo NSGA-II

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

### Escassez de Vagas (v2.0):
- Pacientes: 60
- Vagas disponíveis: **65** (8% de escassez)
- Força competição real entre soluções

---

## 🧪 Exemplos Práticos de No-Show

### Exemplo 1: Verde + Alta Vulnerabilidade + 50km + Sem TFD
- Base (Endocrinologia): 0.40
- Severity (verde): 0.40 × 1.4 = **0.56**
- Distância: × 1.033
- Transporte: × 0.75
- p_intermediate = 0.434
- Vuln-Sev (alta+verde): × 1.5
- **Resultado: 65% chance de falta** ❌

### Exemplo 2: Vermelho + Alta Vulnerabilidade + 50km + Sem TFD
- Base (Cardiologia): 0.05
- Severity (vermelho): 0.05 × 0.5 = **0.025**
- Distância: × 1.033
- Transporte: × 0.75
- p_intermediate = 0.019
- Vuln-Sev (alta+vermelho): × 1.0 (neutralizado!)
- **Resultado: 2% chance de falta** ✅ (urgência supera barreiras)

### Exemplo 3: Verde + Baixa Vulnerabilidade + 50km + COM TFD
- Base (Endocrinologia): 0.40
- Severity (verde): 0.56
- TFD: effective_lambda_d = 0.006 (muito reduzido!)
- Distância: × 1.01
- Transporte: × 0.5
- p_intermediate = 0.283
- Vuln-Sev (baixa+verde): × 0.9
- **Resultado: 25% chance de falta** ✅ (TFD compensou)

---

## 🔧 Integração com Frontend

O frontend em `index.html` faz requisições POST para `/api/otimizar` passando:
1. Dados do paciente (incluindo novos campos v2.0)
2. Lista de UPAEs disponíveis

Os novos campos são capturados automaticamente pelo formulário na seção **"Informações Clínicas"**.

---

## 📖 Changelog

### v2.0.0 (2025-12)

**Novos Recursos**:
- Classificação de severidade (Verde/Amarelo/Vermelho)
- Suporte a TFD (Tratamento Fora de Domicílio)
- Avaliação de vulnerabilidade social
- Descrição de condição clínica por especialidade
- Campos gestante/deficiência agora funcionais

**Melhorias no Algoritmo**:
- Fórmula de no-show multi-fatorial (2→5 fatores)
- Matriz de interação vulnerabilidade×severidade
- Ajuste realista de escassez de vagas (80→65)

**Backward Compatibility**:
- API aceita requisições antigas com defaults
- Novos campos opcionais
- Validação robusta com fallbacks

### v1.0.0 (2025-11)
- NSGA-II básico com 2 objetivos
- Cálculo de no-show baseado em distância e transporte

---

## 👨‍💻 Desenvolvimento

### Arquivos Principais:
- `api_server.py`: API Flask com endpoints REST
- `otimizador_genetico.py`: Implementação do NSGA-II e cálculo de no-show
- `upae_nsga2.py`: Funções auxiliares e geração de dados de teste

### Testes:
```bash
cd algoritmo
pytest test_noshow_formula.py -v
```

---

## 📄 Licença

Sistema desenvolvido para otimização de agendamento em UPAEs do SUS.
