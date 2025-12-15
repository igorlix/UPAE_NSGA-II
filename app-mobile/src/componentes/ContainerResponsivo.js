import React from 'react'
import { View, StyleSheet, Platform, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

// container responsivo que limita largura no web
const ContainerResponsivo = ({ children, style }) => {
  const isWeb = Platform.OS === 'web'

  return (
    <View style={[estilos.container, isWeb && estilos.containerWeb, style]}>
      <View style={[estilos.conteudo, isWeb && estilos.conteudoWeb]}>
        {children}
      </View>
    </View>
  )
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerWeb: {
    alignItems: 'center',
  },
  conteudo: {
    flex: 1,
    width: '100%',
  },
  conteudoWeb: {
    maxWidth: 480,
    width: '100%',
  },
})

export default ContainerResponsivo
