import React, { createContext, useState, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

// contexto do resultado da otimizacao
const ContextoResultado = createContext({})

// provedor do contexto
export const ProvedorResultado = ({ children }) => {
  const [resultado, setResultado] = useState(null)
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null)
  const [carregando, setCarregando] = useState(false)

  // salva resultado da otimizacao
  const salvarResultado = async (dados) => {
    try {
      await AsyncStorage.setItem('@upae:resultado', JSON.stringify(dados))
      setResultado(dados)

      // seleciona melhor opcao por padrao
      if (dados?.melhorOpcao) {
        setOpcaoSelecionada(dados.melhorOpcao)
      }
    } catch (erro) {
      console.log('erro ao salvar resultado:', erro)
    }
  }

  // carrega resultado salvo
  const carregarResultado = async () => {
    try {
      setCarregando(true)
      const dados = await AsyncStorage.getItem('@upae:resultado')
      if (dados) {
        const parsed = JSON.parse(dados)
        setResultado(parsed)
        if (parsed?.melhorOpcao) {
          setOpcaoSelecionada(parsed.melhorOpcao)
        }
        return parsed
      }
      return null
    } catch (erro) {
      console.log('erro ao carregar resultado:', erro)
      return null
    } finally {
      setCarregando(false)
    }
  }

  // seleciona uma opcao diferente
  const selecionarOpcao = (opcao) => {
    setOpcaoSelecionada(opcao)
  }

  // limpa resultado
  const limparResultado = async () => {
    try {
      await AsyncStorage.removeItem('@upae:resultado')
      setResultado(null)
      setOpcaoSelecionada(null)
    } catch (erro) {
      console.log('erro ao limpar resultado:', erro)
    }
  }

  // gera protocolo unico
  const gerarProtocolo = () => {
    return 'PE-' + Date.now().toString().slice(-8)
  }

  // formata data do agendamento
  const calcularDataAgendamento = (diasEspera) => {
    const data = new Date()
    data.setDate(data.getDate() + diasEspera)
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <ContextoResultado.Provider
      value={{
        resultado,
        opcaoSelecionada,
        carregando,
        salvarResultado,
        carregarResultado,
        selecionarOpcao,
        limparResultado,
        gerarProtocolo,
        calcularDataAgendamento,
      }}
    >
      {children}
    </ContextoResultado.Provider>
  )
}

// hook para usar o contexto
export const useResultado = () => {
  const contexto = useContext(ContextoResultado)
  if (!contexto) {
    throw new Error('useResultado deve ser usado dentro de ProvedorResultado')
  }
  return contexto
}
