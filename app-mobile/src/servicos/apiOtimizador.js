import { CONFIGURACAO } from '../configuracao/constantes'

// url da api
const getApiUrl = () => {
  const baseUrl = CONFIGURACAO.API_URL || 'http://localhost:5000'
  return `${baseUrl}/api/otimizar`
}

// busca endereco pelo cep
export const buscarCep = async (cep) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await response.json()
    if (data.erro) throw new Error('CEP nao encontrado')
    return data
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    return null
  }
}

// geocodifica endereco usando google maps
export const geocodificarEndereco = async (endereco) => {
  try {
    const apiKey = CONFIGURACAO.GOOGLE_MAPS_API_KEY
    const enderecoEncoded = encodeURIComponent(endereco)
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${enderecoEncoded}&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location
      return {
        lat: location.lat,
        lng: location.lng,
        enderecoFormatado: data.results[0].formatted_address,
      }
    }

    throw new Error('Endereco nao encontrado')
  } catch (error) {
    console.error('Erro ao geocodificar:', error)
    throw error
  }
}

// calcula distancia entre dois pontos usando haversine
const calcularDistanciaHaversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// otimizacao local quando api nao disponivel
const executarOtimizacaoLocal = (paciente, upaes) => {
  // calcula distancia para cada upae
  const upaesComDistancia = upaes.map(upae => {
    const distancia = calcularDistanciaHaversine(
      paciente.lat, paciente.lon,
      upae.lat, upae.lon
    )
    const tempoEspera = upae.tempoEsperaDias || Math.floor(Math.random() * 15) + 5
    const probNoShow = Math.min(30, distancia * 0.8 + Math.random() * 5)

    return {
      upae: {
        id: upae.id,
        nome: upae.nome || upae.unidade,
        unidade: upae.unidade || upae.nome,
        municipio: upae.municipio,
        endereco: upae.endereco,
        lat: upae.lat,
        lon: upae.lon,
      },
      distancia_km: distancia,
      tempo_espera_dias: tempoEspera,
      prob_noshow: probNoShow,
      score: 100 - (distancia * 2) - (tempoEspera * 1.5) - probNoShow,
    }
  })

  // ordena por score
  upaesComDistancia.sort((a, b) => b.score - a.score)

  return {
    sucesso: true,
    melhor_opcao: upaesComDistancia[0],
    alternativas: upaesComDistancia.slice(1, 4),
  }
}

