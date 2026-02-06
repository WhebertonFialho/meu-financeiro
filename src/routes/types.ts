import { NavigatorScreenParams } from '@react-navigation/native';
import { CategoriaDTO } from '@services/categoria.service';
import { LancamentoDTO } from '@services/lancamento.service';

export type BottomTabParamList = {
  Principal: undefined;
  Transações: undefined;
  Adicionar: { lancamento?: LancamentoDTO};
  Categoria: undefined;
  Mais: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabParamList> | undefined;
  CategoriaForm: { categoria?: CategoriaDTO; } | undefined;
  BancoDados: undefined
};
