# Meu Fiananceiro

Este projeto foi desenvolvido utilizando **React Native** com **Expo CLI**.  
Abaixo estão as instruções para instalação, execução em ambiente de desenvolvimento e geração do **APK de teste**.

---

##  Pré-requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados na sua máquina:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)  
- [Yarn](https://yarnpkg.com/) ou npm  
- [Expo CLI](https://docs.expo.dev/get-started/installation/)  
- [Expo Go App](https://expo.dev/client) instalado no dispositivo físico (para testes rápidos)

---

##  Instalação

Clone o repositório e instale as dependências:

```bash
# Clonar o repositório
git clone https://github.com/WhebertonFialho/meu-financeiro.git

# Acessar o diretório do projeto
cd meu-financeiro

# Instalar dependências
yarn install
# ou
npm install

# Rodar o projeto
expo start

```
## Buid
```bash
## Configurar EAS 
npm install -g eas-cli
eas login
eas build:configure

# Gerar APK para testes
eas build -p android --profile preview

# Gerar build pra produção
eas build -p android --profile production
eas build -p ios --profile production