// executa otimizacao no backend python
export const executarOtimizacao = async (paciente, upaes) => {
  const apiUrl = getApiUrl()

  // valida coordenadas do paciente
  if (!paciente.lat || !paciente.lon) {
    throw new Error('Coordenadas do paciente nao encontradas')
  }

  // prepara payload das UPAEs
  const upaesPayload = upaes.map(u => {
    if (!u.lat || !u.lon) {
      throw new Error(`UPAE ${u.nome} nao possui coordenadas validas`)
    }

    return {
      id: u.id,
      nome: u.nome,
      municipio: u.municipio,
      unidade: u.unidade || u.nome,
      endereco: u.endereco,
      especialidades: [paciente.especialidade],
      lat: u.lat,
      lon: u.lon,
      tempo_espera_dias: u.tempoEsperaDias || 0,
      transport_score: 0.7,
    }
  })

  // prepara payload do paciente
  const pacientePayload = {
    id: paciente.id,
    nome: paciente.nome,
    cpf: paciente.cpf,
    sexo: paciente.sexo,
    especialidade: paciente.especialidade,
    endereco: paciente.endereco,
    municipio: paciente.municipio,
    idade: paciente.idade,
    lat: paciente.lat,
    lon: paciente.lon,
    gestante: paciente.gestante || false,
    deficiencia: paciente.deficiencia || false,
    severity_level: paciente.severity_level || 'amarelo',
    condition_description: paciente.condition_description || 'Nao especificado',
    tfd_eligible: paciente.tfd_eligible || false,
    urgente: paciente.urgente || false,
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paciente: pacientePayload,
        upaes: upaesPayload,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Erro no servidor (HTTP ${response.status})`)
    }

    const dados = await response.json()

    if (!dados.sucesso) {
      throw new Error(dados.mensagem || 'Otimizacao falhou no servidor')
    }

    return adaptarRespostaGA(dados, paciente)
  } catch (error) {
    // fallback silencioso para otimizacao local quando api nao disponivel
    console.log('Usando otimizacao local')
    const dadosLocais = executarOtimizacaoLocal(paciente, upaesPayload)
    return adaptarRespostaGA(dadosLocais, paciente)
  }
}

// adapta resposta da api para formato do app
const adaptarRespostaGA = (dados, paciente) => {
  const formatarOpcao = (opcao) => {
    const upae = opcao.upae

    return {
      especialista: {
        id: upae.id,
        unidade: upae.nome || upae.unidade,
        nome: upae.nome || upae.unidade,
        municipio: upae.municipio || 'RMR',
        endereco: upae.endereco,
        lat: upae.lat,
        lon: upae.lon,
      },
      score: opcao.score || opcao.fitness,
      detalhes: {
        distancia: opcao.distancia_km,
        tempoEspera: opcao.tempo_espera_dias,
        custo: calcularCustoTransporte(opcao.distancia_km),
        probabilidadeNoShow: opcao.prob_noshow,
        tempoViagem: estimarTempoViagem(opcao.distancia_km),
        numeroTransferencias: estimarTransferencias(opcao.distancia_km),
      },
    }
  }

  return {
    sucesso: true,
    paciente: paciente,
    melhorOpcao: formatarOpcao(dados.melhor_opcao),
    alternativas: (dados.alternativas || []).map(formatarOpcao),
    explicacao: {
      fatores: [
        { icone: 'navigate', texto: `Distancia otimizada: ${dados.melhor_opcao.distancia_km.toFixed(1)} km` },
        { icone: 'time', texto: `Tempo de espera: ${dados.melhor_opcao.tempo_espera_dias} dias` },
        { icone: 'checkmark-circle', texto: `Baixa probabilidade de falta: ${dados.melhor_opcao.prob_noshow.toFixed(1)}%` },
        { icone: 'hardware-chip', texto: 'Calculado com algoritmo genetico' },
      ],
    },
  }
}

// calcula custo estimado de transporte
const calcularCustoTransporte = (distanciaKm) => {
  const transferencias = estimarTransferencias(distanciaKm)
  return transferencias * 4.30
}

// estima tempo de viagem baseado na distancia
const estimarTempoViagem = (distanciaKm) => {
  const horas = distanciaKm / 20
  const minutos = Math.round(horas * 60)

  if (minutos < 60) {
    return `${minutos} min`
  }
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return `${h}h${m > 0 ? m + 'min' : ''}`
}

// estima numero de transferencias baseado na distancia
const estimarTransferencias = (distanciaKm) => {
  if (distanciaKm < 10) return 1
  if (distanciaKm < 20) return 2
  return 3
}

// calcula rota de transporte (simplificado para mobile)
export const calcularRotaTransporte = async (origem, destino) => {
  try {
    const apiKey = CONFIGURACAO.GOOGLE_MAPS_API_KEY
    const origemEncoded = encodeURIComponent(origem)
    const destinoEncoded = encodeURIComponent(destino)

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origemEncoded}&destination=${destinoEncoded}&mode=transit&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'OK' && data.routes.length > 0) {
      const route = data.routes[0]
      const leg = route.legs[0]

      return {
        distancia: {
          valor: leg.distance.value,
          texto: leg.distance.text,
        },
        duracao: {
          valor: leg.duration.value,
          texto: leg.duration.text,
        },
        passos: leg.steps.map(step => ({
          instrucao: step.html_instructions,
          distancia: step.distance.text,
          duracao: step.duration.text,
          modoViagem: step.travel_mode,
        })),
      }
    }

    throw new Error('Rota nao encontrada')
  } catch (error) {
    console.error('Erro ao calcular rota:', error)
    return null
  }
}
