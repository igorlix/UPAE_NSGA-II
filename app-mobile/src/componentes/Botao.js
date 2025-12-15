import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native'
import { cores } from '../configuracao/cores'

// componente de botao reutilizavel
const Botao = ({
  titulo,
  aoClicar,
  variante = 'primario',
  tamanho = 'medio',
  desabilitado = false,
  carregando = false,
  icone = null,
  larguraTotal = false,
  estilo = {},
  corFundo = null,
}) => {
  // estilos baseados na variante
  const estiloVariante = estilos[variante] || estilos.primario
  const estiloTextoVariante = estilosTexto[variante] || estilosTexto.primario
  const estiloTamanho = estilosTamanho[tamanho] || estilosTamanho.medio

  return (
    <TouchableOpacity
      style={[
        estilos.base,
        estiloVariante,
        estiloTamanho,
        larguraTotal && estilos.larguraTotal,
        desabilitado && estilos.desabilitado,
        corFundo && { backgroundColor: corFundo },
        estilo,
      ]}
      onPress={aoClicar}
      disabled={desabilitado || carregando}
      activeOpacity={0.7}
    >
      {carregando ? (
        <ActivityIndicator
          size="small"
          color={variante === 'secundario' ? cores.primaria : cores.branco}
        />
      ) : (
        <View style={estilos.conteudo}>
          {icone && <View style={estilos.icone}>{icone}</View>}
          <Text style={[estilos.textoBase, estiloTextoVariante]}>{titulo}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const estilos = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icone: {
    marginRight: 8,
  },
  textoBase: {
    fontWeight: '600',
  },
  larguraTotal: {
    width: '100%',
  },
  desabilitado: {
    opacity: 0.5,
  },

  // variantes
  primario: {
    backgroundColor: cores.primaria,
  },
  secundario: {
    backgroundColor: cores.branco,
    borderWidth: 2,
    borderColor: cores.cinzaMedio,
  },
  sucesso: {
    backgroundColor: cores.sucesso,
  },
  perigo: {
    backgroundColor: cores.erro,
  },
  alerta: {
    backgroundColor: cores.alerta,
  },
  fantasma: {
    backgroundColor: 'transparent',
  },
  whatsapp: {
    backgroundColor: cores.whatsappVerdeClaro,
  },
})

const estilosTexto = StyleSheet.create({
  primario: {
    color: cores.branco,
    fontSize: 16,
  },
  secundario: {
    color: cores.cinzaEscuro,
    fontSize: 16,
  },
  sucesso: {
    color: cores.branco,
    fontSize: 16,
  },
  perigo: {
    color: cores.branco,
    fontSize: 16,
  },
  alerta: {
    color: cores.branco,
    fontSize: 16,
  },
  fantasma: {
    color: cores.primaria,
    fontSize: 16,
  },
  whatsapp: {
    color: cores.branco,
    fontSize: 16,
  },
})

const estilosTamanho = StyleSheet.create({
  pequeno: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medio: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  grande: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
})

export default Botao
