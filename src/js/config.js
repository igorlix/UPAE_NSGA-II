// Configurações da aplicação
const APP_CONFIG = {
  // Google Maps API - IMPORTANTE: Substitua pela sua chave
  GOOGLE_MAPS_API_KEY: 'AIzaSyDosD-8buFssKmkoSQCtqNKskkvtn_5E6E',

  // Endpoints da API (ajustar conforme backend)
  API: {
    BASE_URL: '/api',
    AGENDAMENTO: '/api/agendamento',
    ESPECIALISTAS: '/api/especialistas',
    MUNICIPIOS: '/api/municipios',
    OTIMIZACAO: '/api/otimizacao',
    TRANSPORTE: '/api/transporte'
  },

  // Configurações de otimização
  OTIMIZACAO: {
    PESO_DISTANCIA: 0.4,      // 40% - Importância da distância
    PESO_TEMPO_ESPERA: 0.3,   // 30% - Importância do tempo de espera
    PESO_CUSTO: 0.2,          // 20% - Importância do custo
    PESO_TRANSPORTE: 0.1,     // 10% - Disponibilidade de transporte
    MAX_DISTANCIA_KM: 100,    // Distância máxima aceitável
    MAX_TEMPO_ESPERA_DIAS: 30 // Tempo máximo de espera
  },

  // Prioridades de pacientes
  PRIORIDADES: {
    URGENTE: { valor: 5, descricao: 'Caso urgente' },
    IDOSO: { valor: 4, descricao: 'Paciente idoso (65+)' },
    GESTANTE: { valor: 4, descricao: 'Gestante' },
    CRIANCA: { valor: 3, descricao: 'Criança (0-12 anos)' },
    DEFICIENCIA: { valor: 3, descricao: 'Pessoa com deficiência' },
    NORMAL: { valor: 1, descricao: 'Atendimento normal' }
  },

  // Municípios de Pernambuco com coordenadas
  MUNICIPIOS: {
    recife: {
      nome: 'Recife',
      lat: -8.0476,
      lng: -34.8770,
      regiao: 'Metropolitana'
    },
    jaboatao: {
      nome: 'Jaboatão dos Guararapes',
      lat: -8.1128,
      lng: -35.0148,
      regiao: 'Metropolitana'
    },
    olinda: {
      nome: 'Olinda',
      lat: -8.0089,
      lng: -34.8553,
      regiao: 'Metropolitana'
    },
    cabo: {
      nome: 'Cabo de Santo Agostinho',
      lat: -8.2814,
      lng: -35.0349,
      regiao: 'Metropolitana'
    },
    paulista: {
      nome: 'Paulista',
      lat: -7.9406,
      lng: -34.8728,
      regiao: 'Metropolitana'
    },
    igarassu: {
      nome: 'Igarassu',
      lat: -7.8342,
      lng: -34.9062,
      regiao: 'Metropolitana'
    },
    caruaru: {
      nome: 'Caruaru',
      lat: -8.2837,
      lng: -35.9761,
      regiao: 'Agreste'
    },
    petrolina: {
      nome: 'Petrolina',
      lat: -9.3891,
      lng: -40.5030,
      regiao: 'Sertão'
    },
    garanhuns: {
      nome: 'Garanhuns',
      lat: -8.8902,
      lng: -36.4927,
      regiao: 'Agreste'
    },
    vitoria: {
      nome: 'Vitória de Santo Antão',
      lat: -8.1194,
      lng: -35.2919,
      regiao: 'Mata'
    }
  },

  // Especialidades médicas disponíveis
  ESPECIALIDADES: [
    'Cardiologia',
    'Dermatologia',
    'Ortopedia',
    'Pediatria',
    'Ginecologia',
    'Oftalmologia',
    'Psiquiatria',
    'Neurologia',
    'Endocrinologia',
    'Urologia',
    'Otorrinolaringologia',
    'Reumatologia'
  ],

  // Toast e feedback
  TOAST_DURATION: 5000,

  // Validações
  CPF_REGEX: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CEP_REGEX: /^\d{5}-?\d{3}$/
};

// Exportar configuração (para uso em módulos)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APP_CONFIG;
}
