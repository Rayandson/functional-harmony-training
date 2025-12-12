# Harmonia Funcional App

App React Native + Tailwind para treinar percepção harmônica dos graus na harmonia funcional.

## Estrutura do Projeto

O projeto segue princípios de Clean Code e SOLID:

### Arquitetura

```
├── app/                    # Rotas (Expo Router)
│   ├── index.tsx          # Tela inicial (redireciona)
│   ├── welcome.tsx        # Tela de boas-vindas (pede nome)
│   ├── menu.tsx           # Menu principal
│   ├── select-key.tsx     # Seleção de tom
│   ├── context.tsx        # Contexto do tom (toca áudio)
│   ├── quiz.tsx           # Tela do quiz
│   └── result.tsx          # Resultado do quiz
├── components/
│   └── quiz/              # Componentes do quiz
│       ├── AudioPlayer.tsx
│       ├── DegreeButton.tsx
│       └── ProgressBar.tsx
├── services/               # Lógica de negócio (SOLID)
│   ├── AudioService.ts    # Gerenciamento de áudio
│   ├── QuizService.ts     # Lógica do quiz
│   └── UserService.ts     # Gerenciamento de usuário
├── hooks/                 # Hooks customizados
│   ├── useAudio.ts
│   ├── useQuiz.ts
│   └── useUser.ts
├── types/                 # Tipos TypeScript
│   └── index.ts
├── constants/             # Constantes
│   ├── music.ts
│   └── storage.ts
└── utils/                 # Utilitários
    └── id.ts
```

## Funcionalidades

### 1. Autenticação Simplificada
- Não requer login/cadastro tradicional
- Apenas pede o nome do usuário na primeira vez
- Dados salvos localmente usando MMKV (react-native-mmkv)

### 2. Menu Principal
- Lista de modalidades do quiz
- Inicialmente: "Treinar Graus"

### 3. Seleção de Tom
- Escolha do tom (inicialmente apenas C - Dó Maior)
- Fácil expansão para outros tons

### 4. Contexto do Tom
- Toca áudio de contexto antes do quiz
- Permite ao usuário se familiarizar com o tom
- Botão para iniciar o quiz após ouvir

### 5. Quiz
- 10 perguntas aleatórias
- Cada pergunta toca um acorde
- Usuário identifica o grau funcional
- Feedback imediato (correto/incorreto)
- Barra de progresso

### 6. Resultado
- Mostra pontuação final
- Percentual de acertos
- Opção de tentar novamente
- Voltar ao menu

## Como Adicionar Áudios

1. Coloque os arquivos de áudio em `assets/audio/C/`:
   - `I.mp3` - Acorde de I grau
   - `II.mp3` - Acorde de II grau
   - `III.mp3` - Acorde de III grau
   - `IV.mp3` - Acorde de IV grau
   - `V.mp3` - Acorde de V grau
   - `VI.mp3` - Acorde de VI grau
   - `VII.mp3` - Acorde de VII grau
   - `context.mp3` - Áudio de contexto do tom

2. Atualize o `AudioService.ts` para usar `require()`:

```typescript
getAudioUri(key: MusicalKey, degree: MusicalDegree): any {
  const audioMap: Record<string, Record<string, any>> = {
    'C': {
      'I': require('@/assets/audio/C/I.mp3'),
      'II': require('@/assets/audio/C/II.mp3'),
      'III': require('@/assets/audio/C/III.mp3'),
      'IV': require('@/assets/audio/C/IV.mp3'),
      'V': require('@/assets/audio/C/V.mp3'),
      'VI': require('@/assets/audio/C/VI.mp3'),
      'VII': require('@/assets/audio/C/VII.mp3'),
    }
  };
  return audioMap[key]?.[degree];
}

getKeyContextAudioUri(key: MusicalKey): any {
  const contextMap: Record<string, any> = {
    'C': require('@/assets/audio/C/context.mp3'),
  };
  return contextMap[key];
}
```

3. Atualize o `AudioPlayer.tsx` para lidar com `require()`:

```typescript
const source = typeof audioUri === 'object'
  ? audioUri
  : { uri: audioUri };
```

## Princípios Aplicados

### SOLID
- **Single Responsibility**: Cada serviço tem uma responsabilidade única
- **Open/Closed**: Fácil adicionar novos tons sem modificar código existente
- **Liskov Substitution**: Interfaces bem definidas
- **Interface Segregation**: Hooks específicos para cada funcionalidade
- **Dependency Inversion**: Dependências injetadas via hooks

### Clean Code
- Nomes descritivos
- Funções pequenas e focadas
- Separação de concerns
- Reutilização de componentes
- TypeScript para type safety

## Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **Expo Router** - Roteamento baseado em arquivos
- **NativeWind** - Tailwind CSS para React Native
- **Expo AV** - Reprodução de áudio
- **MMKV** - Storage local (mais rápido que AsyncStorage)
- **TypeScript** - Type safety
- **Lucide React Native** - Ícones

## Executar o Projeto

```bash
# Instalar dependências
npm install

# Executar no Android
npm run android

# Executar na Web
npm run dev

# Executar no Android com cache limpo
npm run dev:android
```

## Próximos Passos

- [ ] Adicionar mais tons (C#, D, D#, etc.)
- [ ] Adicionar mais modalidades de quiz
- [ ] Histórico de resultados
- [ ] Estatísticas de desempenho
- [ ] Diferentes dificuldades
- [ ] Modo de prática (sem pontuação)


