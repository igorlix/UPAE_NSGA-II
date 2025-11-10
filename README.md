# Sistema de Otimização e Transparência na Distribuição de Pacientes nas UPAs

Sistema inteligente para agendamento e alocação otimizada de consultas médicas desenvolvido com HTML, Tailwind CSS, JavaScript e integração com Google Maps API.

## 🎯 Problema que Resolve

**Contexto:** Diversos municípios não possuem todas as especialidades clínicas médicas necessárias. O município solicita à Secretaria de Saúde do Estado marcação da consulta em outro município com vacância.

**Problema Atual:**
- Alta taxa de faltas no comparecimento dos pacientes
- Distância excessiva entre casa do paciente e local da consulta
- Falta de transparência no sistema de alocação
- Custos elevados de transporte

**Solução:** Sistema que otimiza a distribuição de pacientes considerando:
- ✅ Distância entre paciente e local da consulta
- ✅ Disponibilidade e custo de transporte público
- ✅ Tempo de espera
- ✅ Priorização de grupos especiais (gestantes, idosos, etc.)
- ✅ Transparência e explicabilidade das decisões (IA Responsável)

## 📁 Estrutura do Projeto

```
CN/
├── index.html              # Página principal de agendamento
├── resultado.html          # Página de resultado com explicação
├── dashboard.html          # Dashboard administrativo
├── Prototipo.html         # Arquivo original (backup)
├── package.json           # Dependências e scripts npm
├── tailwind.config.js     # Configuração do Tailwind CSS
├── .gitignore            # Arquivos ignorados pelo git
├── README.md             # Esta documentação
└── src/                  # Código fonte
    ├── css/
    │   └── styles.css                # Estilos customizados
    └── js/
        ├── config.js                 # Configurações da aplicação
        ├── app.js                    # Lógica principal do formulário
        ├── maps-integration.js       # Integração Google Maps API
        ├── otimizacao.js            # Algoritmo de otimização
        ├── resultado.js             # Página de resultado
        └── dashboard.js             # Dashboard administrativo
```

## 🚀 Funcionalidades Principais

### 1. 📝 Formulário de Agendamento Inteligente
- Validação em tempo real de todos os campos
- Validação completa de CPF com algoritmo oficial
- Máscaras automáticas para CPF e CEP
- Busca automática de CEP via API ViaCEP
- Sistema de priorização para grupos especiais

### 2. 🧠 Sistema de Otimização com IA
- **Algoritmo Multiobjetivo** que considera:
  - 40% Distância (menor distância possível)
  - 30% Tempo de espera
  - 20% Custo de transporte
  - 10% Disponibilidade de transporte público

- **Priorização Automática:**
  - 🚨 Urgente (prioridade 5)
  - 👴 Idosos 65+ (prioridade 4)
  - 🤰 Gestantes (prioridade 4)
  - 👶 Crianças 0-12 anos (prioridade 3)
  - ♿ Pessoas com deficiência (prioridade 3)
  - Normal (prioridade 1)

### 3. 🗺️ Integração com Google Maps
- Cálculo de distância real (não em linha reta)
- Rotas de transporte público com transferências
- Estimativa de tempo de viagem
- Estimativa de custo (ônibus e aplicativo)
- Visualização em mapa interativo

### 4. 🔍 Transparência e Explicabilidade (IA Responsável)
- Explicação clara de por que cada alocação foi escolhida
- Detalhamento dos fatores que influenciaram a decisão
- Visualização dos pesos do algoritmo
- Conformidade com LGPD
- Auditabilidade total

### 5. 📊 Dashboard Administrativo
- KPIs em tempo real:
  - Total de pacientes
  - Taxa de comparecimento
  - Distância média
  - Custo médio
- Gráficos interativos (Chart.js)
- Tabela de agendamentos recentes
- Análise de distribuição por município

### 6. 📱 Interface Responsiva
- Design mobile-first
- Compatível com todos os dispositivos
- Animações suaves
- Toast notifications
- Feedback visual instantâneo

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **Tailwind CSS 3.4+** - Framework CSS utility-first
- **JavaScript ES6+** - Lógica e algoritmos
- **Chart.js** - Gráficos interativos

### APIs e Integrações
- **Google Maps API** - Rotas, distâncias e mapas
  - Distance Matrix API
  - Directions API
  - Geocoding API
- **ViaCEP** - Busca de endereços

### Algoritmos
- **Otimização Multiobjetivo** - Função objetivo ponderada
- **Algoritmo Genético** (preparado) - Otimização global
- **Seleção por Torneio** - Computação natural

## 📋 Como Usar

### Opção 1: Abrir diretamente (Modo simples)
1. Configure sua chave do Google Maps em `src/js/config.js`:
```javascript
GOOGLE_MAPS_API_KEY: 'SUA_CHAVE_AQUI'
```

2. Abra `index.html` em um navegador moderno

### Opção 2: Desenvolvimento local com servidor

1. **Instalar dependências:**
```bash
npm install
```

2. **Iniciar servidor local:**
```bash
npm run serve
```

3. Acesse: `http://localhost:8080`

## 🔑 Configuração da Google Maps API

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Ative as seguintes APIs:
   - Maps JavaScript API
   - Distance Matrix API
   - Directions API
   - Geocoding API
   - Places API
