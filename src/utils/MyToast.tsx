import Toast from 'react-native-toast-message';

export function MyToastGravarSucesso() {
    Toast.show({
        type: 'success',
        text1: 'Gravar',
        text2: 'Registro salvo com sucesso.'
    });
}

export function MyToastGravarErro() {
    Toast.show({
        type: 'error',
        text1: 'Atenção',
        text2: 'Falha ao gravar.'
    });
}

export function MyToastSucesso(mensagem : string) {
    Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: mensagem
    });
}

export function MyToastErro(mensagem : string) {
    Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: mensagem
    });
}

export function MyToastInformacao(mensagem : string) {
    Toast.show({
        type: 'info',
        text1: 'Atenção',
        text2: mensagem
    });
}