// valida cpf brasileiro
export const validarCpf = (cpf) => {
  // remove caracteres nao numericos
  const numeros = cpf.replace(/\D/g, '')

  // verifica tamanho
  if (numeros.length !== 11) return false

  // verifica se todos os digitos sao iguais
  if (/^(\d)\1{10}$/.test(numeros)) return false

  // calcula primeiro digito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros.charAt(i)) * (10 - i)
  }
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(numeros.charAt(9))) return false

  // calcula segundo digito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros.charAt(i)) * (11 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(numeros.charAt(10))) return false

  return true
}

// valida email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// valida nome (minimo 3 caracteres)
export const validarNome = (nome) => {
  return nome && nome.trim().length >= 3
}

// valida idade (0 a 150)
export const validarIdade = (idade) => {
  const num = parseInt(idade)
  return !isNaN(num) && num >= 0 && num <= 150
}

// valida cep (8 digitos)
export const validarCep = (cep) => {
  const numeros = cep.replace(/\D/g, '')
  return numeros.length === 8
}

// valida se campo esta preenchido
export const validarCampoObrigatorio = (valor) => {
  return valor !== null && valor !== undefined && valor !== ''
}

// valida formulario completo
export const validarFormularioCompleto = (dados) => {
  const erros = {}

  if (!validarNome(dados.nome)) {
    erros.nome = 'Nome deve ter pelo menos 3 caracteres'
  }

  if (!validarCpf(dados.cpf)) {
    erros.cpf = 'CPF invalido'
  }

  if (!validarCampoObrigatorio(dados.genero)) {
    erros.genero = 'Selecione o genero'
  }

  if (!validarIdade(dados.idade)) {
    erros.idade = 'Idade invalida'
  }

  if (!validarCampoObrigatorio(dados.municipio)) {
    erros.municipio = 'Selecione o municipio'
  }

  if (!validarCampoObrigatorio(dados.especialidade)) {
    erros.especialidade = 'Selecione a especialidade'
  }

  if (!validarCampoObrigatorio(dados.endereco)) {
    erros.endereco = 'Informe o endereco ou CEP'
  }

  if (!validarCampoObrigatorio(dados.urgencia)) {
    erros.urgencia = 'Selecione o nivel de urgencia'
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros,
  }
}
