// Módulo de Otimização de Alocação de Pacientes
// Utiliza algoritmos de computação natural para otimização

class OtimizadorAlocacao {
  constructor() {
    this.config = APP_CONFIG.OTIMIZACAO;
    this.mapsService = mapsIntegration;
  }

  // Calcular score de uma alocação específica
  async calcularScore(paciente, especialista) {
    try {
      // Obter dados de distância e transporte
      const dadosTransporte = await this.mapsService.estimarCustoTransporte(
        paciente.endereco,
        especialista.endereco
      );

      // Normalizar valores (0-1)
      const distanciaNormalizada = Math.min(
        dadosTransporte.distanciaKm / this.config.MAX_DISTANCIA_KM,
        1
      );

      const tempoEsperaNormalizado = Math.min(
        especialista.tempoEsperaDias / this.config.MAX_TEMPO_ESPERA_DIAS,
        1
      );

      const custoNormalizado = Math.min(
        dadosTransporte.custoTransportePublico / 50, // custo máximo esperado
        1
      );

      // Avaliar disponibilidade de transporte público
      const transporteScore = dadosTransporte.numeroTransferencias <= 1 ? 1 :
                             dadosTransporte.numeroTransferencias === 2 ? 0.7 :
                             0.4;

      // Calcular score ponderado (quanto MENOR, melhor)
      const scoreBase =
        (distanciaNormalizada * this.config.PESO_DISTANCIA) +
        (tempoEsperaNormalizado * this.config.PESO_TEMPO_ESPERA) +
        (custoNormalizado * this.config.PESO_CUSTO) +
        ((1 - transporteScore) * this.config.PESO_TRANSPORTE);

      // Ajustar por prioridade do paciente
      const prioridade = this.calcularPrioridade(paciente);
      const scoreAjustado = scoreBase / prioridade.valor;

      return {
        score: scoreAjustado,
        detalhes: {
          distancia: dadosTransporte.distanciaKm,
          tempoEspera: especialista.tempoEsperaDias,
          custo: dadosTransporte.custoTransportePublico,
          tempoViagem: dadosTransporte.tempoViagem,
          numeroTransferencias: dadosTransporte.numeroTransferencias,
          transporteScore,
          prioridade: prioridade.descricao,
          valorPrioridade: prioridade.valor
        },
        viavel: dadosTransporte.distanciaKm <= this.config.MAX_DISTANCIA_KM &&
                especialista.tempoEsperaDias <= this.config.MAX_TEMPO_ESPERA_DIAS
      };
    } catch (error) {
      console.error('Erro ao calcular score:', error);
      return {
        score: 999, // score muito alto = não viável
        detalhes: { erro: error.message },
        viavel: false
      };
    }
  }

  // Calcular prioridade do paciente
  calcularPrioridade(paciente) {
    const prioridades = APP_CONFIG.PRIORIDADES;

    // Verificar condições especiais
    if (paciente.urgente) return prioridades.URGENTE;
    if (paciente.idade >= 65) return prioridades.IDOSO;
    if (paciente.gestante) return prioridades.GESTANTE;
    if (paciente.idade <= 12) return prioridades.CRIANCA;
    if (paciente.deficiencia) return prioridades.DEFICIENCIA;

    return prioridades.NORMAL;
  }

  // Encontrar melhor alocação para um paciente
  async encontrarMelhorAlocacao(paciente, especialistasDisponiveis) {
    console.log(`Buscando melhor alocação para paciente: ${paciente.nome}`);

    const avaliacoes = [];

    // Avaliar cada especialista disponível
    for (const especialista of especialistasDisponiveis) {
      const avaliacao = await this.calcularScore(paciente, especialista);

      avaliacoes.push({
        especialista,
        ...avaliacao
      });
    }

    // Filtrar apenas alocações viáveis
    const viáveis = avaliacoes.filter(a => a.viavel);

    if (viáveis.length === 0) {
      return {
        sucesso: false,
        mensagem: 'Nenhuma alocação viável encontrada',
        todasAvaliacoes: avaliacoes
      };
    }

    // Ordenar por score (menor = melhor)
    viáveis.sort((a, b) => a.score - b.score);

    // Retornar melhores opções
    return {
      sucesso: true,
      melhorOpcao: viáveis[0],
      alternativas: viáveis.slice(1, 4), // até 3 alternativas
      todasOpcoes: viáveis,
      explicacao: this.gerarExplicacao(paciente, viáveis[0])
    };
  }

