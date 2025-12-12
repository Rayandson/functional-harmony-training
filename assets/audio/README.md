# Assets de Áudio

Esta pasta contém os arquivos de áudio para o quiz de harmonia funcional.

## Estrutura

```
assets/audio/
├── C/
│   ├── I.mp3      - Acorde de I grau (Tônica) em Dó Maior
│   ├── II.mp3     - Acorde de II grau (Supertônica) em Dó Maior
│   ├── III.mp3    - Acorde de III grau (Mediante) em Dó Maior
│   ├── IV.mp3     - Acorde de IV grau (Subdominante) em Dó Maior
│   ├── V.mp3      - Acorde de V grau (Dominante) em Dó Maior
│   ├── VI.mp3     - Acorde de VI grau (Superdominante) em Dó Maior
│   ├── VII.mp3    - Acorde de VII grau (Sensible) em Dó Maior
│   └── context.mp3 - Áudio de contexto do tom (escala ou acorde tônico)
```

## Como adicionar áudios

1. Coloque os arquivos de áudio na pasta correspondente ao tom (ex: `C/`)
2. Nomeie os arquivos conforme a estrutura acima
3. Os arquivos devem estar no formato MP3 ou outro formato suportado pelo expo-av
4. Para usar arquivos locais, atualize o `AudioService.ts` para usar `require()`:

```typescript
getAudioUri(key: MusicalKey, degree: MusicalDegree): string {
  const audioMap: Record<string, any> = {
    'C': {
      'I': require('@/assets/audio/C/I.mp3'),
      'II': require('@/assets/audio/C/II.mp3'),
      // ... etc
    }
  };
  return audioMap[key]?.[degree];
}
```

## Nota

Atualmente, o serviço está configurado para usar paths de string. Você precisará atualizar o `AudioService` para usar `require()` quando adicionar os arquivos de áudio reais.


