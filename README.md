# Certify

## 📌 Sobre o Projeto

O Event Check-in App é um aplicativo móvel desenvolvido para facilitar a gestão de eventos, permitindo que organizadores criem eventos de diversos tipos, como palestras, TCCs, congressos e outros. O aplicativo oferece funcionalidades para cadastrar convidados, realizar check-ins e gerar certificados automaticamente.

## 🚀 Funcionalidades Principais

### 📅 Criação de Eventos

O organizador pode criar eventos personalizados e disponibilizar um link para que convidados se cadastrem.

### 🙋 Cadastro de Convidados

Os convidados podem se inscrever diretamente pelo link do evento ou serem cadastrados manualmente pelo organizador.

### ✅ Check-in dos Convidados

- **Via QR Code**: Um QR Code é gerado para cada convidado. Ao escaneá-lo, ele será redirecionado para um site onde deverá inserir o código recebido por e-mail para confirmar o check-in.
- **Manual pelo Organizador**: O organizador pode realizar o check-in de cada convidado manualmente ou escaneando o QR Code presente no convite.

### 📜 Geração e Envio de Certificados

Após o evento, o organizador pode enviar certificados personalizados para os convidados que realizaram check-in.

### 📝 Campos Dinâmicos no Formulário

O organizador pode cadastrar **campos personalizados** para o formulário de inscrição do evento. Esses campos podem ser de diferentes tipos, como texto, número ou data, e podem ser configurados como obrigatórios ou opcionais.

Os valores preenchidos pelos convidados **podem aparecer no certificado**, permitindo que cada certificado seja totalmente personalizado. Exemplos de campos dinâmicos:

- Matrícula do participante
- Data prevista para formatura
- Curso do participante

## 🛠 Tecnologias Utilizadas

### Backend (API)

- **.NET 7** - Utilizado para desenvolver a API.
- **MailKit** - Para envio de convites e certificados por e-mail.
- **DocX** - Para manipulação do template do certificado.
- **FreeSpire.Doc** - Para converter documentos do formato DOC/DOCX para PDF.
- **PostgreSQL** - Banco de dados utilizado por ser gratuito e robusto.
- **Cloudflare R2** - Armazenamento de arquivos gratuito utilizado para guardar templates e certificados.

### Frontend (Aplicativo)

- **React Native com Expo** - Desenvolvimento do aplicativo móvel.
- **Leitura de QR Code** - Implementado com bibliotecas auxiliares.
- **Sem bibliotecas visuais externas** - Todos os componentes foram desenvolvidos manualmente para maior personalização.

## 📖 Como Utilizar

### 🎯 Configuração da API

1. Clone o repositório:
   ```bash
   git clone https://github.com/FelipeValentim/Certify.git
   ```
2. Configure a conexão com o PostgreSQL.

3. Defina as credenciais do Cloudflare R2 para armazenamento.

4. Rode o servidor .NET 7 com:

```bash
  dotnet run
```

### 🔑 Credenciais de Teste
Para testar o aplicativo localmente, você pode utilizar o usuário padrão gerado pelos scripts de banco de dados (`Certify_PostgreSQL.sql`):
- **E-mail:** `teste@teste.com`
- **Senha:** `teste`

## 📱 Executando o Aplicativo

Certifique-se de ter o Node.js e o Expo CLI instalados.

1. Instale as dependências do projeto:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Execute o aplicativo:
   ```bash
   npx expo start
   ```

Escaneie o QR Code gerado para abrir o app no seu dispositivo ou emulador.

## 🔧 Melhorias Futuras

- 🔍 Implementar barra de pesquisa para eventos e convidados.
- ✏️ Adicionar funcionalidade para edição de eventos e convidados.
- 📩 Indicativo visual de quais convidados receberam convite e certificado.
- 🎓 Criação de templates pelo próprio aplicativo (ou pela web no lado do servidor).

## 🏗️ Este projeto foi desenvolvido para facilitar a gestão de eventos, tornando o processo de check-in e emissão de certificados mais eficiente e automatizado.

🚀 Contribuições são bem-vindas!
