
import { useNavigation, useRoute, RouteProp, } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, BottomTabParamList } from '@routes/types';
import { CategoriaDTO } from '@services/categoria.service';
import { LancamentoDTO } from '@services/lancamento.service';

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useAppNavigation() {
  const navigation = useNavigation<AppNavigationProp>();

  function goToLancamento(lancamento?: LancamentoDTO) {
    navigation.navigate('Tabs', {
      screen: 'Adicionar',
      params: { lancamento }
    })
  }

  function goToCategoriaForm(categoria?: CategoriaDTO) {
    navigation.navigate('CategoriaForm', { categoria })
  }

  function goToTransacao() {
    navigation.navigate('Tabs', {
      screen: 'Transações',
    });
  }

  return {
    ...navigation,
    goToCategoriaForm,
    goToTransacao,
    goToLancamento
  };
}

export function useAppParams<P extends RootStackParamList | BottomTabParamList,  T extends keyof P>() {
  const route = useRoute<RouteProp<P, T>>();
  return route.params;
}
