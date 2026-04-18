# alfakids - Diversão e Aprendizado

## Product Requirements Document

### Overview
App educativo infantil premium para crianças de 3-5 anos. Combina música interativa, alfabetização (método fônico em 30 dias), aprendizado de inglês e recursos pedagógicos.

### Brand
- **Nome**: alfakids / Diversão e Aprendizado
- **Paleta Principal**: #0D0D0D (preto), #BF9663 (dourado), #D97016 (laranja)
- **Paleta Login**: Roxo/Azul/Cyan da segunda logo
- **Fonte**: Montserrat
- **Mascote**: Criança sorrindo com celular na mão

### Estrutura de Acesso (3 Links)
1. **Link Free**: Apenas 3 músicas grátis (Aquarela, O Sapo Não Lava o Pé, Aleluia)
2. **Link Premium**: Tudo liberado exceto Alfabetização Interativa (senha: diversãoeaprendizado321)
3. **Link Alfa**: Alfabetização Interativa (senha: alfakids321)

### 4 Abas Principais
1. **Músicas**: 85+ músicas (Infantil + Gospel) com YouTube embed + instrumentos interativos
2. **Alfabetização**: Plano de 30 dias (método fônico) + playlist +100 vídeos
3. **Inglês**: Flashcards com palavras em inglês + tradução
4. **Recursos**: PDFs pedagógicos, Lancheira Kids, Autismo, Bônus + App Colorir

### Planos
- Vitalício: R$ 37,00 (pagamento único) → https://pay.cakto.com.br/aw2hie4_853925
- Mensal: R$ 27,00 → https://pay.cakto.com.br/dboxghv

### Features
- Dark mode toggle
- Animação de parabéns com fogos + pontuação + nome da criança
- TTS congratulations (OpenAI)
- Botão instalar app (PWA)
- YouTube embed com limite de 60 segundos
- Instrumentos interativos (toggle on/off)

### Technical Stack
- Frontend: Expo SDK 54 + React Native + Expo Router
- Backend: FastAPI + MongoDB + Motor
- TTS: OpenAI via emergentintegrations
- Auth: JWT com senhas fixas

### Links Externos
- App Colorir: https://colorifypro.lovable.app/
- Playlist YouTube: https://www.youtube.com/watch?v=WyA6GscP4DA&list=PLBU8yn5kXnNXF7Q5TrPGQqnfGQyQzNDdj
