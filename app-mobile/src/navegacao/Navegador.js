import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAutenticacao } from '../contextos/ContextoAutenticacao'
import { ActivityIndicator, View } from 'react-native'
import { cores } from '../configuracao/cores'

// telas
import TelaLogin from '../telas/TelaLogin'
import TelaFormulario from '../telas/TelaFormulario'
import TelaResultado from '../telas/TelaResultado'
import TelaPoliticaPrivacidade from '../telas/TelaPoliticaPrivacidade'

const Stack = createNativeStackNavigator()

// navegador principal
const Navegador = () => {
  const { estaAutenticado, carregando } = useAutenticacao()

  // mostra loading enquanto verifica autenticacao
  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!estaAutenticado ? (
          // telas de autenticacao
          <>
            <Stack.Screen name="Login" component={TelaLogin} />
            <Stack.Screen name="PoliticaPrivacidade" component={TelaPoliticaPrivacidade} />
          </>
        ) : (
          // telas autenticadas
          <>
            <Stack.Screen name="Formulario" component={TelaFormulario} />
            <Stack.Screen name="Resultado" component={TelaResultado} />
            <Stack.Screen name="PoliticaPrivacidade" component={TelaPoliticaPrivacidade} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navegador
