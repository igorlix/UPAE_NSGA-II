import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { cores } from '../configuracao/cores'

// componente de secao
const Secao = ({ titulo, icone, corIcone, children }) => (
  <View style={estilos.secao}>
    <View style={estilos.cabecalhoSecao}>
      <Ionicons name={icone} size={22} color={corIcone} />
      <Text style={estilos.tituloSecao}>{titulo}</Text>
    </View>
    {children}
  </View>
)

// componente de cartao de direito
const CartaoDireito = ({ titulo, descricao, cor }) => (
  <View style={[estilos.cartaoDireito, { borderColor: cor }]}>
    <Text style={[estilos.tituloDireito, { color: cor }]}>{titulo}</Text>
    <Text style={estilos.descricaoDireito}>{descricao}</Text>
  </View>
)

// tela politica de privacidade
const TelaPoliticaPrivacidade = ({ navigation }) => {
  return (
    <LinearGradient
      colors={[cores.gradienteInicio, cores.gradienteFim]}
      style={estilos.container}
    >
      <SafeAreaView style={estilos.safeArea}>
        {/* cabecalho */}
        <View style={estilos.cabecalho}>
          <TouchableOpacity
            style={estilos.botaoVoltar}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={cores.branco} />
          </TouchableOpacity>
          <Text style={estilos.tituloCabecalho}>Politica de Privacidade</Text>
          <View style={estilos.espacoVazio} />
        </View>

        <ScrollView
          style={estilos.conteudo}
          contentContainerStyle={estilos.conteudoContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* cartao principal */}
          <View style={estilos.cartaoPrincipal}>
            <View style={estilos.cabecalhoCartao}>
              <Text style={estilos.tituloPrincipal}>Sistema de Otimizacao de Alocacao de Pacientes</Text>
              <Text style={estilos.subtitulo}>Ultima atualizacao: 01 de dezembro de 2025</Text>
            </View>

            {/* introducao */}
            <Secao titulo="1. Introducao" icone="checkmark-circle" corIcone={cores.primaria}>
              <Text style={estilos.paragrafo}>
                A Secretaria de Saude do Estado de Pernambuco esta comprometida com a protecao da privacidade e dos dados pessoais dos cidadaos. Esta Politica de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais em conformidade com a Lei Geral de Protecao de Dados (LGPD - Lei n 13.709/2018).
              </Text>
            </Secao>

            {/* finalidade */}
            <Secao titulo="2. Finalidade do Tratamento" icone="clipboard" corIcone={cores.sucesso}>
              <Text style={estilos.paragrafo}>Os dados pessoais coletados tem as seguintes finalidades:</Text>
              <View style={estilos.lista}>
                <Text style={estilos.itemLista}>• Identificacao do paciente: Nome e CPF para identificacao unica</Text>
                <Text style={estilos.itemLista}>• Otimizacao de alocacao: Endereco para calcular a melhor UPAE</Text>
                <Text style={estilos.itemLista}>• Priorizacao: Idade e condicoes especiais para priorizar atendimento</Text>
                <Text style={estilos.itemLista}>• Matching de especialidade: Sexo e especialidade para direcionamento</Text>
                <Text style={estilos.itemLista}>• Transparencia algoritmica: Explicacoes sobre decisoes do sistema</Text>
              </View>
            </Secao>

            {/* dados coletados */}
            <Secao titulo="3. Dados Pessoais Coletados" icone="document-text" corIcone={cores.info}>
              <View style={estilos.tabelaDados}>
                <View style={estilos.linhaTabelaCabecalho}>
                  <Text style={estilos.celulaCabecalho}>Dado</Text>
                  <Text style={estilos.celulaCabecalho}>Obrigatorio</Text>
                </View>
                <View style={estilos.linhaTabela}>
                  <Text style={estilos.celulaDado}>Nome Completo</Text>
                  <Text style={estilos.celulaSim}>Sim</Text>
                </View>
                <View style={estilos.linhaTabela}>
                  <Text style={estilos.celulaDado}>CPF</Text>
                  <Text style={estilos.celulaSim}>Sim</Text>
                </View>
                <View style={estilos.linhaTabela}>
                  <Text style={estilos.celulaDado}>Sexo</Text>
                  <Text style={estilos.celulaSim}>Sim</Text>
                </View>
                <View style={estilos.linhaTabela}>
                  <Text style={estilos.celulaDado}>Idade</Text>
                  <Text style={estilos.celulaSim}>Sim</Text>
                </View>
                <View style={estilos.linhaTabela}>
                  <Text style={estilos.celulaDado}>Endereco/Municipio</Text>
                  <Text style={estilos.celulaSim}>Sim</Text>
                </View>
                <View style={estilos.linhaTabela}>
                  <Text style={estilos.celulaDado}>Condicoes Especiais</Text>
                  <Text style={estilos.celulaOpcional}>Opcional</Text>
                </View>
              </View>
            </Secao>

            {/* base legal */}
            <Secao titulo="4. Base Legal (LGPD)" icone="scale" corIcone="#9333ea">
              <View style={estilos.destaque}>
                <Text style={estilos.itemLista}>• Art. 7, II: Cumprimento de obrigacao legal</Text>
                <Text style={estilos.itemLista}>• Art. 7, V: Exercicio regular de direitos</Text>
                <Text style={estilos.itemLista}>• Art. 11, II: Tutela da saude</Text>
                <Text style={estilos.itemLista}>• Consentimento: Para compartilhamento de localizacao</Text>
              </View>
            </Secao>

            {/* anonimizacao */}
            <Secao titulo="5. Anonimizacao" icone="lock-closed" corIcone="#f59e0b">
              <Text style={estilos.paragrafo}>O sistema implementa tecnicas de protecao:</Text>
              <View style={estilos.lista}>
                <Text style={estilos.itemLista}>• Algoritmo trabalha apenas com coordenadas e IDs</Text>
                <Text style={estilos.itemLista}>• Logs pseudonimizados com IDs tecnicos</Text>
                <Text style={estilos.itemLista}>• Estatisticas agregadas e anonimizadas</Text>
              </View>
            </Secao>

            {/* armazenamento */}
            <Secao titulo="6. Armazenamento e Retencao" icone="server" corIcone={cores.erro}>
              <View style={estilos.cartaoInfo}>
                <Text style={estilos.tituloInfo}>Dados Ativos</Text>
                <Text style={estilos.textoInfo}>Armazenados ate conclusao ou cancelamento</Text>
              </View>
              <View style={estilos.cartaoInfo}>
                <Text style={estilos.tituloInfo}>Dados Historicos</Text>
                <Text style={estilos.textoInfo}>Mantidos por 5 anos (Resolucao CFM 1.821/2007)</Text>
              </View>
              <View style={estilos.cartaoInfo}>
                <Text style={estilos.tituloInfo}>Localizacao</Text>
                <Text style={estilos.textoInfo}>Servidores em territorio brasileiro (SP)</Text>
              </View>
            </Secao>

            {/* direitos */}
            <Secao titulo="7. Seus Direitos (LGPD Art. 18)" icone="shield-checkmark" corIcone="#14b8a6">
              <View style={estilos.gridDireitos}>
                <CartaoDireito
                  titulo="Confirmacao e Acesso"
                  descricao="Confirmar e acessar seus dados"
                  cor={cores.primaria}
                />
                <CartaoDireito
                  titulo="Correcao"
                  descricao="Corrigir dados inexatos"
                  cor={cores.sucesso}
                />
                <CartaoDireito
                  titulo="Anonimizacao"
                  descricao="Solicitar anonimizacao"
                  cor="#f59e0b"
                />
                <CartaoDireito
                  titulo="Portabilidade"
                  descricao="Solicitar em formato estruturado"
                  cor="#9333ea"
                />
                <CartaoDireito
                  titulo="Revogacao"
                  descricao="Revogar consentimento"
                  cor={cores.erro}
                />
                <CartaoDireito
                  titulo="Compartilhamento"
                  descricao="Saber com quem foi compartilhado"
                  cor={cores.cinzaEscuro}
                />
              </View>
            </Secao>

            {/* contato DPO */}
            <Secao titulo="8. Contato do DPO" icone="mail" corIcone={cores.cinzaEscuro}>
              <View style={estilos.cartaoContato}>
                <Text style={estilos.tituloContato}>Encarregado de Protecao de Dados</Text>
                <Text style={estilos.itemContato}>Email: dpo@saude.pe.gov.br</Text>
                <Text style={estilos.itemContato}>Telefone: (81) 3184-0000</Text>
                <Text style={estilos.itemContato}>Endereco: Rua Dona Maria Augusta Nogueira, 519 - Bongi, Recife-PE</Text>
                <Text style={estilos.itemContato}>Horario: Segunda a Sexta, 8h as 17h</Text>
              </View>
            </Secao>

            {/* seguranca */}
            <Secao titulo="9. Medidas de Seguranca" icone="shield" corIcone={cores.sucesso}>
              <View style={estilos.lista}>
                <Text style={estilos.itemLista}>• Criptografia TLS/SSL em transmissoes</Text>
                <Text style={estilos.itemLista}>• Controle de acesso baseado em perfis</Text>
                <Text style={estilos.itemLista}>• Monitoramento e logs de auditoria</Text>
                <Text style={estilos.itemLista}>• Backup regular e redundancia</Text>
                <Text style={estilos.itemLista}>• Treinamento continuo da equipe</Text>
                <Text style={estilos.itemLista}>• Testes de seguranca periodicos</Text>
              </View>
            </Secao>

            {/* alteracoes */}
            <Secao titulo="10. Alteracoes nesta Politica" icone="document" corIcone={cores.cinza}>
              <Text style={estilos.paragrafo}>
                Esta Politica de Privacidade pode ser atualizada periodicamente. Alteracoes significativas serao comunicadas atraves do sistema. Recomendamos que voce revise esta pagina regularmente.
              </Text>
            </Secao>
          </View>

          {/* rodape */}
          <View style={estilos.rodape}>
            <Text style={estilos.textoRodape}>Secretaria de Saude do Estado de Pernambuco</Text>
            <Text style={estilos.textoRodape}>CNPJ: 10.572.071/0001-94</Text>
            <Text style={estilos.textoRodapePequeno}>
              Em conformidade com a LGPD (Lei n 13.709/2018)
            </Text>
          </View>
        </ScrollView>
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
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  botaoVoltar: {
    padding: 8,
  },
  tituloCabecalho: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.branco,
  },
  espacoVazio: {
    width: 40,
  },
  conteudo: {
    flex: 1,
  },
  conteudoContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  cartaoPrincipal: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 20,
    shadowColor: cores.preto,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cabecalhoCartao: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.cinzaClaro,
  },
  tituloPrincipal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 12,
    color: cores.cinza,
  },
  secao: {
    marginBottom: 24,
  },
  cabecalhoSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
    marginLeft: 8,
  },
  paragrafo: {
    fontSize: 14,
    color: cores.cinzaEscuro,
    lineHeight: 22,
  },
  lista: {
    marginTop: 8,
  },
  itemLista: {
    fontSize: 14,
    color: cores.cinzaEscuro,
    lineHeight: 24,
    marginLeft: 8,
  },
  tabelaDados: {
    borderWidth: 1,
    borderColor: cores.cinzaClaro,
    borderRadius: 8,
    overflow: 'hidden',
  },
  linhaTabelaCabecalho: {
    flexDirection: 'row',
    backgroundColor: cores.cinzaClaro,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  celulaCabecalho: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
    textTransform: 'uppercase',
  },
  linhaTabela: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.cinzaClaro,
  },
  celulaDado: {
    flex: 1,
    fontSize: 14,
    color: cores.cinzaEscuro,
  },
  celulaSim: {
    flex: 1,
    fontSize: 14,
    color: cores.sucesso,
    fontWeight: '600',
  },
  celulaOpcional: {
    flex: 1,
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
  },
  destaque: {
    backgroundColor: '#eff6ff',
    borderLeftWidth: 4,
    borderLeftColor: cores.primaria,
    padding: 12,
    borderRadius: 4,
  },
  cartaoInfo: {
    backgroundColor: cores.cinzaClaro,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  tituloInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.cinzaEscuro,
    marginBottom: 4,
  },
  textoInfo: {
    fontSize: 13,
    color: cores.cinza,
  },
  gridDireitos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  cartaoDireito: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: cores.branco,
  },
  tituloDireito: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  descricaoDireito: {
    fontSize: 12,
    color: cores.cinza,
  },
  cartaoContato: {
    backgroundColor: cores.cinzaClaro,
    borderRadius: 8,
    padding: 16,
  },
  tituloContato: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.cinzaEscuro,
    marginBottom: 12,
  },
  itemContato: {
    fontSize: 13,
    color: cores.cinzaEscuro,
    marginBottom: 6,
  },
  rodape: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  textoRodape: {
    fontSize: 14,
    color: cores.branco,
    fontWeight: '600',
    marginBottom: 4,
  },
  textoRodapePequeno: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
})

export default TelaPoliticaPrivacidade
