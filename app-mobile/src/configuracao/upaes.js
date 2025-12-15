// lista completa de upaes e seus servicos
export const UPAES = [
  {
    id: 'upae-grande-recife',
    nome: 'UPAE Grande Recife (Abreu e Lima)',
    municipio: 'Abreu e Lima',
    endereco: 'BR-101, 285 - Desterro, Abreu e Lima - PE, 53600-000',
    especialidades: [
      'Alergologia', 'Anestesiologia', 'Cardiologia', 'Cirurgia Geral',
      'Colposcopia', 'Dermatologia', 'Endocrinologia', 'Endoscopia',
      'Gastroenterologia', 'Infectologia', 'Nefrologia', 'Neurologia Clinica',
      'Otorrinolaringologia', 'Pneumologia', 'Radiologia', 'Reumatologia', 'Urologia',
      'Nutricao', 'Psicologia', 'Fisioterapia', 'Fonoaudiologia',
      'Terapia Ocupacional', 'Enfermagem', 'Servico Social', 'Farmacia'
    ],
    regiao: 'RMR',
  },
  {
    id: 'upae-arruda',
    nome: 'UPAE Arruda (Recife)',
    municipio: 'Recife',
    endereco: 'Av. Prof. Jose dos Anjos, s/n - Arruda, Recife - PE, 52171-011',
    especialidades: [
      'Reumatologia', 'Endocrinologia', 'Cardiologia', 'Neurologia',
      'Nefrologia', 'Psiquiatria', 'Urologia', 'Pneumologia', 'Ortopedia',
      'Fisioterapia', 'Terapia Ocupacional', 'Nutricao', 'Psicologia',
      'Enfermagem', 'Farmacia', 'Servico Social', 'Estomaterapia'
    ],
    regiao: 'RMR',
  },
  {
    id: 'upae-mustardinha',
    nome: 'UPAE Mustardinha (Recife)',
    municipio: 'Recife',
    endereco: 'R. Maj. Mario Portela, 279 - Mustardinha, Recife - PE, 50760-090',
    especialidades: [
      'Cardiologia', 'Pediatria', 'Gastroenterologia Clinica',
      'Endocrinologia Infantil', 'Pneumologia', 'Infectologia', 'Neurologia',
      'Ortopedia', 'Reumatologia', 'Otorrinolaringologia', 'Psiquiatria',
      'Odontologia', 'Fonoaudiologia', 'Fisioterapia', 'Terapia Ocupacional',
      'Nutricao', 'Psicologia', 'Enfermagem', 'Estomaterapia', 'Servico Social'
    ],
    regiao: 'RMR',
  },
  {
    id: 'upae-ibura',
    nome: 'UPAE Ibura (Recife)',
    municipio: 'Recife',
    endereco: 'Av. Dois Rios, 170 - Ibura, Recife - PE, 51230-000',
    especialidades: [
      'Cardiologia', 'Pediatria', 'Gastroenterologia Clinica', 'Endocrinologia',
      'Pneumologia', 'Infectologia', 'Neurologia', 'Ortopedia', 'Reumatologia',
      'Otorrinolaringologia', 'Dermatologia', 'Oftalmologia', 'Psiquiatria',
      'Neuropediatria', 'Psiquiatria Infantil',
      'Fonoaudiologia', 'Fisioterapia', 'Terapia Ocupacional', 'Nutricao',
      'Psicopedagogia', 'Psicologia', 'Enfermagem', 'Estomaterapia', 'Servico Social'
    ],
    regiao: 'RMR',
  },
  {
    id: 'upae-r',
    nome: 'UPAE-R (Recife)',
    municipio: 'Recife',
    endereco: 'R. Interna, 801 - Ipsep, Recife - PE, 51350-351',
    especialidades: [
      'Geriatria', 'Reumatologia', 'Angiologia',
      'Fisioterapia', 'Terapia Ocupacional', 'Fonoaudiologia', 'Nutricao',
      'Psicologia', 'Educacao Fisica'
    ],
    regiao: 'RMR',
  },
]

