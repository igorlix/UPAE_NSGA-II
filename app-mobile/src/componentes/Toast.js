import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { cores } from '../configuracao/cores'

// componente de toast para notificacoes
const Toast = ({
  visivel,
  mensagem,
  tipo = 'sucesso',
  duracao = 3000,
  aoFechar,
}) => {
  const animacao = useRef(new Animated.Value(0)).current

  // configuracoes por tipo
  const config = {
    sucesso: {
      icone: 'checkmark-circle',
      corIcone: cores.sucesso,
      corBorda: cores.sucesso,
      corFundo: cores.sucessoClara,
    },
    erro: {
      icone: 'close-circle',
      corIcone: cores.erro,
      corBorda: cores.erro,
      corFundo: cores.erroClara,
    },
    alerta: {
      icone: 'warning',
      corIcone: cores.alerta,
      corBorda: cores.alerta,
      corFundo: cores.alertaClara,
    },
    info: {
      icone: 'information-circle',
      corIcone: cores.primaria,
      corBorda: cores.primaria,
      corFundo: cores.primariaClara,
    },
  }

  const configAtual = config[tipo] || config.info

  useEffect(() => {
    if (visivel) {
      // anima entrada
      Animated.spring(animacao, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }).start()

      // fecha apos duracao
      const timer = setTimeout(() => {
        fecharToast()
      }, duracao)

      return () => clearTimeout(timer)
    }
  }, [visivel])

  const fecharToast = () => {
    Animated.timing(animacao, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (aoFechar) aoFechar()
    })
  }

  if (!visivel) return null

  return (
    <Animated.View
      style={[
        estilos.container,
        {
          backgroundColor: configAtual.corFundo,
          borderLeftColor: configAtual.corBorda,
          transform: [
            {
              translateY: animacao.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
          opacity: animacao,
        },
      ]}
    >
      <Ionicons
        name={configAtual.icone}
        size={24}
        color={configAtual.corIcone}
        style={estilos.icone}
      />

      <Text style={estilos.mensagem}>{mensagem}</Text>

      <TouchableOpacity onPress={fecharToast} style={estilos.botaoFechar}>
        <Ionicons name="close" size={20} color={cores.cinza} />
      </TouchableOpacity>
    </Animated.View>
  )
}

// hook para gerenciar toasts
export const useToast = () => {
  const [toast, setToast] = React.useState({
    visivel: false,
    mensagem: '',
    tipo: 'sucesso',
  })

  const mostrarToast = (mensagem, tipo = 'sucesso') => {
    setToast({ visivel: true, mensagem, tipo })
  }

  const fecharToast = () => {
    setToast((prev) => ({ ...prev, visivel: false }))
  }

  return { toast, mostrarToast, fecharToast }
}

const estilos = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: cores.preto,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 9999,
  },
  icone: {
    marginRight: 12,
  },
  mensagem: {
    flex: 1,
    fontSize: 14,
    color: cores.cinzaEscuro,
  },
  botaoFechar: {
    padding: 4,
  },
})

export default Toast
