import { View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import { useAppNavigation, useAppParams } from '@hooks/useAppNavigation';
import { colors } from "@theme/colors";
import { useCategoria } from "@hooks/useCategoria";
import { useTipoCategoria } from '@hooks/useTipoCategoria'
import { MyToastErro, MyToastSucesso, MyToastInformacao } from "@utils/MyToast";

import MyScreenHeader from "@components/MyScreenHeader";
import MyComboBox from '@components/MyComboBox';
import MyButton from "@components/MyButton";
import MyInput from "@components/MyIntup";
import MyButtonIcon from '../components/MyButtonIcon';
import { useMyMessage } from '../contexts/MyMessageProvider';
import { RootStackParamList } from "@routes/types";

export default function CategoriaFormScreen() {
  const nav = useAppNavigation();
  const { showMyMessage } = useMyMessage();
  
  const params = useAppParams<RootStackParamList, 'CategoriaForm'>();
  const categoria = params?.categoria;
  const isEdit = !!categoria;

  const { salvar, atualizar, remover } = useCategoria();
  const { listaTiposCategoria } = useTipoCategoria();

  const [ descricao, setDescricao ] = useState<string>('');
  const [ tipoCategoria, setTipoCategoria ] = useState<string>('');
  
  async function handleOnSubmit() {
    if (!descricao.trim()) {
      MyToastInformacao("Informe a Descrição.");
      return;
    }

    if (!tipoCategoria) {
      MyToastInformacao("Informe o Tipo da Categoria");
      return;
    }

    try {
      if (isEdit && categoria?.codigo) {
        await atualizar(categoria.codigo, {
          descricao,
          tipo: tipoCategoria, 
        });

        MyToastSucesso("Categoria atualizada.");
      } else {
        await salvar({
          descricao,
          tipo: tipoCategoria, 
        });

        MyToastSucesso("Categoria criada.");
      }

      nav.goBack();
    } catch (e: any) {
      MyToastErro(e.message ?? "Erro ao salvar.");
    } 
  }

  async function handleOnClickExcluir() {
    const excluir = async () => {
      try {
        const codigo = categoria?.codigo ?? 0; 
        await remover(codigo);

        MyToastSucesso("Categoria excluida.");
        nav.goBack();
      } catch(e){
        MyToastErro((e as Error).message);
      }
    } 

    showMyMessage(
      'Remover',
      'Deseja remover a Categoria?',
      [
          { text: 'Não' },
          { text: 'Sim', onPress: () => excluir() }
      ]
    );
  }

  useEffect(() => {
    if (categoria) {
      setDescricao(categoria.descricao);
      setTipoCategoria(categoria.tipo);
    }
  }, [categoria]);

  return (
    <View style={styles.container}>
      <MyScreenHeader
        title={isEdit ? "Editar Categoria" : "Nova Categoria"}
        showBackButton
        handleOnPress={() => nav.goBack()}
      />

      <View style={styles.content}>
        <MyInput
          label={'Descrição'}
          value={descricao}
          setValue={setDescricao}
        />
        <MyComboBox
          clearable
          label={'Tipo Categoria'}
          value={tipoCategoria}
          onChange={setTipoCategoria}
          options={
            listaTiposCategoria.map(tipo => ({
              value: tipo.codigo,
              label: tipo.descricao
            }))
          }
        />
      </View>

      <View style={styles.buttonFooter}>
        <MyButton
          color="green"
          title={isEdit ? "Salvar alterações" : "Criar categoria"}
          onPress={handleOnSubmit}
        />
        { !isEdit ? null :        
          <MyButtonIcon 
            iconName={'trash-outline'}
            color={'#FFF'}
            onPress={handleOnClickExcluir}
          />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColorDark,
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingTop: 25,
    width: "100%",
  },
  buttonFooter: {
    position: "absolute",
    flexDirection: 'row', 
    gap: 10,              
    bottom: 30,
    alignItems: 'flex-end',
    width: '90%',
  }
});
