import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useAutenticacao } from '../contextos/ContextoAutenticacao'
import CampoTexto from '../componentes/CampoTexto'
import Botao from '../componentes/Botao'
import Toast, { useToast } from '../componentes/Toast'
import ContainerResponsivo from '../componentes/ContainerResponsivo'
import { cores } from '../configuracao/cores'
import { CREDENCIAIS_TESTE } from '../configuracao/constantes'
import { validarEmail } from '../utilitarios/validadores'

// tela de login
const TelaLogin = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erros, setErros] = useState({})

  const { fazerLogin, verificarEmailLembrado, salvarEmailLembrado, removerEmailLembrado } = useAutenticacao()
  const { toast, mostrarToast, fecharToast } = useToast()

  // verifica email lembrado ao iniciar
  useEffect(() => {
    carregarEmailLembrado()
  }, [])

  const carregarEmailLembrado = async () => {
    const emailSalvo = await verificarEmailLembrado()
    if (emailSalvo) {
      setEmail(emailSalvo)
      setLembrar(true)
    }
  }

  // valida campos
  const validarCampos = () => {
    const novosErros = {}

    if (!email) {
      novosErros.email = 'Email e obrigatorio'
    } else if (!validarEmail(email)) {
      novosErros.email = 'Email invalido'
    }

    if (!senha) {
      novosErros.senha = 'Senha e obrigatoria'
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // faz login
  const handleLogin = async () => {
    if (!validarCampos()) return

    setCarregando(true)

    try {
      const resultado = await fazerLogin(email, senha)

      if (resultado.sucesso) {
        // salva ou remove email lembrado
        if (lembrar) {
          await salvarEmailLembrado(email)
        } else {
          await removerEmailLembrado()
        }

        mostrarToast('Login realizado com sucesso!', 'sucesso')
      } else {
        mostrarToast(resultado.erro || 'Email ou senha incorretos', 'erro')
      }
    } catch (erro) {
      mostrarToast('Erro ao fazer login. Tente novamente.', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <LinearGradient
      colors={[cores.gradienteInicio, cores.gradienteFim]}
      style={estilos.container}
    >
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
          <View style={estilos.cartaoLogin}>
            {/* logo e titulo */}
            <View style={estilos.cabecalho}>
              <Image
                source={require('../../assets/imagens/logo-upae.png')}
                style={estilos.logo}
                resizeMode="contain"
              />
              <Text style={estilos.descricao}>
                Sistema de Alocacao de Pacientes Otimizado
              </Text>
            </View>

            {/* formulario */}
            <View style={estilos.formulario}>
              <CampoTexto
                rotulo="Email de Acesso"
                valor={email}
                aoMudar={setEmail}
                placeholder="admin@admin.com"
                tipo="email"
                icone="mail-outline"
                erro={erros.email}
                obrigatorio
              />

              <CampoTexto
                rotulo="Senha"
                valor={senha}
                aoMudar={setSenha}
                placeholder="Digite sua senha"
                tipo="senha"
                icone="lock-closed-outline"
                erro={erros.senha}
                obrigatorio
              />

              {/* lembrar-me e esqueceu senha */}
              <View style={estilos.opcoes}>
                <TouchableOpacity
                  style={estilos.checkbox}
                  onPress={() => setLembrar(!lembrar)}
                >
                  <Ionicons
                    name={lembrar ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={cores.primaria}
                  />
                  <Text style={estilos.textoCheckbox}>Lembrar-me</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={estilos.linkEsqueceu}>Esqueceu a senha?</Text>
                </TouchableOpacity>
              </View>

              {/* botao login */}
              <Botao
                titulo="Acessar Sistema"
                aoClicar={handleLogin}
                carregando={carregando}
                larguraTotal
                icone={<Ionicons name="log-in-outline" size={20} color={cores.branco} />}
              />
            </View>

            {/* credenciais de teste */}
            <View style={estilos.cartaoTeste}>
              <View style={estilos.cabecalhoTeste}>
                <Ionicons name="people-outline" size={16} color={cores.primaria} />
                <Text style={estilos.tituloTeste}>Credenciais de Teste</Text>
              </View>
              <Text style={estilos.credencial}>
                <Text style={estilos.rotuloCredencial}>Email: </Text>
                {CREDENCIAIS_TESTE.email}
              </Text>
              <Text style={estilos.credencial}>
                <Text style={estilos.rotuloCredencial}>Senha: </Text>
                {CREDENCIAIS_TESTE.senha}
              </Text>
            </View>

            {/* rodape */}
            <View style={estilos.rodape}>
              <Text style={estilos.textoRodape}>
                Secretaria de Saude do Estado de Pernambuco
              </Text>
              <Text style={estilos.textoRodape}>
                Sistema de Demonstracao - Dados Simulados
              </Text>
            </View>
          </View>

          {/* link politica de privacidade */}
          <TouchableOpacity
            style={estilos.linkPolitica}
            onPress={() => navigation.navigate('PoliticaPrivacidade')}
          >
            <Ionicons name="shield-checkmark-outline" size={16} color={cores.branco} />
            <Text style={estilos.textoLinkPolitica}>
              Politica de Privacidade e Protecao de Dados
            </Text>
          </TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView>
      </ContainerResponsivo>

      <Toast
        visivel={toast.visivel}
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        aoFechar={fecharToast}
      />
    </LinearGradient>
  )
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  cartaoLogin: {
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 24,
    shadowColor: cores.preto,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  descricao: {
    fontSize: 14,
    color: cores.cinza,
    textAlign: 'center',
  },
  formulario: {
    marginBottom: 16,
  },
  opcoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoCheckbox: {
    marginLeft: 8,
    fontSize: 14,
    color: cores.cinzaEscuro,
  },
  linkEsqueceu: {
    fontSize: 14,
    color: cores.primaria,
    fontWeight: '500',
  },
  cartaoTeste: {
    backgroundColor: cores.primariaClara,
    borderWidth: 1,
    borderColor: cores.primariaFundo,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  cabecalhoTeste: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tituloTeste: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.primariaEscura,
    marginLeft: 6,
  },
  credencial: {
    fontSize: 12,
    color: cores.primaria,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  rotuloCredencial: {
    fontWeight: 'bold',
  },
  rodape: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: cores.cinzaClaro,
  },
  textoRodape: {
    fontSize: 11,
    color: cores.cinza,
    textAlign: 'center',
  },
  linkPolitica: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  textoLinkPolitica: {
    fontSize: 13,
    color: cores.branco,
    marginLeft: 6,
  },
})

export default TelaLogin
