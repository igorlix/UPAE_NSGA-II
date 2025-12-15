import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
  Linking,
  Dimensions,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useResultado } from '../contextos/ContextoResultado'
import Botao from '../componentes/Botao'
import { cores } from '../configuracao/cores'
import { formatarCpfParcial, formatarMoeda } from '../utilitarios/formatadores'

const { width } = Dimensions.get('window')

// componente de metrica
const CartaoMetrica = ({ titulo, valor, subtitulo, cor }) => (
  <View style={estilos.cartaoMetrica}>
    <Text style={estilos.tituloMetrica}>{titulo}</Text>
    <Text style={[estilos.valorMetrica, cor && { color: cor }]}>{valor}</Text>
    {subtitulo && <Text style={estilos.subtituloMetrica}>{subtitulo}</Text>}
  </View>
)

// componente de opcao no menu
const CartaoOpcao = ({ opcao, indice, selecionado, aoSelecionar }) => {
  const isRecomendado = indice === 0
  const esp = opcao.especialista || {}
  const det = opcao.detalhes || {}

  return (
    <TouchableOpacity
      style={[
        estilos.cartaoOpcao,
        selecionado && estilos.cartaoOpcaoSelecionado,
        isRecomendado && !selecionado && estilos.cartaoOpcaoRecomendado,
      ]}
      onPress={aoSelecionar}
    >
      <View style={estilos.cartaoOpcaoConteudo}>
        <View style={estilos.cartaoOpcaoInfo}>
          <View style={estilos.cartaoOpcaoBadgeContainer}>
            <View style={[
              estilos.cartaoOpcaoBadge,
              isRecomendado ? estilos.badgeRecomendado : estilos.badgeAlternativa,
            ]}>
              <Text style={[
                estilos.textoBadge,
                isRecomendado ? estilos.textoBadgeRecomendado : estilos.textoBadgeAlternativa,
              ]}>
                {isRecomendado ? 'Recomendado' : `Opcao ${indice + 1}`}
              </Text>
            </View>
          </View>
          <Text style={estilos.cartaoOpcaoMunicipio}>{esp.municipio || 'Local'}</Text>
          <Text style={estilos.cartaoOpcaoUnidade} numberOfLines={1}>
            {esp.unidade || esp.nome || 'Unidade'}
          </Text>
        </View>
        <View style={estilos.cartaoOpcaoDistancia}>
          <Text style={estilos.textoDistancia}>
            {det.distancia ? `${det.distancia.toFixed(1)} km` : '--'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

// componente de criterio de escolha
const CriterioEscolha = ({ icone, cor, titulo, descricao }) => (
  <View style={estilos.criterio}>
    <View style={[estilos.criterioIcone, { backgroundColor: cor + '20' }]}>
      <Ionicons name={icone} size={16} color={cor} />
    </View>
    <View style={estilos.criterioTexto}>
      <Text style={estilos.criterioTitulo}>{titulo}</Text>
      <Text style={estilos.criterioDescricao}>{descricao}</Text>
    </View>
  </View>
)

// componente modal de sucesso
const ModalSucesso = ({ visivel, aoFechar, aoAbrirWhatsApp, paciente, opcao, protocolo }) => {
  const esp = opcao?.especialista || {}

  return (
    <Modal visible={visivel} transparent animationType="fade">
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalConteudo}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={estilos.modalCabecalho}
          >
            <View style={estilos.iconeSuccesso}>
              <Ionicons name="checkmark" size={40} color="#10b981" />
            </View>
            <Text style={estilos.modalTitulo}>Agendamento Confirmado!</Text>
            <Text style={estilos.modalProtocolo}>Protocolo: {protocolo}</Text>
          </LinearGradient>

          <View style={estilos.modalCorpo}>
            <View style={estilos.detalhesAgendamento}>
              <Text style={estilos.detalhesLabel}>Detalhes do Agendamento:</Text>

              <View style={estilos.detalheItem}>
                <Text style={estilos.detalheRotulo}>Paciente:</Text>
                <Text style={estilos.detalheValor}>{paciente?.nome || 'N/A'}</Text>
              </View>
              <View style={estilos.detalheItem}>
                <Text style={estilos.detalheRotulo}>Especialidade:</Text>
                <Text style={[estilos.detalheValor, { color: cores.primaria }]}>
                  {paciente?.especialidade || 'N/A'}
                </Text>
              </View>
              <View style={estilos.detalheItem}>
                <Text style={estilos.detalheRotulo}>Local:</Text>
                <Text style={estilos.detalheValor}>{esp.municipio || 'UPAE'}</Text>
              </View>
              <View style={estilos.detalheItem}>
                <Text style={estilos.detalheRotulo}>Data Prevista:</Text>
                <Text style={[estilos.detalheValor, { color: cores.sucesso }]}>
                  {opcao?.dataAgendamento || 'A confirmar'}
                </Text>
              </View>
            </View>

            <Text style={estilos.textoSms}>
              Enviamos os detalhes por SMS. Voce tambem pode compartilhar via WhatsApp!
            </Text>

            <View style={estilos.botoesModal}>
              <TouchableOpacity style={estilos.botaoFechar} onPress={aoFechar}>
                <Text style={estilos.textoBotaoFechar}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={estilos.botaoWhatsApp} onPress={aoAbrirWhatsApp}>
                <Ionicons name="logo-whatsapp" size={20} color={cores.branco} />
                <Text style={estilos.textoBotaoWhatsApp}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// componente modal whatsapp simulado
const ModalWhatsApp = ({ visivel, aoFechar, paciente, opcao, protocolo }) => {
  const esp = opcao?.especialista || {}
  const det = opcao?.detalhes || {}

  return (
    <Modal visible={visivel} transparent animationType="fade">
      <View style={estilos.modalOverlay}>
        <View style={estilos.whatsappContainer}>
          {/* cabecalho whatsapp */}
          <View style={estilos.whatsappCabecalho}>
            <TouchableOpacity onPress={aoFechar} style={estilos.whatsappBotaoVoltar}>
              <Ionicons name="arrow-back" size={24} color={cores.branco} />
            </TouchableOpacity>
            <View style={estilos.whatsappAvatar}>
              <Text style={estilos.whatsappAvatarTexto}>U</Text>
            </View>
            <View style={estilos.whatsappInfo}>
              <Text style={estilos.whatsappNome}>UPAE {esp.municipio || 'Saude'}</Text>
              <Text style={estilos.whatsappStatus}>Sistema de Regulacao</Text>
            </View>
          </View>

          {/* corpo do chat */}
          <ScrollView style={estilos.whatsappChat}>
            {/* aviso de simulacao */}
            <View style={estilos.avisoSimulacao}>
              <Ionicons name="information-circle" size={14} color="#f59e0b" />
              <Text style={estilos.avisoSimulacaoTexto}>
                Esta e uma simulacao de mensagem WhatsApp
              </Text>
            </View>

            {/* saudacao */}
            <View style={estilos.mensagemRecebida}>
              <Text style={estilos.mensagemTexto}>Ola, {paciente?.nome}! </Text>
              <Text style={estilos.mensagemHora}>10:20</Text>
            </View>

            {/* pedido de confirmacao */}
            <View style={estilos.mensagemRecebida}>
              <Text style={estilos.mensagemTexto}>
                Voce solicitou um agendamento para{' '}
                <Text style={{ fontWeight: 'bold' }}>{paciente?.especialidade || 'consulta'}</Text>.
              </Text>
              <Text style={estilos.mensagemTexto}>
                Confirma o agendamento na UPAE de{' '}
                <Text style={{ fontWeight: 'bold' }}>{esp.municipio || 'sua regiao'}</Text>?
              </Text>
              <Text style={estilos.mensagemHora}>10:21</Text>
            </View>

            {/* botoes simulados */}
            <View style={estilos.mensagemRecebida}>
              <View style={estilos.botoesConfirmacao}>
                <View style={estilos.botaoConfirmar}>
                  <Text style={estilos.textoBotaoConfirmar}>Sim, confirmar</Text>
                </View>
                <View style={estilos.botaoCancelar}>
                  <Text style={estilos.textoBotaoCancelar}>Nao, cancelar</Text>
                </View>
              </View>
              <Text style={estilos.mensagemHora}>10:21</Text>
            </View>

            {/* resposta do paciente */}
            <View style={estilos.mensagemEnviada}>
              <Text style={estilos.mensagemTexto}>Sim, confirmar</Text>
              <Text style={estilos.mensagemHoraEnviada}>10:22</Text>
            </View>

            {/* confirmacao */}
            <View style={estilos.mensagemRecebida}>
              <Text style={estilos.mensagemTexto}>
                Otimo! Seu agendamento foi confirmado com sucesso!
              </Text>
              <Text style={estilos.mensagemHora}>10:23</Text>
            </View>

            {/* card de detalhes */}
            <View style={estilos.cardAgendamento}>
              <View style={estilos.cardCabecalho}>
                <View style={estilos.cardIcone}>
                  <Ionicons name="checkmark-circle" size={24} color={cores.sucesso} />
                </View>
                <View>
                  <Text style={estilos.cardTitulo}>Consulta Agendada</Text>
                  <Text style={estilos.cardProtocolo}>Protocolo: {protocolo}</Text>
                </View>
              </View>

              <View style={estilos.cardDetalhes}>
                <View style={estilos.cardDetalheItem}>
                  <Text style={estilos.cardDetalheRotulo}>Especialidade:</Text>
                  <Text style={estilos.cardDetalheValor}>{paciente?.especialidade || 'N/A'}</Text>
                </View>
                <View style={estilos.cardDetalheItem}>
                  <Text style={estilos.cardDetalheRotulo}>Local:</Text>
                  <Text style={estilos.cardDetalheValor}>{esp.municipio || 'N/A'}</Text>
                </View>
                <View style={estilos.cardDetalheItem}>
                  <Text style={estilos.cardDetalheRotulo}>Data Prevista:</Text>
                  <Text style={[estilos.cardDetalheValor, { color: cores.sucesso }]}>
                    {opcao?.dataAgendamento || 'A definir'}
                  </Text>
                </View>
                <View style={estilos.cardDetalheItem}>
                  <Text style={estilos.cardDetalheRotulo}>Distancia:</Text>
                  <Text style={[estilos.cardDetalheValor, { color: cores.primaria }]}>
                    {det.distancia?.toFixed(1) || '--'} km
                  </Text>
                </View>
              </View>

              <View style={estilos.cardEndereco}>
                <Text style={estilos.cardEnderecoLabel}>Endereco:</Text>
                <Text style={estilos.cardEnderecoTexto}>{esp.endereco || 'N/A'}</Text>
              </View>
              <Text style={estilos.mensagemHora}>10:24</Text>
            </View>

            {/* instrucoes */}
            <View style={estilos.mensagemRecebida}>
              <Text style={[estilos.mensagemTexto, { fontWeight: 'bold' }]}>
                Importante - O que levar:
              </Text>
              <Text style={estilos.mensagemTexto}>
                {'\u2022'} Chegue com 15 minutos de antecedencia{'\n'}
                {'\u2022'} Traga documento oficial com foto{'\n'}
                {'\u2022'} Leve seus exames anteriores
              </Text>
              <Text style={estilos.mensagemTexto}>
                Em caso de duvidas, ligue: (81) 3184-0000
              </Text>
              <Text style={estilos.mensagemHora}>10:24</Text>
            </View>
          </ScrollView>

          {/* input desabilitado */}
          <View style={estilos.whatsappInput}>
            <View style={estilos.inputDesabilitado}>
              <Text style={estilos.inputPlaceholder}>Mensagem de exemplo...</Text>
            </View>
            <View style={estilos.botaoEnviar}>
              <Ionicons name="send" size={20} color={cores.branco} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// tela de resultado principal
const TelaResultado = ({ navigation }) => {
  const { resultado, limparResultado } = useResultado()
  const [indiceSelecionado, setIndiceSelecionado] = useState(0)
  const [carregando, setCarregando] = useState(false)
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false)
  const [modalWhatsAppVisivel, setModalWhatsAppVisivel] = useState(false)
  const [protocolo] = useState(`PE-${Date.now().toString().slice(-8)}`)

  // redireciona se nao houver resultado
  useEffect(() => {
    if (!resultado) {
      navigation.replace('Formulario')
    }
  }, [resultado])

  // prepara lista de opcoes
  const todasOpcoes = useMemo(() => {
    if (!resultado) return []
    const alternativas = Array.isArray(resultado.alternativas) ? resultado.alternativas : []
    return [
      { ...resultado.melhorOpcao, tipo: 'recomendado' },
      ...alternativas.map(alt => ({ ...alt, tipo: 'alternativa' })),
    ]
  }, [resultado])

  // opcao atualmente selecionada
  const opcaoSelecionada = useMemo(() => {
    if (!todasOpcoes.length) return null
    const opcao = todasOpcoes[indiceSelecionado]

    // calcula data do agendamento
    if (opcao.detalhes?.tempoEspera !== undefined) {
      const dataAgendamento = new Date()
      dataAgendamento.setDate(dataAgendamento.getDate() + opcao.detalhes.tempoEspera)
      opcao.dataAgendamento = dataAgendamento.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }

    return opcao
  }, [todasOpcoes, indiceSelecionado])

  if (!resultado) {
    return null
  }

  const paciente = resultado.paciente || {}
  const esp = opcaoSelecionada?.especialista || {}
  const det = opcaoSelecionada?.detalhes || {}

  // formata sexo
  const sexoMap = {
    'homem-cis': 'Masculino',
    'mulher-cis': 'Feminino',
    'homem-trans': 'Masculino',
    'mulher-trans': 'Feminino',
    'outro': 'Outro',
  }

  // calcula cor da probabilidade
  let probNoShow = det.probabilidadeNoShow || 0
  if (probNoShow > 0 && probNoShow < 1) probNoShow = probNoShow * 100
  let corProb = cores.sucesso
  if (probNoShow >= 15 && probNoShow < 40) corProb = '#f59e0b'
  if (probNoShow >= 40) corProb = cores.erro

  // confirma agendamento
  const confirmarAgendamento = () => {
    setCarregando(true)
    setTimeout(() => {
      setCarregando(false)
      setModalSucessoVisivel(true)
    }, 1000)
  }

  // abre whatsapp
  const abrirWhatsApp = () => {
    setModalSucessoVisivel(false)
    setTimeout(() => {
      setModalWhatsAppVisivel(true)
    }, 300)
  }

  // volta para formulario
  const voltar = () => {
    limparResultado()
    navigation.replace('Formulario')
  }

  return (
    <LinearGradient
      colors={[cores.gradienteInicio, cores.gradienteFim]}
      style={estilos.container}
    >
      <SafeAreaView style={estilos.safeArea}>
        <ScrollView
          contentContainerStyle={estilos.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* cabecalho */}
          <View style={estilos.cabecalho}>
            <Image
              source={require('../../assets/imagens/logo-upae.png')}
              style={estilos.logo}
              resizeMode="contain"
            />
            <View style={estilos.cabecalhoCentro}>
              <Text style={estilos.tituloPrincipal}>Resultado da Otimizacao</Text>
              <Text style={estilos.subtituloCabecalho}>Sistema de Regulacao UPAE</Text>
            </View>
            <View style={estilos.protocoloContainer}>
              <Text style={estilos.protocoloLabel}>Protocolo</Text>
              <Text style={estilos.protocoloValor}>{protocolo}</Text>
            </View>
          </View>

          {/* dados do paciente */}
          <View style={estilos.cartao}>
            <View style={estilos.cartaoCabecalho}>
              <Ionicons name="person-outline" size={18} color={cores.primaria} />
              <Text style={estilos.cartaoTitulo}>Dados do Paciente</Text>
            </View>

            <View style={estilos.dadosPaciente}>
              <View style={estilos.dadoItem}>
                <Text style={estilos.dadoRotulo}>Nome</Text>
                <Text style={estilos.dadoValor}>{paciente.nome || 'N/A'}</Text>
              </View>
              <View style={estilos.dadoItem}>
                <Text style={estilos.dadoRotulo}>CPF</Text>
                <Text style={estilos.dadoValorMono}>{formatarCpfParcial(paciente.cpf)}</Text>
              </View>
              <View style={estilos.dadoItem}>
                <Text style={estilos.dadoRotulo}>Sexo</Text>
                <Text style={estilos.dadoValor}>{sexoMap[paciente.sexo] || paciente.sexo || 'N/A'}</Text>
              </View>
              <View style={estilos.dadoItem}>
                <Text style={estilos.dadoRotulo}>Idade</Text>
                <Text style={estilos.dadoValor}>{paciente.idade || '--'} anos</Text>
              </View>
              <View style={estilos.dadoItem}>
                <Text style={estilos.dadoRotulo}>Especialidade</Text>
                <Text style={[estilos.dadoValor, { color: cores.primaria, fontWeight: '600' }]}>
                  {paciente.especialidade || 'N/A'}
                </Text>
              </View>
              <View style={estilos.dadoItemFull}>
                <Text style={estilos.dadoRotulo}>Endereco</Text>
                <Text style={estilos.dadoValor}>{paciente.endereco || paciente.municipio || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* menu de opcoes */}
          <View style={estilos.cartao}>
            <View style={estilos.cartaoCabecalho}>
              <Ionicons name="business-outline" size={18} color="#9333ea" />
              <Text style={estilos.cartaoTitulo}>Locais Disponiveis</Text>
            </View>
            <Text style={estilos.dicaMenu}>Clique nas opcoes para comparar:</Text>

            {todasOpcoes.map((opcao, indice) => (
              <CartaoOpcao
                key={indice}
                opcao={opcao}
                indice={indice}
                selecionado={indice === indiceSelecionado}
                aoSelecionar={() => setIndiceSelecionado(indice)}
              />
            ))}
          </View>

          {/* painel de detalhes */}
          <View style={estilos.painelDetalhes}>
            <LinearGradient
              colors={[cores.primaria, '#4f46e5']}
              style={estilos.painelCabecalho}
            >
              <View style={[
                estilos.badgePainel,
                indiceSelecionado === 0 ? estilos.badgeMelhor : estilos.badgeAlternativaPainel,
              ]}>
                <Text style={estilos.textoBadgePainel}>
                  {indiceSelecionado === 0 ? 'Opção Recomendada' : 'Alternativa'}
                </Text>
              </View>
              <Text style={estilos.tituloPainel}>
                {esp.municipio} - {esp.unidade || esp.nome || 'Unidade'}
              </Text>
              <Text style={estilos.enderecoPainel}>{esp.endereco || '--'}</Text>
            </LinearGradient>

            <View style={estilos.painelCorpo}>
              {/* metricas */}
              <View style={estilos.gridMetricas}>
                <CartaoMetrica
                  titulo="Distancia"
                  valor={det.distancia ? `${det.distancia.toFixed(1)} km` : '--'}
                />
                <CartaoMetrica
                  titulo="Espera Estimada"
                  valor={det.tempoEspera !== undefined ? `${det.tempoEspera} dias` : '--'}
                  subtitulo={opcaoSelecionada?.dataAgendamento}
                />
                <CartaoMetrica
                  titulo="Custo Transp."
                  valor={det.custo !== undefined ? formatarMoeda(det.custo) : '--'}
                />
                <CartaoMetrica
                  titulo="Prob. Falta"
                  valor={`${Math.round(probNoShow)}%`}
                  cor={corProb}
                />
              </View>

              {/* analise */}
              <View style={estilos.analise}>
                <View style={estilos.analiseCabecalho}>
                  <Ionicons name="document-text-outline" size={18} color="#6366f1" />
                  <Text style={estilos.analiseTitulo}>Analise da Alocacao</Text>
                </View>
                <View style={estilos.analiseConteudo}>
                  {indiceSelecionado === 0 ? (
                    <>
                      <Text style={estilos.analiseTextoDestaque}>Por que esta opcao foi escolhida?</Text>
                      <Text style={estilos.analiseTexto}>
                        O sistema identificou esta unidade como o ponto de equilibrio ideal.
                      </Text>
                      <Text style={estilos.analiseItem}>
                        {'\u2022'} Minimiza a distância ({det.distancia?.toFixed(1) || '--'} km)
                      </Text>
                      <Text style={estilos.analiseItem}>
                        {'\u2022'} Atendimento em prazo razoável ({det.tempoEspera || '--'} dias)
                      </Text>
                      <Text style={estilos.analiseItem}>
                        {'\u2022'} Considera facilidade de transporte público
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={[estilos.analiseTextoDestaque, { color: '#f59e0b' }]}>
                        Nota sobre esta alternativa:
                      </Text>
                      <Text style={estilos.analiseTexto}>
                        Voce esta visualizando uma opcao manual.
                      </Text>
                      {det.distancia > 25 ? (
                        <Text style={[estilos.analiseItem, { color: '#f59e0b' }]}>
                          {'\u2022'} Atencao: Esta unidade e distante ({det.distancia?.toFixed(1)} km)
                        </Text>
                      ) : (
                        <Text style={estilos.analiseItem}>
                          {'\u2022'} Distancia aceitavel ({det.distancia?.toFixed(1) || '--'} km)
                        </Text>
                      )}
                      <Text style={estilos.analiseItem}>
                        {'\u2022'} Tempo de espera: {det.tempoEspera || '--'} dias
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* criterios */}
          <View style={estilos.cartao}>
            <View style={estilos.cartaoCabecalho}>
              <Ionicons name="information-circle-outline" size={18} color={cores.cinza} />
              <Text style={estilos.cartaoTitulo}>Como o sistema escolhe?</Text>
            </View>

            <View style={estilos.gridCriterios}>
              <CriterioEscolha
                icone="navigate"
                cor={cores.primaria}
                titulo="Proximidade"
                descricao="Prioriza unidades mais perto para facilitar deslocamento"
              />
              <CriterioEscolha
                icone="time"
                cor={cores.sucesso}
                titulo="Tempo de Espera"
                descricao="Cruza dados de filas para atendimento rapido"
              />
              <CriterioEscolha
                icone="cash"
                cor="#f59e0b"
                titulo="Custo Transporte"
                descricao="Calcula rotas evitando muitas passagens"
              />
              <CriterioEscolha
                icone="checkmark-circle"
                cor="#9333ea"
                titulo="Aderencia"
                descricao="Evita locais com muitas faltas"
              />
            </View>
          </View>

          {/* botoes */}
          <View style={estilos.botoes}>
            <TouchableOpacity style={estilos.botaoVoltar} onPress={voltar}>
              <Text style={estilos.textoBotaoVoltar}>Voltar</Text>
            </TouchableOpacity>
            <Botao
              titulo="Confirmar Agendamento"
              aoClicar={confirmarAgendamento}
              carregando={carregando}
              icone={<Ionicons name="checkmark" size={20} color={cores.branco} />}
              estilo={{ flex: 1, marginLeft: 12 }}
              corFundo={cores.sucesso}
            />
          </View>
        </ScrollView>

        {/* modais */}
        <ModalSucesso
          visivel={modalSucessoVisivel}
          aoFechar={() => setModalSucessoVisivel(false)}
          aoAbrirWhatsApp={abrirWhatsApp}
          paciente={paciente}
          opcao={opcaoSelecionada}
          protocolo={protocolo}
        />

        <ModalWhatsApp
          visivel={modalWhatsAppVisivel}
          aoFechar={() => setModalWhatsAppVisivel(false)}
          paciente={paciente}
          opcao={opcaoSelecionada}
          protocolo={protocolo}
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
  scrollContent: {
    padding: 16,
  },
  cabecalho: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cabecalhoCentro: {
    flex: 1,
    marginLeft: 12,
  },
  logo: {
    width: 56,
    height: 56,
  },
  tituloPrincipal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
  },
  subtituloCabecalho: {
    fontSize: 12,
    color: cores.cinza,
    marginTop: 2,
  },
  protocoloContainer: {
    alignItems: 'center',
  },
  protocoloLabel: {
    fontSize: 10,
    color: cores.cinza,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  protocoloValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.primaria,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cartaoCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: cores.cinzaClaro,
  },
  cartaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
    marginLeft: 8,
  },
  dadosPaciente: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dadoItem: {
    width: '50%',
    paddingVertical: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: cores.cinzaClaro,
  },
  dadoItemFull: {
    width: '100%',
    paddingVertical: 8,
  },
  dadoRotulo: {
    fontSize: 12,
    color: cores.cinza,
    marginBottom: 2,
  },
  dadoValor: {
    fontSize: 14,
    color: cores.cinzaEscuro,
  },
  dadoValorMono: {
    fontSize: 14,
    color: cores.cinzaEscuro,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  dicaMenu: {
    fontSize: 12,
    color: cores.cinza,
    marginBottom: 12,
  },
  cartaoOpcao: {
    borderWidth: 1,
    borderColor: cores.cinzaClaro,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: cores.branco,
  },
  cartaoOpcaoSelecionado: {
    borderColor: cores.primaria,
    borderLeftWidth: 4,
    backgroundColor: '#eff6ff',
  },
  cartaoOpcaoRecomendado: {
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
  },
  cartaoOpcaoConteudo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartaoOpcaoInfo: {
    flex: 1,
  },
  cartaoOpcaoBadgeContainer: {
    marginBottom: 4,
  },
  cartaoOpcaoBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeRecomendado: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  badgeAlternativa: {
    backgroundColor: cores.cinzaClaro,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textoBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  textoBadgeRecomendado: {
    color: '#166534',
  },
  textoBadgeAlternativa: {
    color: cores.cinza,
  },
  cartaoOpcaoMunicipio: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
  },
  cartaoOpcaoUnidade: {
    fontSize: 12,
    color: cores.cinza,
  },
  cartaoOpcaoDistancia: {
    marginLeft: 12,
  },
  textoDistancia: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.primaria,
  },
  painelDetalhes: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  painelCabecalho: {
    padding: 20,
  },
  badgePainel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeMelhor: {
    backgroundColor: '#4ade80',
  },
  badgeAlternativaPainel: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  textoBadgePainel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: cores.branco,
    textTransform: 'uppercase',
  },
  tituloPainel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: cores.branco,
    marginBottom: 4,
  },
  enderecoPainel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  painelCorpo: {
    padding: 16,
  },
  gridMetricas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 16,
  },
  cartaoMetrica: {
    width: '50%',
    padding: 4,
  },
  tituloMetrica: {
    fontSize: 10,
    color: cores.cinza,
    textTransform: 'uppercase',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  valorMetrica: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
    textAlign: 'center',
  },
  subtituloMetrica: {
    fontSize: 10,
    color: cores.cinza,
    textAlign: 'center',
    marginTop: 2,
  },
  analise: {
    marginTop: 8,
  },
  analiseCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  analiseTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
    marginLeft: 6,
  },
  analiseConteudo: {
    backgroundColor: '#eef2ff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  analiseTextoDestaque: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4338ca',
    marginBottom: 4,
  },
  analiseTexto: {
    fontSize: 13,
    color: '#4338ca',
    lineHeight: 20,
    marginBottom: 8,
  },
  analiseItem: {
    fontSize: 13,
    color: '#4338ca',
    lineHeight: 20,
    marginLeft: 4,
  },
  gridCriterios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  criterio: {
    width: '50%',
    padding: 6,
    flexDirection: 'row',
  },
  criterioIcone: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  criterioTexto: {
    flex: 1,
  },
  criterioTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
    marginBottom: 2,
  },
  criterioDescricao: {
    fontSize: 10,
    color: cores.cinza,
    lineHeight: 14,
  },
  botoes: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 24,
  },
  botaoVoltar: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: cores.branco,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: cores.cinzaClaro,
  },
  textoBotaoVoltar: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.cinzaEscuro,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalConteudo: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 400,
  },
  modalCabecalho: {
    padding: 32,
    alignItems: 'center',
  },
  iconeSuccesso: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: cores.branco,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.branco,
    marginBottom: 8,
  },
  modalProtocolo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  modalCorpo: {
    padding: 20,
  },
  detalhesAgendamento: {
    backgroundColor: cores.cinzaClaro,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  detalhesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
    marginBottom: 12,
  },
  detalheItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detalheRotulo: {
    fontSize: 13,
    color: cores.cinza,
  },
  detalheValor: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.cinzaEscuro,
  },
  textoSms: {
    fontSize: 13,
    color: cores.cinza,
    textAlign: 'center',
    marginBottom: 20,
  },
  botoesModal: {
    flexDirection: 'row',
  },
  botaoFechar: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    marginRight: 8,
  },
  textoBotaoFechar: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.cinzaEscuro,
    textAlign: 'center',
  },
  botaoWhatsApp: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#25d366',
    borderRadius: 8,
  },
  textoBotaoWhatsApp: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.branco,
    marginLeft: 8,
  },
  whatsappContainer: {
    backgroundColor: cores.branco,
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },
  whatsappCabecalho: {
    backgroundColor: '#075e54',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  whatsappBotaoVoltar: {
    padding: 4,
  },
  whatsappAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.branco,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  whatsappAvatarTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#25d366',
  },
  whatsappInfo: {
    marginLeft: 12,
  },
  whatsappNome: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.branco,
  },
  whatsappStatus: {
    fontSize: 12,
    color: '#c8f7dc',
  },
  whatsappChat: {
    backgroundColor: '#ece5dd',
    padding: 12,
    maxHeight: 400,
  },
  avisoSimulacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef3c7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  avisoSimulacaoTexto: {
    fontSize: 11,
    color: '#92400e',
    marginLeft: 4,
  },
  mensagemRecebida: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  mensagemEnviada: {
    backgroundColor: '#dcf8c6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    maxWidth: '85%',
    alignSelf: 'flex-end',
  },
  mensagemTexto: {
    fontSize: 13,
    color: cores.cinzaEscuro,
    lineHeight: 18,
  },
  mensagemHora: {
    fontSize: 10,
    color: cores.cinza,
    textAlign: 'right',
    marginTop: 4,
  },
  mensagemHoraEnviada: {
    fontSize: 10,
    color: cores.cinza,
    textAlign: 'right',
    marginTop: 4,
  },
  botoesConfirmacao: {
    marginTop: 8,
  },
  botaoConfirmar: {
    backgroundColor: '#25d366',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 6,
  },
  textoBotaoConfirmar: {
    color: cores.branco,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  },
  botaoCancelar: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoBotaoCancelar: {
    color: cores.cinzaEscuro,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  },
  cardAgendamento: {
    backgroundColor: cores.branco,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    maxWidth: '85%',
    borderLeftWidth: 4,
    borderLeftColor: cores.sucesso,
  },
  cardCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
  },
  cardProtocolo: {
    fontSize: 11,
    color: cores.cinza,
  },
  cardDetalhes: {
    borderTopWidth: 1,
    borderTopColor: cores.cinzaClaro,
    paddingTop: 10,
  },
  cardDetalheItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardDetalheRotulo: {
    fontSize: 12,
    color: cores.cinza,
  },
  cardDetalheValor: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.cinzaEscuro,
  },
  cardEndereco: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: cores.cinzaClaro,
  },
  cardEnderecoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: cores.cinza,
    marginBottom: 2,
  },
  cardEnderecoTexto: {
    fontSize: 11,
    color: cores.cinzaEscuro,
    lineHeight: 16,
  },
  whatsappInput: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputDesabilitado: {
    flex: 1,
    backgroundColor: cores.branco,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  inputPlaceholder: {
    fontSize: 13,
    color: cores.cinza,
  },
  botaoEnviar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#25d366',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
})

export default TelaResultado