  // Gerar explicação transparente da decisão (IA Responsável)
  gerarExplicacao(paciente, alocacao) {
    const detalhes = alocacao.detalhes;
    const especialista = alocacao.especialista;

    const explicacao = {
      titulo: 'Por que esta alocação foi escolhida?',
      resumo: `Esta é a melhor opção considerando distância, custo, tempo de espera e transporte público.`,
      fatores: [],
      comparacao: {},
      transparencia: {
        algoritmo: 'Otimização multiobjetivo com pesos configuráveis',
        criterios: {
          distancia: `${this.config.PESO_DISTANCIA * 100}%`,
          tempoEspera: `${this.config.PESO_TEMPO_ESPERA * 100}%`,
          custo: `${this.config.PESO_CUSTO * 100}%`,
          transporte: `${this.config.PESO_TRANSPORTE * 100}%`
        }
      }
    };

    // Analisar fatores principais
    if (detalhes.distancia < 20) {
      explicacao.fatores.push({
        tipo: 'positivo',
        icone: '✅',
        texto: `Distância muito favorável: apenas ${detalhes.distancia.toFixed(1)}km`
      });
    } else if (detalhes.distancia < 50) {
      explicacao.fatores.push({
        tipo: 'neutro',
        icone: '⚠️',
        texto: `Distância moderada: ${detalhes.distancia.toFixed(1)}km`
      });
    } else {
      explicacao.fatores.push({
        tipo: 'negativo',
        icone: '❌',
        texto: `Distância considerável: ${detalhes.distancia.toFixed(1)}km`
      });
    }

    if (detalhes.tempoEspera <= 7) {
      explicacao.fatores.push({
        tipo: 'positivo',
        icone: '✅',
        texto: `Consulta em até ${detalhes.tempoEspera} dias`
      });
    } else if (detalhes.tempoEspera <= 15) {
      explicacao.fatores.push({
        tipo: 'neutro',
        icone: '⏱️',
        texto: `Tempo de espera: ${detalhes.tempoEspera} dias`
      });
    } else {
      explicacao.fatores.push({
        tipo: 'negativo',
        icone: '⏳',
        texto: `Tempo de espera: ${detalhes.tempoEspera} dias`
      });
    }

    if (detalhes.custo <= 10) {
      explicacao.fatores.push({
        tipo: 'positivo',
        icone: '💰',
        texto: `Custo acessível de transporte: R$ ${detalhes.custo.toFixed(2)}`
      });
    } else {
      explicacao.fatores.push({
        tipo: 'neutro',
        icone: '💵',
        texto: `Custo estimado de transporte: R$ ${detalhes.custo.toFixed(2)}`
      });
    }

    if (detalhes.numeroTransferencias <= 1) {
      explicacao.fatores.push({
        tipo: 'positivo',
        icone: '🚌',
        texto: 'Transporte direto ou com apenas 1 transferência'
      });
    } else {
      explicacao.fatores.push({
        tipo: 'neutro',
        icone: '🔄',
        texto: `${detalhes.numeroTransferencias} transferências necessárias`
      });
    }

    // Prioridade do paciente
    if (detalhes.valorPrioridade > 1) {
      explicacao.fatores.push({
        tipo: 'info',
        icone: '⭐',
        texto: `Paciente com prioridade: ${detalhes.prioridade}`
      });
    }

    // Dados da comparação
    explicacao.comparacao = {
      localConsulta: `${especialista.municipio} - ${especialista.unidade}`,
      especialista: especialista.nome,
      distancia: `${detalhes.distancia.toFixed(1)} km`,
      tempoViagem: detalhes.tempoViagem,
      tempoEspera: `${detalhes.tempoEspera} dias`,
      custoTransportePublico: `R$ ${detalhes.custo.toFixed(2)}`,
      scoreTotal: alocacao.score.toFixed(3)
    };

    return explicacao;
  }

  // Algoritmo Genético para otimização global (múltiplos pacientes)
  async otimizarGlobal(pacientes, especialistas, geracoes = 50, populacao = 30) {
    console.log(`Iniciando otimização global: ${pacientes.length} pacientes, ${especialistas.length} especialistas`);

    // Criar população inicial aleatória
    let populacaoAtual = await this.gerarPopulacaoInicial(pacientes, especialistas, populacao);

    let melhorSolucao = null;
    let historico = [];

    for (let geracao = 0; geracao < geracoes; geracao++) {
      // Avaliar fitness de cada indivíduo
      const populacaoAvaliada = await Promise.all(
        populacaoAtual.map(async individuo => ({
          individuo,
          fitness: await this.calcularFitnessGlobal(individuo)
        }))
      );

      // Ordenar por fitness (menor = melhor)
      populacaoAvaliada.sort((a, b) => a.fitness - b.fitness);

      // Armazenar melhor solução
      if (!melhorSolucao || populacaoAvaliada[0].fitness < melhorSolucao.fitness) {
        melhorSolucao = populacaoAvaliada[0];
      }

      historico.push({
        geracao,
        melhorFitness: populacaoAvaliada[0].fitness,
        mediaFitness: populacaoAvaliada.reduce((sum, p) => sum + p.fitness, 0) / populacaoAvaliada.length
      });

      console.log(`Geração ${geracao}: Melhor fitness = ${populacaoAvaliada[0].fitness.toFixed(3)}`);

      // Seleção, cruzamento e mutação
      populacaoAtual = await this.evoluirPopulacao(populacaoAvaliada, pacientes, especialistas);
    }

    return {
      melhorSolucao: melhorSolucao.individuo,
      fitness: melhorSolucao.fitness,
      historico,
      estatisticas: await this.calcularEstatisticas(melhorSolucao.individuo)
    };
  }

