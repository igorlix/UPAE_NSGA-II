import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ProvedorAutenticacao } from './src/contextos/ContextoAutenticacao'
import { ProvedorResultado } from './src/contextos/ContextoResultado'
import Navegador from './src/navegacao/Navegador'

// app principal
const App = () => {
  return (
    <SafeAreaProvider>
      <ProvedorAutenticacao>
        <ProvedorResultado>
          <StatusBar style="light" />
          <Navegador />
        </ProvedorResultado>
      </ProvedorAutenticacao>
    </SafeAreaProvider>
  )
}

export default App
