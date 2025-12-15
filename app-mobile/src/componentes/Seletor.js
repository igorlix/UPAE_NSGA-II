import React, { useState, useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Platform, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { cores } from '../configuracao/cores'

// componente de seletor (dropdown) reutilizavel
const Seletor = ({
  rotulo,
  valor,
  aoMudar,
  opcoes = [],
  placeholder = 'Selecione...',
  erro = null,
  obrigatorio = false,
  desabilitado = false,
  permitirLimpar = false,
  comBusca = false,
  estilo = {},
}) => {
  const [modalVisivel, setModalVisivel] = useState(false)
  const [termoBusca, setTermoBusca] = useState('')

  // filtra opcoes pela busca
  const opcoesFiltradas = useMemo(() => {
    if (!comBusca || !termoBusca.trim()) return opcoes
    const termo = termoBusca.toLowerCase().trim()
    return opcoes.filter(op => {
      if (op.desabilitado) return true
      return op.rotulo.toLowerCase().includes(termo)
    })
  }, [opcoes, termoBusca, comBusca])

  // limpa busca ao fechar modal
  const fecharModal = () => {
    setModalVisivel(false)
    setTermoBusca('')
  }

  // encontra rotulo do valor selecionado
  const rotuloSelecionado = () => {
    const opcao = opcoes.find((o) => o.valor === valor)
    return opcao ? opcao.rotulo : null
  }

  // renderiza item da lista
  const renderizarItem = ({ item, index }) => {
    // se for item desabilitado (cabecalho de grupo)
    if (item.desabilitado) {
      return (
        <View style={estilos.cabecalhoGrupo}>
          <Text style={estilos.textoCabecalhoGrupo}>{item.rotulo}</Text>
        </View>
      )
    }

    return (
      <TouchableOpacity
        style={[
          estilos.itemLista,
          item.valor === valor && estilos.itemSelecionado,
        ]}
        onPress={() => {
          aoMudar(item.valor)
          fecharModal()
        }}
      >
        {item.cor && (
          <View style={[estilos.indicadorCor, { backgroundColor: item.cor }]} />
        )}
        <Text
          style={[
            estilos.textoItem,
            item.valor === valor && estilos.textoItemSelecionado,
          ]}
        >
          {item.rotulo}
        </Text>
        {item.valor === valor && (
          <Ionicons name="checkmark" size={20} color={cores.primaria} />
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[estilos.container, estilo]}>
      {rotulo && (
        <Text style={estilos.rotulo}>
          {rotulo}
          {obrigatorio && <Text style={estilos.obrigatorio}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[
          estilos.seletor,
          erro && estilos.seletorErro,
          desabilitado && estilos.seletorDesabilitado,
        ]}
        onPress={() => !desabilitado && setModalVisivel(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            estilos.textoSeletor,
            !rotuloSelecionado() && estilos.placeholder,
          ]}
        >
          {rotuloSelecionado() || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={desabilitado ? cores.cinza : cores.cinzaEscuro}
        />
      </TouchableOpacity>

      {erro && <Text style={estilos.textoErro}>{erro}</Text>}

      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <TouchableOpacity
          style={estilos.overlay}
          activeOpacity={1}
          onPress={fecharModal}
        >
          <View style={estilos.modalConteudo} onStartShouldSetResponder={() => true}>
            <View style={estilos.cabecalhoModal}>
              <Text style={estilos.tituloModal}>{rotulo || 'Selecione'}</Text>
              <TouchableOpacity onPress={fecharModal}>
                <Ionicons name="close" size={24} color={cores.cinzaEscuro} />
              </TouchableOpacity>
            </View>

            {comBusca && (
              <View style={estilos.containerBusca}>
                <Ionicons name="search" size={18} color={cores.cinza} />
                <TextInput
                  style={estilos.inputBusca}
                  placeholder="Buscar..."
                  placeholderTextColor={cores.cinza}
                  value={termoBusca}
                  onChangeText={setTermoBusca}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {termoBusca.length > 0 && (
                  <TouchableOpacity onPress={() => setTermoBusca('')}>
                    <Ionicons name="close-circle" size={18} color={cores.cinza} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {permitirLimpar && valor && (
              <TouchableOpacity
                style={estilos.botaoLimpar}
                onPress={() => {
                  aoMudar('')
                  fecharModal()
                }}
              >
                <Ionicons name="close-circle" size={18} color={cores.erro} />
                <Text style={estilos.textoLimpar}>Limpar selecao</Text>
              </TouchableOpacity>
            )}

            <FlatList
              data={opcoesFiltradas}
              keyExtractor={(item, index) => item.valor || `item-${index}`}
              renderItem={renderizarItem}
              style={estilos.lista}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  seletor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.cinzaMedio,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  seletorErro: {
    borderColor: cores.erro,
    backgroundColor: cores.erroClara,
  },
  seletorDesabilitado: {
    backgroundColor: cores.cinzaClaro,
  },
  textoSeletor: {
    flex: 1,
    fontSize: 16,
    color: cores.preto,
  },
  placeholder: {
    color: cores.cinza,
  },
  textoErro: {
    fontSize: 12,
    color: cores.erro,
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: cores.overlay,
    justifyContent: 'flex-end',
  },
  modalConteudo: {
    backgroundColor: cores.branco,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
    ...Platform.select({
      ios: {
        paddingBottom: 34,
      },
    }),
  },
  cabecalhoModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.cinzaClaro,
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.preto,
  },
  containerBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cinzaClaro,
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  inputBusca: {
    flex: 1,
    fontSize: 15,
    color: cores.cinzaEscuro,
    marginLeft: 8,
    paddingVertical: 0,
  },
  lista: {
    padding: 8,
  },
  itemLista: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  itemSelecionado: {
    backgroundColor: cores.primariaClara,
  },
  indicadorCor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  textoItem: {
    flex: 1,
    fontSize: 16,
    color: cores.cinzaEscuro,
  },
  textoItemSelecionado: {
    color: cores.primaria,
    fontWeight: '500',
  },
  cabecalhoGrupo: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: cores.cinzaClaro,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 4,
  },
  textoCabecalhoGrupo: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.cinza,
    textTransform: 'uppercase',
  },
  botaoLimpar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: cores.erroClara,
    borderRadius: 8,
  },
  textoLimpar: {
    fontSize: 14,
    color: cores.erro,
    marginLeft: 8,
    fontWeight: '500',
  },
})

export default Seletor