4. Crie uma chave de API
5. Adicione a chave em `src/js/config.js`

## ⚙️ Configuração do Sistema

### Pesos do Algoritmo de Otimização
Edite em `src/js/config.js`:

```javascript
OTIMIZACAO: {
  PESO_DISTANCIA: 0.4,      // 40%
  PESO_TEMPO_ESPERA: 0.3,   // 30%
  PESO_CUSTO: 0.2,          // 20%
  PESO_TRANSPORTE: 0.1,     // 10%
  MAX_DISTANCIA_KM: 100,
  MAX_TEMPO_ESPERA_DIAS: 30
}
```

### Prioridades de Pacientes
```javascript
PRIORIDADES: {
  URGENTE: { valor: 5, descricao: 'Caso urgente' },
  IDOSO: { valor: 4, descricao: 'Paciente idoso (65+)' },
  GESTANTE: { valor: 4, descricao: 'Gestante' },
  // ...
}
```

### Municípios Disponíveis
Adicione ou edite municípios em `src/js/config.js`:

```javascript
MUNICIPIOS: {
  recife: {
    nome: 'Recife',
    lat: -8.0476,
    lng: -34.8770,
    regiao: 'Metropolitana'
  },
  // ...
}
```

## 🔐 Segurança e Privacidade

### LGPD
- ✅ Consentimento explícito para uso de localização
- ✅ Transparência no uso dos dados
- ✅ Finalidade clara (otimização de alocação)
- ✅ Dados processados localmente no navegador

### Validações
- ✅ Client-side: JavaScript
- ⚠️ **IMPORTANTE:** Sempre validar no backend
- ✅ Sanitização de inputs
- ✅ Proteção contra XSS

## 📊 Formato dos Dados

### Dados do Agendamento
```json
{
  "nome": "João da Silva",
  "cpf": "123.456.789-00",
  "idade": 45,
  "gestante": false,
  "deficiencia": false,
  "urgente": false,
  "especialidade": "cardiologia",
  "municipio": "recife",
  "endereco": "Rua Exemplo, 123",
  "consentimentoLocalizacao": true,
  "dataEnvio": "2025-01-15T10:30:00.000Z"
}
```

### Resultado da Otimização
```json
{
  "sucesso": true,
  "melhorOpcao": {
    "especialista": { /* dados */ },
    "score": 0.234,
    "detalhes": {
      "distancia": 12.5,
      "tempoEspera": 5,
      "custo": 4.10,
      "custoUber": 35.50,
      "numeroTransferencias": 1
    },
    "viavel": true
  },
  "explicacao": { /* transparência */ },
  "alternativas": [ /* outras opções */ ]
}
```

## 🧪 Exemplos de Uso

### Buscar Especialistas Disponíveis
```javascript
const especialistas = await buscarEspecialistas({
  especialidade: 'cardiologia',
  municipio: 'recife'
});
```

### Otimizar Alocação
```javascript
const resultado = await otimizador.encontrarMelhorAlocacao(
  paciente,
  especialistas
);
```

### Calcular Distância e Custo
```javascript
const transporte = await mapsIntegration.estimarCustoTransporte(
  'Recife, PE',
  'Cabo de Santo Agostinho, PE'
);
```

## 📈 Melhorias Futuras

- [ ] Backend completo com Node.js/Express
- [ ] Banco de dados (PostgreSQL/MongoDB)
- [ ] Autenticação e autorização
- [ ] Sistema de notificações (SMS/Email)
- [ ] Integração com sistemas do SUS
- [ ] Machine Learning para prever taxa de comparecimento
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados
- [ ] CI/CD Pipeline
- [ ] Multilíngua (i18n)

## 🎨 Páginas do Sistema

### 1. index.html - Formulário de Agendamento
- Formulário completo com validações
- Campos de priorização
- Sistema de consentimento LGPD

### 2. resultado.html - Resultado da Otimização
- Melhor opção detalhada
- Explicação transparente da decisão
- Alternativas disponíveis
- Mapa interativo
- Opções de impressão e compartilhamento

### 3. dashboard.html - Dashboard Administrativo
- KPIs principais
- Gráficos de distribuição
- Tabela de agendamentos
- Análise de performance

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar

## 👥 Equipe

Projeto desenvolvido para otimizar a distribuição de pacientes nas UPAs de Pernambuco, visando reduzir faltas e melhorar a acessibilidade ao sistema de saúde.

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para melhorar o sistema de saúde pública**

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como parte de uma solução para o problema de alta taxa de faltas em consultas especializadas no sistema de saúde de Pernambuco, utilizando:

- **IA Responsável** - Transparência e explicabilidade
- **Computação Natural** - Algoritmos genéticos
- **Otimização Multiobjetivo** - Balanceamento de múltiplos critérios
- **LGPD** - Conformidade com lei de proteção de dados

### Resultados Esperados
- ✅ Redução de 30% nas faltas por dificuldade de locomoção
- ✅ Diminuição de 40% na distância média percorrida
- ✅ Economia de 25% nos custos de transporte dos pacientes
- ✅ Aumento de 20% na taxa de comparecimento
- ✅ 100% de transparência nas decisões de alocação