// regras de especialidades por sexo e idade
export const REGRAS_ESPECIALIDADES = {
  // restricoes de sexo
  'Colposcopia': { sexo: 'feminino', minIdade: 12 },
  'Ginecologia': { sexo: 'feminino', minIdade: 10 },
  'Mastologia': { sexo: 'ambos', minIdade: 10 },

  // restricoes de idade (criancas)
  'Pediatria': { sexo: 'ambos', maxIdade: 13 },
  'Endocrinologia Infantil': { sexo: 'ambos', maxIdade: 13 },
  'Neuropediatria': { sexo: 'ambos', maxIdade: 13 },
  'Psiquiatria Infantil': { sexo: 'ambos', maxIdade: 13 },
  'Psicopedagogia': { sexo: 'ambos', maxIdade: 13 },

  // restricoes de idade (idosos)
  'Geriatria': { sexo: 'ambos', minIdade: 60 },

  // especialidades sem restricao
  'Alergologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Anestesiologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Angiologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Cardiologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Cirurgia Geral': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Dermatologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Endocrinologia': { sexo: 'ambos', minIdade: 14, maxIdade: 150 },
  'Endoscopia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Gastroenterologia': { sexo: 'ambos', minIdade: 14, maxIdade: 150 },
  'Gastroenterologia Clinica': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Infectologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Nefrologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Neurologia': { sexo: 'ambos', minIdade: 14, maxIdade: 150 },
  'Neurologia Clinica': { sexo: 'ambos', minIdade: 14, maxIdade: 150 },
  'Oftalmologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Ortopedia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Otorrinolaringologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Pneumologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Psiquiatria': { sexo: 'ambos', minIdade: 14, maxIdade: 150 },
  'Radiologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Reumatologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Urologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },

  // equipe multidisciplinar
  'Nutricao': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Psicologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Fisioterapia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Fonoaudiologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Terapia Ocupacional': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Enfermagem': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Servico Social': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Farmacia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Estomaterapia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Educacao Fisica': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
  'Odontologia': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },

  // fallback padrao
  'default': { sexo: 'ambos', minIdade: 0, maxIdade: 150 },
}

