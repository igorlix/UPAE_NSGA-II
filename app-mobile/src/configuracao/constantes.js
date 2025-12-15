// configuracoes gerais do sistema upae
export const CONFIGURACAO = {
  // chave do google maps
  GOOGLE_MAPS_API_KEY: 'AIzaSyCb50vDWd3YK1Nzla_r2wZg3V1hd3nAPII',

  // endpoints da api
  API: {
    BASE_URL: '/api',
    OTIMIZADOR: '/api/otimizar',
  },

  // pesos do algoritmo de otimizacao
  OTIMIZACAO: {
    PESO_DISTANCIA: 0.4,
    PESO_TEMPO_ESPERA: 0.3,
    PESO_CUSTO: 0.2,
    PESO_TRANSPORTE: 0.1,
    MAX_DISTANCIA_KM: 100,
    MAX_TEMPO_ESPERA_DIAS: 30,
  },

  // prioridades de atendimento
  PRIORIDADES: {
    URGENTE: { valor: 5, descricao: 'Caso urgente' },
    IDOSO: { valor: 4, descricao: 'Paciente idoso (60+)' },
    CRIANCA: { valor: 3, descricao: 'Crianca (0-12 anos)' },
    DEFICIENCIA: { valor: 3, descricao: 'Pessoa com deficiencia' },
    NORMAL: { valor: 1, descricao: 'Atendimento normal' },
  },

  // duracao do toast em ms
  DURACAO_TOAST: 5000,

  // regex de validacao
  REGEX_CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  REGEX_CEP: /^\d{5}-?\d{3}$/,
}

// lista de municipios disponiveis
export const MUNICIPIOS = [
  { valor: 'recife', rotulo: 'Recife' },
  { valor: 'jaboatao', rotulo: 'Jaboatao dos Guararapes' },
  { valor: 'olinda', rotulo: 'Olinda' },
  { valor: 'paulista', rotulo: 'Paulista' },
  { valor: 'caruaru', rotulo: 'Caruaru' },
  { valor: 'petrolina', rotulo: 'Petrolina' },
  { valor: 'cabo', rotulo: 'Cabo de Santo Agostinho' },
  { valor: 'camaragibe', rotulo: 'Camaragibe' },
  { valor: 'garanhuns', rotulo: 'Garanhuns' },
  { valor: 'vitoria', rotulo: 'Vitoria de Santo Antao' },
  { valor: 'igarassu', rotulo: 'Igarassu' },
  { valor: 'abreu_e_lima', rotulo: 'Abreu e Lima' },
]

// especialidades nao medicas (equipe multidisciplinar)
export const ESPECIALIDADES_NAO_MEDICAS = new Set([
  'Nutricao',
  'Psicologia',
  'Fisioterapia',
  'Fonoaudiologia',
  'Terapia Ocupacional',
  'Enfermagem',
  'Servico Social',
  'Farmacia',
  'Estomaterapia',
  'Educacao Fisica',
  'Odontologia',
  'Psicopedagogia',
])

// opcoes de genero
export const GENEROS = [
  { valor: 'homem-cis', rotulo: 'Homem Cis' },
  { valor: 'mulher-cis', rotulo: 'Mulher Cis' },
  { valor: 'homem-trans', rotulo: 'Homem Trans' },
  { valor: 'mulher-trans', rotulo: 'Mulher Trans' },
  { valor: 'outro', rotulo: 'Outro' },
]

// opcoes de urgencia
export const NIVEIS_URGENCIA = [
  { valor: 'verde', rotulo: 'Rotina', cor: '#10b981', descricao: 'Acompanhamento de rotina' },
  { valor: 'amarelo', rotulo: 'Moderado', cor: '#f59e0b', descricao: 'Requer atencao em breve' },
  { valor: 'vermelho', rotulo: 'Urgente', cor: '#ef4444', descricao: 'Necessita atendimento prioritario' },
]

// credenciais de teste
export const CREDENCIAIS_TESTE = {
  email: 'admin@admin.com',
  senha: 'admin',
}
