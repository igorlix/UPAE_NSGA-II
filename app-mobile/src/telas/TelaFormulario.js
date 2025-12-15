import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useAutenticacao } from '../contextos/ContextoAutenticacao'
import { useResultado } from '../contextos/ContextoResultado'
import CampoTexto from '../componentes/CampoTexto'
import Botao from '../componentes/Botao'
import Seletor from '../componentes/Seletor'
import Toast, { useToast } from '../componentes/Toast'
import ContainerResponsivo from '../componentes/ContainerResponsivo'
import { cores } from '../configuracao/cores'
import { MUNICIPIOS, GENEROS, NIVEIS_URGENCIA, ESPECIALIDADES_NAO_MEDICAS } from '../configuracao/constantes'
import { UPAES, REGRAS_ESPECIALIDADES, CONDICOES_POR_ESPECIALIDADE } from '../configuracao/upaes'
import { validarCpf, validarNome } from '../utilitarios/validadores'
import { formatarCpfDigitacao } from '../utilitarios/formatadores'
import { buscarCep, geocodificarEndereco, executarOtimizacao } from '../servicos/apiOtimizador'

// componente cabecalho de secao
const CabecalhoSecao = ({ numero, titulo, icone }) => (
  <View style={estilos.cabecalhoSecao}>
    <View style={estilos.numeroSecao}>
      <Ionicons name={icone} size={14} color={cores.branco} />
    </View>
    <Text style={estilos.tituloSecao}>{titulo}</Text>
  </View>
)

// componente checkbox customizado
const Checkbox = ({ valor, aoMudar, rotulo, descricao }) => (
  <TouchableOpacity
    style={[estilos.checkboxContainer, valor && estilos.checkboxAtivo]}
    onPress={() => aoMudar(!valor)}
    activeOpacity={0.7}
  >
    <View style={[estilos.checkboxBox, valor && estilos.checkboxBoxAtivo]}>
      {valor && <Ionicons name="checkmark" size={14} color={cores.branco} />}
    </View>
    <View style={estilos.checkboxTextos}>
      <Text style={[estilos.checkboxRotulo, valor && estilos.checkboxRotuloAtivo]}>{rotulo}</Text>
      {descricao && <Text style={estilos.checkboxDescricao}>{descricao}</Text>}
    </View>
  </TouchableOpacity>
)

// componente seletor de urgencia visual com cores
const SeletorUrgencia = ({ valor, aoMudar, erro }) => (
  <View style={estilos.urgenciaContainer}>
    <Text style={estilos.urgenciaRotulo}>
      Nivel de Urgencia
      <Text style={estilos.obrigatorio}> *</Text>
    </Text>
    <View style={estilos.urgenciaOpcoes}>
      {NIVEIS_URGENCIA.map((nivel) => {
        const selecionado = valor === nivel.valor
        return (
          <TouchableOpacity
            key={nivel.valor}
            style={[
              estilos.urgenciaOpcao,
              selecionado && estilos.urgenciaOpcaoSelecionada,
            ]}
            onPress={() => aoMudar(nivel.valor)}
            activeOpacity={0.7}
          >
            <View style={[estilos.urgenciaBarra, { backgroundColor: nivel.cor }]} />
            <View style={estilos.urgenciaConteudo}>
              <View style={estilos.urgenciaCabecalho}>
                <View style={[estilos.urgenciaBolinha, { backgroundColor: nivel.cor }]} />
                <Text style={[
                  estilos.urgenciaTexto,
                  selecionado && estilos.urgenciaTextoSelecionado,
                ]}>
                  {nivel.rotulo}
                </Text>
              </View>
              <Text style={estilos.urgenciaDescricao}>{nivel.descricao}</Text>
            </View>
            {selecionado && (
              <Ionicons name="checkmark-circle" size={20} color={nivel.cor} />
            )}
          </TouchableOpacity>
        )
      })}
    </View>
    {erro && <Text style={estilos.textoErro}>{erro}</Text>}
  </View>
)

