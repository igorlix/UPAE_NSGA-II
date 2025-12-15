// formata cpf com mascara
export const formatarCpf = (valor) => {
  const numeros = valor.replace(/\D/g, '')

  if (numeros.length <= 3) {
    return numeros
  } else if (numeros.length <= 6) {
    return numeros.replace(/(\d{3})(\d{0,3})/, '$1.$2')
  } else if (numeros.length <= 9) {
    return numeros.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3')
  } else {
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
  }
}

// formata cpf para exibicao (parcialmente oculto)
export const formatarCpfOculto = (cpf) => {
  if (!cpf) return '---'
  return cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/, '$1.***.$3-$4')
}

// alias para formatarCpfOculto
export const formatarCpfParcial = formatarCpfOculto

// formata cpf durante digitacao (mascara progressiva)
export const formatarCpfDigitacao = (valor) => {
  return valor.replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

// formata cep com mascara
export const formatarCep = (valor) => {
  const numeros = valor.replace(/\D/g, '')

  if (numeros.length <= 5) {
    return numeros
  } else {
    return numeros.replace(/(\d{5})(\d{0,3})/, '$1-$2')
  }
}

// formata valor monetario
export const formatarMoeda = (valor) => {
  if (valor === null || valor === undefined) return 'R$ --'

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

// formata distancia em km
export const formatarDistancia = (km) => {
  if (km === null || km === undefined) return '--'
  return `${km.toFixed(1)} km`
}

// formata porcentagem
export const formatarPorcentagem = (valor) => {
  if (valor === null || valor === undefined) return '--%'

  // converte decimal para porcentagem se necessario
  let pct = valor
  if (pct > 0 && pct < 1) {
    pct = pct * 100
  }

  return `${Math.round(pct)}%`
}

// formata data para exibicao
export const formatarData = (data) => {
  if (!data) return '--'

  const d = new Date(data)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// formata hora para exibicao
export const formatarHora = (hora) => {
  if (!hora) return '--:--'

  const d = new Date(hora)
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// capitaliza primeira letra
export const capitalizar = (texto) => {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

// trunca texto com reticencias
export const truncar = (texto, limite) => {
  if (!texto) return ''
  if (texto.length <= limite) return texto
  return texto.substring(0, limite) + '...'
}