// condicoes clinicas por especialidade
export const CONDICOES_POR_ESPECIALIDADE = {
  'Alergologia': [
    'Rinite alergica',
    'Asma alergica',
    'Dermatite atopica',
    'Urticaria',
    'Alergia alimentar',
    'Outro (especifique)'
  ],
  'Angiologia': [
    'Varizes',
    'Trombose venosa',
    'Insuficiencia venosa',
    'Doenca arterial periferica',
    'Aneurisma',
    'Outro (especifique)'
  ],
  'Cardiologia': [
    'Hipertensao arterial',
    'Insuficiencia cardiaca',
    'Arritmia cardiaca',
    'Doenca coronariana',
    'Valvulopatia',
    'Cardiomiopatia',
    'Avaliacao pre-operatoria',
    'Outro (especifique)'
  ],
  'Cirurgia Geral': [
    'Hernia',
    'Calculo biliar (vesicula)',
    'Apendicite',
    'Avaliacao de nodulo/tumor',
    'Hemorroida',
    'Fissura anal',
    'Outro (especifique)'
  ],
  'Colposcopia': [
    'Papanicolau alterado',
    'Lesao no colo do utero',
    'HPV',
    'Biopsia de colo uterino',
    'Outro (especifique)'
  ],
  'Dermatologia': [
    'Acne',
    'Psoriase',
    'Dermatite',
    'Micose',
    'Vitiligo',
    'Queda de cabelo',
    'Lesao de pele (avaliacao)',
    'Outro (especifique)'
  ],
  'Endocrinologia': [
    'Diabetes mellitus',
    'Obesidade/Controle de peso',
    'Disfuncao tireoidiana',
    'Hipertensao secundaria',
    'Osteoporose',
    'Colesterol alto',
    'Outro (especifique)'
  ],
  'Endocrinologia Infantil': [
    'Diabetes infantil',
    'Obesidade infantil',
    'Baixa estatura',
    'Puberdade precoce',
    'Problemas de tireoide',
    'Outro (especifique)'
  ],
  'Gastroenterologia': [
    'Refluxo gastroesofagico',
    'Gastrite/ulcera',
    'Doenca inflamatoria intestinal',
    'Sindrome do intestino irritavel',
    'Cirrose hepatica',
    'Hepatite',
    'Outro (especifique)'
  ],
  'Geriatria': [
    'Avaliacao geriatrica ampla',
    'Quedas frequentes',
    'Demencia/Alzheimer',
    'Polifarmacia',
    'Fragilidade',
    'Outro (especifique)'
  ],
  'Ginecologia': [
    'Mioma uterino',
    'Endometriose',
    'Sindrome dos ovarios policisticos',
    'Sangramento uterino anormal',
    'Menopausa',
    'Cisto de ovario',
    'Outro (especifique)'
  ],
  'Neurologia': [
    'Epilepsia',
    'Cefaleia/Enxaqueca',
    'AVC/Sequela de AVC',
    'Doenca de Parkinson',
    'Esclerose multipla',
    'Neuropatia periferica',
    'Outro (especifique)'
  ],
  'Oftalmologia': [
    'Catarata',
    'Glaucoma',
    'Erro de refracao (oculos)',
    'Degeneracao macular',
    'Retinopatia diabetica',
    'Outro (especifique)'
  ],
  'Ortopedia': [
    'Artrose',
    'Hernia de disco',
    'Tendinite',
    'Fratura (acompanhamento)',
    'Dor lombar cronica',
    'Lesao de menisco/ligamento',
    'Outro (especifique)'
  ],
  'Pediatria': [
    'Acompanhamento de puericultura',
    'Asma infantil',
    'Alergia',
    'Infeccao recorrente',
    'Outro (especifique)'
  ],
  'Pneumologia': [
    'Asma',
    'DPOC (Doenca Pulmonar Obstrutiva Cronica)',
    'Fibrose pulmonar',
    'Apneia do sono',
    'Tuberculose',
    'Outro (especifique)'
  ],
  'Psiquiatria': [
    'Depressao',
    'Ansiedade/Transtorno de ansiedade',
    'Transtorno bipolar',
    'Esquizofrenia',
    'TOC (Transtorno Obsessivo-Compulsivo)',
    'TDAH (adulto)',
    'Outro (especifique)'
  ],
  'Reumatologia': [
    'Artrite reumatoide',
    'Lupus eritematoso sistemico',
    'Fibromialgia',
    'Osteoartrite',
    'Gota',
    'Espondilite anquilosante',
    'Outro (especifique)'
  ],
  'Urologia': [
    'Hiperplasia prostatica benigna',
    'Calculo urinario (pedra)',
    'Incontinencia urinaria',
    'Infeccao urinaria recorrente',
    'Disfuncao eretil',
    'Outro (especifique)'
  ],
  'Nutricao': [
    'Obesidade/Emagrecimento',
    'Diabetes (orientacao nutricional)',
    'Hipertensao (orientacao nutricional)',
    'Disturbio alimentar',
    'Desnutricao',
    'Dislipidemia (colesterol/triglicerides)',
    'Outro (especifique)'
  ],
  'Psicologia': [
    'Depressao',
    'Ansiedade',
    'Trauma/TEPT',
    'Luto',
    'Relacionamento familiar/conjugal',
    'Autoestima',
    'Outro (especifique)'
  ],
  'Fisioterapia': [
    'Reabilitacao pos-cirurgica',
    'Dor lombar',
    'AVC (reabilitacao)',
    'Lesao esportiva',
    'Artrose',
    'Outro (especifique)'
  ],
  'default': ['Outro (especifique)']
}
