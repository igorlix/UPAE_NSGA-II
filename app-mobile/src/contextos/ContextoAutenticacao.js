import React, { createContext, useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CREDENCIAIS_TESTE } from '../configuracao/constantes'

// contexto de autenticacao
const ContextoAutenticacao = createContext({})

// provedor do contexto
export const ProvedorAutenticacao = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // verifica se usuario esta logado ao iniciar
  useEffect(() => {
    verificarAutenticacao()
  }, [])

  // verifica autenticacao salva
  const verificarAutenticacao = async () => {
    try {
      const usuarioSalvo = await AsyncStorage.getItem('@upae:usuario')
      if (usuarioSalvo) {
        setUsuario(JSON.parse(usuarioSalvo))
      }
    } catch (erro) {
      console.log('erro ao verificar autenticacao:', erro)
    } finally {
      setCarregando(false)
    }
  }

  // faz login do usuario
  const fazerLogin = async (email, senha) => {
    // valida credenciais (demo)
    if (email === CREDENCIAIS_TESTE.email && senha === CREDENCIAIS_TESTE.senha) {
      const dadosUsuario = {
        email,
        autenticado: true,
        dataLogin: new Date().toISOString(),
      }

      await AsyncStorage.setItem('@upae:usuario', JSON.stringify(dadosUsuario))
      setUsuario(dadosUsuario)
      return { sucesso: true }
    }

    return { sucesso: false, erro: 'Email ou senha incorretos' }
  }

  // faz logout do usuario
  const fazerLogout = async () => {
    try {
      await AsyncStorage.removeItem('@upae:usuario')
      setUsuario(null)
    } catch (erro) {
      console.log('erro ao fazer logout:', erro)
    }
  }

  // verifica se email deve ser lembrado
  const verificarEmailLembrado = async () => {
    try {
      const email = await AsyncStorage.getItem('@upae:emailLembrado')
      return email || ''
    } catch (erro) {
      return ''
    }
  }

  // salva email para lembrar
  const salvarEmailLembrado = async (email) => {
    try {
      await AsyncStorage.setItem('@upae:emailLembrado', email)
    } catch (erro) {
      console.log('erro ao salvar email:', erro)
    }
  }

  // remove email lembrado
  const removerEmailLembrado = async () => {
    try {
      await AsyncStorage.removeItem('@upae:emailLembrado')
    } catch (erro) {
      console.log('erro ao remover email:', erro)
    }
  }

  return (
    <ContextoAutenticacao.Provider
      value={{
        usuario,
        carregando,
        estaAutenticado: !!usuario,
        fazerLogin,
        fazerLogout,
        verificarEmailLembrado,
        salvarEmailLembrado,
        removerEmailLembrado,
      }}
    >
      {children}
    </ContextoAutenticacao.Provider>
  )
}

// hook para usar o contexto
export const useAutenticacao = () => {
  const contexto = useContext(ContextoAutenticacao)
  if (!contexto) {
    throw new Error('useAutenticacao deve ser usado dentro de ProvedorAutenticacao')
  }
  return contexto
}
