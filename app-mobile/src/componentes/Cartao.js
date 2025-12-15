import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { cores } from '../configuracao/cores'

// componente de cartao reutilizavel
const Cartao = ({
  children,
  titulo = null,
  subtitulo = null,
  icone = null,
  destaque = false,
  corDestaque = cores.primaria,
  estilo = {},
}) => {
  return (
    <View
      style={[
        estilos.cartao,
        destaque && { borderLeftWidth: 4, borderLeftColor: corDestaque },
        estilo,
      ]}
    >
      {(titulo || subtitulo || icone) && (
        <View style={estilos.cabecalho}>
          {icone && <View style={estilos.icone}>{icone}</View>}
          <View style={estilos.textos}>
            {titulo && <Text style={estilos.titulo}>{titulo}</Text>}
            {subtitulo && <Text style={estilos.subtitulo}>{subtitulo}</Text>}
          </View>
        </View>
      )}
      {children}
    </View>
  )
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: cores.cinzaMedio,
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
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.cinzaClaro,
  },
  icone: {
    marginRight: 12,
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.preto,
  },
  subtitulo: {
    fontSize: 12,
    color: cores.cinza,
    marginTop: 2,
  },
})

export default Cartao
