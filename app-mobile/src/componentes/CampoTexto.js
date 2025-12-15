import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { cores } from '../configuracao/cores'

// componente de campo de texto reutilizavel
const CampoTexto = ({
  rotulo,
  valor,
  aoMudar,
  placeholder = '',
  tipo = 'texto',
  icone = null,
  erro = null,
  obrigatorio = false,
  desabilitado = false,
  multilinha = false,
  linhas = 4,
  maxCaracteres = null,
  aoFocar = null,
  aoDesfocar = null,
  estilo = {},
  carregando = false,
}) => {
  const [focado, setFocado] = useState(false)
  const [senhaVisivel, setSenhaVisivel] = useState(false)

  // determina tipo de teclado
  const tipoTeclado = () => {
    switch (tipo) {
      case 'email': return 'email-address'
      case 'telefone': return 'phone-pad'
      case 'numero': return 'numeric'
      case 'cpf': return 'numeric'
      case 'cep': return 'numeric'
      default: return 'default'
    }
  }

  // manipula foco
  const handleFoco = () => {
    setFocado(true)
    if (aoFocar) aoFocar()
  }

  // manipula desfoco
  const handleDesfoco = () => {
    setFocado(false)
    if (aoDesfocar) aoDesfocar()
  }

  return (
    <View style={[estilos.container, estilo]}>
      {rotulo && (
        <Text style={estilos.rotulo}>
          {rotulo}
          {obrigatorio && <Text style={estilos.obrigatorio}> *</Text>}
        </Text>
      )}

      <View
        style={[
          estilos.containerInput,
          focado && estilos.inputFocado,
          erro && estilos.inputErro,
          desabilitado && estilos.inputDesabilitado,
        ]}
      >
        {icone && (
          <Ionicons
            name={icone}
            size={20}
            color={erro ? cores.erro : focado ? cores.primaria : cores.cinza}
            style={estilos.icone}
          />
        )}

        <TextInput
          style={[
            estilos.input,
            multilinha && { height: linhas * 20, textAlignVertical: 'top' },
          ]}
          value={valor}
          onChangeText={aoMudar}
          placeholder={placeholder}
          placeholderTextColor={cores.cinza}
          keyboardType={tipoTeclado()}
          secureTextEntry={tipo === 'senha' && !senhaVisivel}
          editable={!desabilitado}
          multiline={multilinha}
          numberOfLines={multilinha ? linhas : 1}
          maxLength={maxCaracteres}
          onFocus={handleFoco}
          onBlur={handleDesfoco}
          autoCapitalize={tipo === 'email' ? 'none' : 'sentences'}
          autoCorrect={tipo !== 'email' && tipo !== 'senha'}
        />

        {tipo === 'senha' && (
          <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
            <Ionicons
              name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={cores.cinza}
            />
          </TouchableOpacity>
        )}

        {carregando && (
          <ActivityIndicator size="small" color={cores.primaria} style={{ marginLeft: 8 }} />
        )}
      </View>

      {erro && <Text style={estilos.textoErro}>{erro}</Text>}

      {maxCaracteres && (
        <Text style={estilos.contador}>
          {valor?.length || 0}/{maxCaracteres}
        </Text>
      )}
    </View>
  )
}

const estilos = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '500',
    color: cores.cinzaEscuro,
    marginBottom: 6,
  },
  obrigatorio: {
    color: cores.erro,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.cinzaMedio,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  icone: {
    marginRight: 8,
  },
  input: {
    flex: 1,
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
  },
  textoErro: {
    fontSize: 12,
    color: cores.erro,
    marginTop: 4,
  },
  contador: {
    fontSize: 10,
    color: cores.cinza,
    textAlign: 'right',
    marginTop: 4,
  },
})

export default CampoTexto
