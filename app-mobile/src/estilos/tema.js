import { StyleSheet, Platform } from 'react-native'
import { cores } from '../configuracao/cores'

// estilos globais reutilizaveis
export const estilosGlobais = StyleSheet.create({
  // containers
  container: {
    flex: 1,
    backgroundColor: cores.cinzaClaro,
  },
  containerCentralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  containerScroll: {
    flexGrow: 1,
    padding: 16,
  },

  // cards
  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: cores.preto,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  cartaoDestaque: {
    borderLeftWidth: 4,
    borderLeftColor: cores.primaria,
  },

  // tipografia
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.preto,
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.cinzaEscuro,
    marginBottom: 8,
  },
  texto: {
    fontSize: 14,
    color: cores.cinzaEscuro,
    lineHeight: 20,
  },
  textoSecundario: {
    fontSize: 12,
    color: cores.cinza,
    lineHeight: 18,
  },
  textoPequeno: {
    fontSize: 11,
    color: cores.cinza,
  },
  textoErro: {
    fontSize: 12,
    color: cores.erro,
    marginTop: 4,
  },
  textoSucesso: {
    fontSize: 12,
    color: cores.sucesso,
    marginTop: 4,
  },

  // labels e rotulos
  rotulo: {
    fontSize: 14,
    fontWeight: '500',
    color: cores.cinzaEscuro,
    marginBottom: 6,
  },
  rotuloObrigatorio: {
    color: cores.erro,
  },

  // inputs
  input: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.cinzaMedio,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: cores.preto,
  },
  inputFocado: {
    borderColor: cores.primaria,
    borderWidth: 2,
  },
  inputErro: {
    borderColor: cores.erro,
    backgroundColor: cores.erroClara,
  },
  inputDesabilitado: {
    backgroundColor: cores.cinzaClaro,
    color: cores.cinza,
  },

  // botoes
  botao: {
    backgroundColor: cores.primaria,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  botaoSecundario: {
    backgroundColor: cores.branco,
    borderWidth: 2,
    borderColor: cores.cinzaMedio,
  },
  botaoSucesso: {
    backgroundColor: cores.sucesso,
  },
  botaoPerigo: {
    backgroundColor: cores.erro,
  },
  botaoDesabilitado: {
    backgroundColor: cores.cinzaMedio,
  },
  textoBotao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '600',
  },
  textoBotaoSecundario: {
    color: cores.cinzaEscuro,
  },

  // linhas e divisores
  divisor: {
    height: 1,
    backgroundColor: cores.cinzaMedio,
    marginVertical: 16,
  },

  // espacamentos
  espacoP: { height: 8 },
  espacoM: { height: 16 },
  espacoG: { height: 24 },
  espacoXG: { height: 32 },

  // rows e columns
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linhaEntre: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coluna: {
    flexDirection: 'column',
  },

  // badges
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgePrimaria: {
    backgroundColor: cores.primariaClara,
  },
  badgeSucesso: {
    backgroundColor: cores.sucessoClara,
  },
  badgeErro: {
    backgroundColor: cores.erroClara,
  },
  badgeAlerta: {
    backgroundColor: cores.alertaClara,
  },
  textoBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  // secoes de formulario
  secaoFormulario: {
    marginBottom: 24,
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.cinzaEscuro,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: cores.cinzaMedio,
  },

  // loading
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

// constantes de espacamento
export const espacamentos = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

// constantes de fontes
export const fontes = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}

// tamanhos de fonte
export const tamanhosFonte = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  titulo: 28,
}

// raios de borda
export const raiosBorda = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  circular: 9999,
}