  // Gerar população inicial
  async gerarPopulacaoInicial(pacientes, especialistas, tamanho) {
    const populacao = [];

    for (let i = 0; i < tamanho; i++) {
      const individuo = {};

      for (const paciente of pacientes) {
        // Filtrar especialistas da especialidade correta
        const especialistasEspecialidade = especialistas.filter(
          e => e.especialidade === paciente.especialidade && e.vagasDisponiveis > 0
        );

        if (especialistasEspecialidade.length > 0) {
          // Alocar aleatoriamente
          const indiceAleatorio = Math.floor(Math.random() * especialistasEspecialidade.length);
          individuo[paciente.id] = especialistasEspecialidade[indiceAleatorio].id;
        }
      }

      populacao.push(individuo);
    }

    return populacao;
  }

  // Calcular fitness global de uma solução
  async calcularFitnessGlobal(individuo) {
    let fitnessTotal = 0;
    let penalidades = 0;

    const vagasUsadas = {};

    for (const [pacienteId, especialistaId] of Object.entries(individuo)) {
      // Contar uso de vagas
      vagasUsadas[especialistaId] = (vagasUsadas[especialistaId] || 0) + 1;

      // Adicionar penalidade se exceder vagas (seria validado no backend)
      // fitnessTotal += score da alocação
    }

    return fitnessTotal + penalidades;
  }

  // Evoluir população (seleção, cruzamento, mutação)
  async evoluirPopulacao(populacaoAvaliada, pacientes, especialistas) {
    const novaPopulacao = [];
    const elite = Math.floor(populacaoAvaliada.length * 0.1);

    // Elitismo: manter os melhores
    for (let i = 0; i < elite; i++) {
      novaPopulacao.push(populacaoAvaliada[i].individuo);
    }

    // Gerar resto por cruzamento e mutação
    while (novaPopulacao.length < populacaoAvaliada.length) {
      // Seleção por torneio
      const pai1 = this.selecaoTorneio(populacaoAvaliada);
      const pai2 = this.selecaoTorneio(populacaoAvaliada);

      // Cruzamento
      const filho = this.cruzamento(pai1, pai2, pacientes);

      // Mutação
      if (Math.random() < 0.1) { // 10% de chance
        this.mutacao(filho, especialistas);
      }

      novaPopulacao.push(filho);
    }

    return novaPopulacao;
  }

  // Seleção por torneio
  selecaoTorneio(populacao, tamanhoTorneio = 3) {
    const torneio = [];
    for (let i = 0; i < tamanhoTorneio; i++) {
      const indice = Math.floor(Math.random() * populacao.length);
      torneio.push(populacao[indice]);
    }
    torneio.sort((a, b) => a.fitness - b.fitness);
    return torneio[0].individuo;
  }

  // Cruzamento de dois indivíduos
  cruzamento(pai1, pai2, pacientes) {
    const filho = {};
    const pacienteIds = Object.keys(pai1);

    const pontoCorte = Math.floor(Math.random() * pacienteIds.length);

    for (let i = 0; i < pacienteIds.length; i++) {
      const id = pacienteIds[i];
      filho[id] = i < pontoCorte ? pai1[id] : pai2[id];
    }

    return filho;
  }

  // Mutação aleatória
  mutacao(individuo, especialistas) {
    const pacienteIds = Object.keys(individuo);
    const idAleatorio = pacienteIds[Math.floor(Math.random() * pacienteIds.length)];

    // Trocar por outro especialista aleatório da mesma especialidade
    const especialistaAtual = especialistas.find(e => e.id === individuo[idAleatorio]);
    if (especialistaAtual) {
      const especialistasEspecialidade = especialistas.filter(
        e => e.especialidade === especialistaAtual.especialidade
      );
      const novoEspecialista = especialistasEspecialidade[
        Math.floor(Math.random() * especialistasEspecialidade.length)
      ];
      individuo[idAleatorio] = novoEspecialista.id;
    }
  }

  // Calcular estatísticas da solução
  async calcularEstatisticas(solucao) {
    return {
      totalPacientes: Object.keys(solucao).length,
      distribuicaoPorMunicipio: {},
      distanciaMedia: 0,
      custoMedio: 0
    };
  }
}

// Criar instância global
const otimizador = new OtimizadorAlocacao();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OtimizadorAlocacao;
}