// tela do formulario principal
const TelaFormulario = ({ navigation }) => {
  const { fazerLogout } = useAutenticacao()
  const { salvarResultado } = useResultado()
  const { toast, mostrarToast, fecharToast } = useToast()

  // estados do formulario - dados pessoais
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [genero, setGenero] = useState('')
  const [idade, setIdade] = useState('')

  // estados do formulario - dados da solicitacao
  const [municipio, setMunicipio] = useState('')
  const [especialidade, setEspecialidade] = useState('')
  const [endereco, setEndereco] = useState('')

  // estados do formulario - informacoes clinicas
  const [nivelUrgencia, setNivelUrgencia] = useState('')
  const [condicao, setCondicao] = useState('')
  const [condicaoOutra, setCondicaoOutra] = useState('')
  const [tfdElegivel, setTfdElegivel] = useState(false)
  const [gestante, setGestante] = useState(false)
  const [deficiencia, setDeficiencia] = useState(false)

  // estados de controle
  const [carregando, setCarregando] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [erros, setErros] = useState({})

  // filtra especialidades baseado em genero e idade
  const especialidadesFiltradas = useMemo(() => {
    if (!genero || !idade || isNaN(parseInt(idade))) {
      return []
    }

    const idadeNum = parseInt(idade)
    const todasEspecialidades = new Set()
    UPAES.forEach(upae => {
      upae.especialidades.forEach(esp => todasEspecialidades.add(esp))
    })

    const listaOrdenada = Array.from(todasEspecialidades).sort()

    // normaliza genero para filtros medicos
    let sexoNormalizado = 'ambos'
    if (genero === 'homem-cis' || genero === 'homem-trans') {
      sexoNormalizado = 'masculino'
    } else if (genero === 'mulher-cis' || genero === 'mulher-trans') {
      sexoNormalizado = 'feminino'
    }

    // filtra baseado nas regras
    const permitidas = listaOrdenada.filter(esp => {
      const regra = REGRAS_ESPECIALIDADES[esp] || REGRAS_ESPECIALIDADES['default']

      if (regra.sexo !== 'ambos' && regra.sexo !== sexoNormalizado) {
        return false
      }
      if (regra.minIdade && idadeNum < regra.minIdade) {
        return false
      }
      if (regra.maxIdade && idadeNum > regra.maxIdade) {
        return false
      }
      return true
    })

    // separa em grupos
    const medicas = permitidas.filter(esp => !ESPECIALIDADES_NAO_MEDICAS.has(esp))
    const naoMedicas = permitidas.filter(esp => ESPECIALIDADES_NAO_MEDICAS.has(esp))

    const opcoes = []
    if (medicas.length > 0) {
      opcoes.push({ valor: '', rotulo: 'Especialidades Medicas ', desabilitado: true })
      medicas.forEach(esp => opcoes.push({ valor: esp, rotulo: esp }))
    }
    if (naoMedicas.length > 0) {
      opcoes.push({ valor: '', rotulo: ' Equipe Multidisciplinar ', desabilitado: true })
      naoMedicas.forEach(esp => opcoes.push({ valor: esp, rotulo: esp }))
    }

    return opcoes
  }, [genero, idade])

  // filtra condicoes baseado na especialidade
  const condicoesFiltradas = useMemo(() => {
    if (!especialidade) return []
    const lista = CONDICOES_POR_ESPECIALIDADE[especialidade] || CONDICOES_POR_ESPECIALIDADE['default'] || []
    return lista.map(c => ({ valor: c, rotulo: c }))
  }, [especialidade])

  // reseta condicao quando especialidade muda
  useEffect(() => {
    setCondicao('')
    setCondicaoOutra('')
  }, [especialidade])

  // handler para mudanca de genero - reseta campos dependentes
  const handleGeneroChange = (novoGenero) => {
    setGenero(novoGenero)
    setEspecialidade('')
    setCondicao('')
    if (novoGenero === 'homem-cis') {
      setGestante(false)
    }
  }

  // handler para mudanca de idade - reseta campos dependentes
  const handleIdadeChange = (novaIdade) => {
    setIdade(novaIdade)
    setEspecialidade('')
    setCondicao('')
  }

  // busca CEP automaticamente
  const handleEnderecoChange = async (valor) => {
    setEndereco(valor)
    const cepLimpo = valor.replace(/\D/g, '')

    if (cepLimpo.length === 8) {
      setBuscandoCep(true)
      try {
        const dados = await buscarCep(cepLimpo)
        if (dados) {
          setEndereco(`${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`)
          mostrarToast('Endereco encontrado!', 'sucesso')
        }
      } catch (erro) {
        mostrarToast('CEP nao encontrado', 'erro')
      } finally {
        setBuscandoCep(false)
      }
    }
  }

  // valida formulario
  const validarFormulario = () => {
    const novosErros = {}

    if (!validarNome(nome)) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres'
    }
    if (!validarCpf(cpf)) {
      novosErros.cpf = 'CPF invalido'
    }
    if (!genero) {
      novosErros.genero = 'Selecione o genero'
    }
    if (!idade || parseInt(idade) < 0 || parseInt(idade) > 150) {
      novosErros.idade = 'Idade invalida'
    }
    if (!municipio) {
      novosErros.municipio = 'Selecione o municipio'
    }
    if (!especialidade) {
      novosErros.especialidade = 'Selecione a especialidade'
    }
    if (!endereco || endereco.length < 5) {
      novosErros.endereco = 'Endereco obrigatorio'
    }
    if (!nivelUrgencia) {
      novosErros.nivelUrgencia = 'Selecione o nivel de urgencia'
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // envia formulario
  const handleSubmit = async () => {
    if (!validarFormulario()) {
      mostrarToast('Preencha todos os campos corretamente', 'erro')
      return
    }

    setCarregando(true)

    try {
      // determina condicao final (opcional - se vazio usa "Nao especificado")
      let condicaoFinal = 'Nao especificado'
      if (condicao && condicao !== 'Outro (especifique)') {
        condicaoFinal = condicao
      } else if (condicao === 'Outro (especifique)' && condicaoOutra.trim()) {
        condicaoFinal = condicaoOutra.trim()
      }

      const dadosFormulario = {
        nome: nome.trim(),
        cpf: cpf,
        sexo: genero,
        idade: parseInt(idade),
        especialidade: especialidade,
        municipio: municipio,
        endereco: endereco.trim(),
        severity_level: nivelUrgencia,
        condition_description: condicaoFinal,
        tfd_eligible: tfdElegivel,
        gestante: gestante,
        deficiencia: deficiencia,
        dataEnvio: new Date().toISOString(),
      }

      // geocodifica endereco do paciente
      const coordsPaciente = await geocodificarEndereco(endereco)

      // busca UPAEs compativeis
      const upaesFiltradas = UPAES
        .filter(u => u.especialidades.includes(especialidade))
        .map(u => ({
          id: u.id,
          unidade: u.nome,
          nome: u.nome,
          municipio: u.municipio,
          endereco: u.endereco,
          especialidade: especialidade,
          tempoEsperaDias: Math.floor(Math.random() * 15),
          vagasDisponiveis: 5,
        }))

      if (upaesFiltradas.length === 0) {
        throw new Error('Nenhuma unidade encontrada para esta especialidade')
      }

      // geocodifica UPAEs
      for (const upae of upaesFiltradas) {
        const coords = await geocodificarEndereco(upae.endereco)
        upae.lat = coords.lat
        upae.lon = coords.lng
      }

      // cria objeto paciente
      const paciente = {
        id: 'pac-' + Date.now(),
        ...dadosFormulario,
        lat: coordsPaciente.lat,
        lon: coordsPaciente.lng,
        urgente: nivelUrgencia === 'vermelho',
      }

      // executa otimizacao
      const resultado = await executarOtimizacao(paciente, upaesFiltradas)

      if (!resultado.sucesso) {
        throw new Error('Nao foi possivel alocar o paciente')
      }

      // salva resultado e navega
      salvarResultado(resultado)
      navigation.navigate('Resultado')

    } catch (erro) {
      console.error('Erro ao processar:', erro)
      mostrarToast(erro.message || 'Erro ao processar solicitacao', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  // opcoes para seletores
  const opcoesMunicipios = MUNICIPIOS.map(m => ({ valor: m.valor, rotulo: m.rotulo }))
  const opcoesGeneros = GENEROS.map(g => ({ valor: g.valor, rotulo: g.rotulo }))

  return (
    <LinearGradient
      colors={[cores.gradienteInicio, cores.gradienteFim]}
      style={estilos.container}
    >
      <SafeAreaView style={estilos.safeArea}>
        <ContainerResponsivo>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={estilos.keyboardView}
          >
            <ScrollView
              contentContainerStyle={estilos.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
            {/* cartao principal */}
            <View style={estilos.cartaoPrincipal}>
              {/* cabecalho */}
              <View style={estilos.cabecalho}>
                <View style={estilos.cabecalhoEsquerda}>
                  <Image
                    source={require('../../assets/imagens/logo-upae.png')}
                    style={estilos.logo}
                    resizeMode="contain"
                  />
                  <View>
                    <Text style={estilos.tituloPrincipal}>Agendamento</Text>
                    <Text style={estilos.subtituloCabecalho}>Sistema de Regulacao UPAE</Text>
                  </View>
                </View>
                <TouchableOpacity style={estilos.botaoSair} onPress={fazerLogout}>
                  <Ionicons name="log-out-outline" size={20} color={cores.erro} />
                </TouchableOpacity>
              </View>

              {/* secao 1: dados pessoais */}
              <View style={estilos.secao}>
                <CabecalhoSecao numero="1" titulo="Dados Pessoais" icone="person" />

                <CampoTexto
                  rotulo="Nome Completo"
                  valor={nome}
                  aoMudar={setNome}
                  placeholder="Digite seu nome completo"
                  icone="person-outline"
                  erro={erros.nome}
                  obrigatorio
                />

                <View style={estilos.linhaFormulario}>
                  <View style={estilos.colunaFormulario}>
                    <CampoTexto
                      rotulo="CPF"
                      valor={cpf}
                      aoMudar={(v) => setCpf(formatarCpfDigitacao(v))}
                      placeholder="000.000.000-00"
                      icone="card-outline"
                      tipo="cpf"
                      erro={erros.cpf}
                      obrigatorio
                    />
                  </View>
                  <View style={estilos.colunaFormularioMenor}>
                    <CampoTexto
                      rotulo="Idade"
                      valor={idade}
                      aoMudar={handleIdadeChange}
                      placeholder="Anos"
                      tipo="numerico"
                      erro={erros.idade}
                      obrigatorio
                    />
                  </View>
                </View>

                <Seletor
                  rotulo="Genero"
                  valor={genero}
                  aoMudar={handleGeneroChange}
                  opcoes={opcoesGeneros}
                  placeholder="Selecione o genero"
                  erro={erros.genero}
                  obrigatorio
                />
              </View>

              {/* secao 2: dados da solicitacao */}
              <View style={estilos.secao}>
                <CabecalhoSecao numero="2" titulo="Dados da Solicitacao" icone="document-text" />

                <Seletor
                  rotulo="Municipio de Residencia"
                  valor={municipio}
                  aoMudar={setMunicipio}
                  opcoes={opcoesMunicipios}
                  placeholder="Selecione seu municipio"
                  erro={erros.municipio}
                  obrigatorio
                />

                <Seletor
                  rotulo="Especialidade Desejada"
                  valor={especialidade}
                  aoMudar={setEspecialidade}
                  opcoes={especialidadesFiltradas}
                  placeholder={genero && idade ? "Selecione a especialidade" : "Preencha genero e idade primeiro"}
                  desabilitado={!genero || !idade}
                  erro={erros.especialidade}
                  obrigatorio
                  comBusca
                />
                {genero && idade && especialidadesFiltradas.length > 0 && (
                  <View style={estilos.dicaContainer}>
                    <Ionicons name="information-circle-outline" size={14} color={cores.primaria} />
                    <Text style={estilos.dicaCampo}>
                      Lista filtrada com base no perfil do paciente
                    </Text>
                  </View>
                )}

                <CampoTexto
                  rotulo="Endereco ou CEP"
                  valor={endereco}
                  aoMudar={handleEnderecoChange}
                  placeholder="Digite seu endereco ou CEP"
                  icone="location-outline"
                  erro={erros.endereco}
                  obrigatorio
                  carregando={buscandoCep}
                />
              </View>

              {/* secao 3: informacoes clinicas */}
              <View style={estilos.secao}>
                <CabecalhoSecao numero="3" titulo="Informacoes Clinicas" icone="medical" />

                <SeletorUrgencia
                  valor={nivelUrgencia}
                  aoMudar={setNivelUrgencia}
                  erro={erros.nivelUrgencia}
                />

                {especialidade && condicoesFiltradas.length > 0 && (
                  <View style={estilos.motivoContainer}>
                    <Seletor
                      rotulo="Motivo da Consulta (opcional)"
                      valor={condicao}
                      aoMudar={setCondicao}
                      opcoes={condicoesFiltradas}
                      placeholder="Selecione ou deixe em branco"
                      permitirLimpar
                    />
                    {condicao === 'Outro (especifique)' && (
                      <CampoTexto
                        rotulo="Especifique o motivo"
                        valor={condicaoOutra}
                        aoMudar={setCondicaoOutra}
                        placeholder="Descreva o motivo"
                      />
                    )}
                  </View>
                )}

                <View style={estilos.condicoesEspeciais}>
                  <Text style={estilos.condicoesLabel}>Condicoes Especiais</Text>

                  <Checkbox
                    valor={tfdElegivel}
                    aoMudar={setTfdElegivel}
                    rotulo="Elegivel para TFD"
                    descricao="Tratamento Fora de Domicilio"
                  />

                  <View style={estilos.linhaCheckboxes}>
                    {genero !== 'homem-cis' && (
                      <View style={estilos.checkboxMetade}>
                        <Checkbox
                          valor={gestante}
                          aoMudar={setGestante}
                          rotulo="Gestante"
                        />
                      </View>
                    )}
                    <View style={genero !== 'homem-cis' ? estilos.checkboxMetade : estilos.checkboxInteiro}>
                      <Checkbox
                        valor={deficiencia}
                        aoMudar={setDeficiencia}
                        rotulo="Pessoa com Deficiencia"
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* botao enviar */}
              <View style={estilos.containerBotao}>
                <Botao
                  titulo="Buscar Melhor Unidade"
                  aoClicar={handleSubmit}
                  carregando={carregando}
                  larguraTotal
                  tamanho="grande"
                  icone={<Ionicons name="search" size={20} color={cores.branco} />}
                />
                <Text style={estilos.textoRodape}>
                  O sistema encontrara a unidade ideal para voce
                </Text>
              </View>
            </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ContainerResponsivo>

        <Toast
          visivel={toast.visivel}
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          aoFechar={fecharToast}
        />
      </SafeAreaView>
    </LinearGradient>
  )
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  cartaoPrincipal: {
    backgroundColor: cores.branco,
    borderRadius: 20,
    padding: 24,
    shadowColor: cores.preto,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: cores.cinzaClaro,
  },
  cabecalhoEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  tituloPrincipal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
  },
  subtituloCabecalho: {
    fontSize: 12,
    color: cores.cinza,
    marginTop: 2,
  },
  botaoSair: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.erroClara,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secao: {
    marginBottom: 28,
  },
  cabecalhoSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  numeroSecao: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.cinzaEscuro,
    letterSpacing: 0.3,
  },
  linhaFormulario: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  colunaFormulario: {
    flex: 2,
    paddingHorizontal: 6,
  },
  colunaFormularioMenor: {
    flex: 1,
    paddingHorizontal: 6,
  },
  dicaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dicaCampo: {
    fontSize: 12,
    color: cores.primaria,
    marginLeft: 6,
  },
  urgenciaContainer: {
    marginBottom: 20,
  },
  urgenciaRotulo: {
    fontSize: 14,
    fontWeight: '500',
    color: cores.cinzaEscuro,
    marginBottom: 12,
  },
  obrigatorio: {
    color: cores.erro,
  },
  textoErro: {
    fontSize: 12,
    color: cores.erro,
    marginTop: 8,
  },
  urgenciaOpcoes: {
    gap: 8,
  },
  urgenciaOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.cinzaMedio,
    borderRadius: 10,
    overflow: 'hidden',
  },
  urgenciaOpcaoSelecionada: {
    borderColor: cores.primaria,
    backgroundColor: cores.primariaFundo,
  },
  urgenciaBarra: {
    width: 4,
    alignSelf: 'stretch',
  },
  urgenciaConteudo: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  urgenciaCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  urgenciaBolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  urgenciaTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.cinzaEscuro,
  },
  urgenciaTextoSelecionado: {
    color: cores.primaria,
  },
  urgenciaDescricao: {
    fontSize: 12,
    color: cores.cinza,
    marginLeft: 18,
  },
  motivoContainer: {
    marginBottom: 8,
  },
  condicoesEspeciais: {
    backgroundColor: cores.cinzaClaro,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  condicoesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.cinzaEscuro,
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.cinzaMedio,
  },
  checkboxAtivo: {
    borderColor: cores.primaria,
    backgroundColor: cores.primariaClara,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: cores.cinzaMedio,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.branco,
  },
  checkboxBoxAtivo: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  checkboxTextos: {
    marginLeft: 12,
    flex: 1,
  },
  checkboxRotulo: {
    fontSize: 14,
    color: cores.cinzaEscuro,
    fontWeight: '500',
  },
  checkboxRotuloAtivo: {
    color: cores.primaria,
  },
  checkboxDescricao: {
    fontSize: 11,
    color: cores.cinza,
    marginTop: 2,
  },
  linhaCheckboxes: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  checkboxMetade: {
    flex: 1,
    paddingHorizontal: 4,
  },
  checkboxInteiro: {
    flex: 1,
  },
  containerBotao: {
    marginTop: 8,
  },
  textoRodape: {
    fontSize: 12,
    color: cores.cinza,
    textAlign: 'center',
    marginTop: 12,
  },
})

export default TelaFormulario
