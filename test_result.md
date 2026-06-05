#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Aplicar 4 alterações no app Alfakids:
  1. Adicionar PDF "Caderno da Leitura" como primeiro item da aba Recursos
  2. Renomear aba "Recursos" para "Bônus" e exibir todos itens como "BÔNUS N - Título"
     - Caderno da Leitura = BÔNUS 1, Lancheira = BÔNUS 2, resto sequencial
  3. Trocar link do app Desenho de colorifypro.lovable.app para colorifypro.lovable.app/membro
  4. Tela inicial: remover botão "VER PLANOS", mantendo só ENTRAR
  5. Ao clicar ENTRAR: pop-up "como instalar" deve aparecer automaticamente

backend:
  - task: "Resources endpoint - NOVA estrutura agrupada (6 grupos de bônus com múltiplos PDFs)"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: true
          agent: "main"
          comment: "Seed forçado a cada startup, agora retorna 19 itens todos category=bonus com campo bonus_number. Caderno da Leitura é BÔNUS 1, Lancheira é BÔNUS 2. Validado via curl, retorna ordem correta."
        - working: true
          agent: "testing"
          comment: "VALIDADO (estrutura flat de 19 itens) via /app/backend_test.py contra https://pedagogy-music-hub.preview.emergentagent.com/api. 40/40 testes passaram."
        - working: true
          agent: "main"
          comment: "Refatorado para estrutura AGRUPADA: agora cada documento é um grupo de bônus com array `items`. Total: 6 grupos com 19 PDFs distribuídos. Log de startup: 'Seeded 6 bonus groups with 19 PDFs total'."
        - working: true
          agent: "testing"
          comment: "VALIDADO via /app/backend_test.py contra https://pedagogy-music-hub.preview.emergentagent.com/api — 117/117 asserções passaram. CRÍTICO /api/content/resources: retorna EXATAMENTE 6 documentos (grupos); cada doc tem id, bonus_number (int), bonus_title (string), items (list), order, category='bonus'; bonus_number ordenado ascendente [1,2,3,4,5,6]; cada item dentro de items tem title e pdf_url não vazios. Validação grupo a grupo: BÔNUS 1 ('Caderno da Leitura', 1 item: 'Caderno da Leitura'); BÔNUS 2 ('Lancheira', 11 items); BÔNUS 3 ('Entendendo o Autismo', 3 items: ['Entendendo o Autismo','Atividades de Estimulação Cognitiva','Desenvolvendo o Potencial']); BÔNUS 4 ('Atividades Pedagógicas', 1 item: '+100 Atividades de Alfabetização'); BÔNUS 5 ('Método Novo de Leitura', 2 items: ['Livro da Leitura - Sílabas Simples','Régua da Leitura']); BÔNUS 6 ('Palavras em Inglês', 1 item: 'Tabela de Palavras em Inglês'). Total agregado de PDFs em todos os grupos = 19 (correto). Re-seed idempotente confirmado: após `sudo supervisorctl restart backend`, retorno continua com 6 grupos / 19 PDFs / bonus_numbers=[1..6] (sem duplicação). Regressão OK em todos os endpoints: GET /api/ (status=ok), POST /api/auth/login (premium/alfakids321 → JWT válido 3-segments; senha errada → 401), GET /api/auth/me (com bearer válido → 200 com name/email/mode; sem token → 401; token inválido → 401), GET /api/songs?category=infantil (52), gospel (33), /songs/{id} válido → 200 e {id} inválido → 404, /content/alphabetization (24 dias, dias ascendentes), /content/english (30 palavras, order ascendente)."

frontend:
  - task: "Tela inicial sem botão VER PLANOS"
    implemented: true
    working: true
    file: "/app/frontend/app/index.tsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "Removido botão view-plans-btn. Apenas login-btn permanece. HTML confirma."

  - task: "Pop-up de instalação automático ao entrar na tela de login"
    implemented: true
    working: true
    file: "/app/frontend/app/login.tsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "Estado showInstall inicia em true. Pop-up abre automaticamente. Botão Entendi/X fecha. Botão INSTALAR APLICATIVO continua disponível abaixo do CONTINUAR."

  - task: "Link do App Desenho trocado para /membro"
    implemented: true
    working: true
    file: "/app/frontend/app/(tabs)/desenho.tsx"
    stuck_count: 0
    priority: "low"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "COLORIFY_URL trocada de https://colorifypro.lovable.app/ para https://colorifypro.lovable.app/membro"

  - task: "Aba Recursos renomeada para Bônus + lista numerada"
    implemented: true
    working: true
    file: "/app/frontend/app/(tabs)/recursos.tsx, _layout.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: true
          agent: "main"
          comment: "Tab title trocado para Bônus, ícone gift. Lista única sem agrupamento por categoria. Cada item mostra label BÔNUS N acima do título, ordenado por bonus_number."

metadata:
  created_by: "main_agent"
  version: "1.1"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: |
        Apliquei 4 alterações solicitadas pelo usuário no app Alfakids:
        1) Backend (server.py): Resources collection re-seedada com 19 bônus. Caderno da Leitura é BÔNUS 1 (PDF novo enviado pelo usuário), Lancheira é BÔNUS 2. Todos têm category=bonus e bonus_number.
        2) Frontend (recursos.tsx): Reescrito - lista única ordenada por bonus_number, sem agrupamento. Cada card mostra "BÔNUS N" acima do título.
        3) Frontend (_layout.tsx): Tab "Recursos" renomeada para "Bônus" (ícone gift).
        4) Frontend (desenho.tsx): COLORIFY_URL atualizada para /membro.
        5) Frontend (index.tsx): Botão VER PLANOS removido da tela inicial. Apenas ENTRAR permanece.
        6) Frontend (login.tsx): showInstall=true por padrão. Pop-up abre automático ao chegar na tela de login. Botão INSTALAR APLICATIVO permanece visível abaixo do CONTINUAR para reabrir.
        
        Por favor teste o endpoint GET /api/content/resources e verifique:
        - Retorna exatamente 19 itens
        - Todos com category="bonus"
        - Campo bonus_number existe em todos (1 a 19)
        - Item bonus_number=1 tem title "Caderno da Leitura"
        - Item bonus_number=2 tem title "Lancheira"
        - Ordem retornada é por bonus_number ascendente
        - Endpoints anteriores (/songs, /content/alphabetization, /content/english, /auth/login, /auth/me) continuam funcionando normalmente.
    - agent: "testing"
      message: |
        Backend testing completo via /app/backend_test.py — 40/40 testes passaram contra https://pedagogy-music-hub.preview.emergentagent.com/api.
        
        CRÍTICO — /api/content/resources OK:
        - Retorna exatamente 19 itens
        - Todos category='bonus', nenhum item com categorias legadas (pedagogico/autismo/lancheira)
        - bonus_number são inteiros 1..19 sem duplicação
        - Ordem retornada estritamente ascendente: [1,2,...,19]
        - bonus_number=1 -> title='Caderno da Leitura', pdf_url contém 'CADERNO-DE-LEITURA'
        - bonus_number=2 -> title='Lancheira'
        - Todos pdf_url são strings HTTPS não vazias
        
        Re-seed idempotente OK: após `sudo supervisorctl restart backend`, GET /api/content/resources continua retornando 19 itens (logs confirmam "Seeded 19 bonus resources" sem duplicação).
        
        Regressão OK em todos os endpoints anteriores:
        - GET /api/ -> {status: ok}
        - POST /api/auth/login (premium, alfakids321) -> token JWT válido (3-segments, mode=premium)
        - POST /api/auth/login com senha errada -> 401
        - GET /api/auth/me sem token -> 401, com token válido -> 200 com {name,email,mode}, token inválido -> 401
        - GET /api/songs?category=infantil -> 52 músicas
        - GET /api/songs?category=gospel -> 33 músicas
        - GET /api/songs/{id} -> detalhe correto; /songs/{invalid} -> 404
        - GET /api/content/alphabetization -> 24 dias ordenados ascendente
        - GET /api/content/english -> 30 palavras ordenadas
        
        Nenhuma issue crítica encontrada. Backend está pronto.
    - agent: "testing"
      message: |
        Re-teste após refator da estrutura agrupada do /api/content/resources — 117/117 asserções passaram via /app/backend_test.py contra https://pedagogy-music-hub.preview.emergentagent.com/api.

        CRÍTICO — /api/content/resources (NOVA estrutura agrupada) OK:
        - Retorna EXATAMENTE 6 documentos (grupos), não mais 19 itens flat
        - Cada doc contém: id, bonus_number (int), bonus_title (string não vazia), items (list), order, category='bonus'
        - bonus_number ordenado ascendente: [1, 2, 3, 4, 5, 6]
        - Cada item dentro de items tem title e pdf_url (strings não vazias)
        - BÔNUS 1 ('Caderno da Leitura') -> 1 item: ['Caderno da Leitura']
        - BÔNUS 2 ('Lancheira') -> 11 items
        - BÔNUS 3 ('Entendendo o Autismo') -> 3 items: ['Entendendo o Autismo', 'Atividades de Estimulação Cognitiva', 'Desenvolvendo o Potencial']
        - BÔNUS 4 ('Atividades Pedagógicas') -> 1 item: ['+100 Atividades de Alfabetização']
        - BÔNUS 5 ('Método Novo de Leitura') -> 2 items: ['Livro da Leitura - Sílabas Simples', 'Régua da Leitura']
        - BÔNUS 6 ('Palavras em Inglês') -> 1 item: ['Tabela de Palavras em Inglês']
        - Total de PDFs somando todos os grupos = 19 (correto)

        Re-seed idempotente OK: após `sudo supervisorctl restart backend`, GET /api/content/resources continua retornando 6 grupos / 19 PDFs / bonus_numbers=[1..6] (log "Seeded 6 bonus groups with 19 PDFs total").

        Regressão OK em todos os endpoints anteriores:
        - GET /api/ -> {status: ok}
        - POST /api/auth/login (premium, alfakids321) -> token JWT válido (3-segments, mode=premium); senha errada -> 401
        - GET /api/auth/me com bearer válido -> 200 {name,email,mode}; sem token -> 401; token inválido -> 401
        - GET /api/songs?category=infantil -> 52 músicas; gospel -> 33
        - GET /api/songs/{id} válido -> 200 com id correto; /songs/{invalid} -> 404
        - GET /api/content/alphabetization -> 24 dias com day ascendente
        - GET /api/content/english -> 30 palavras com order ascendente

        Nenhuma issue crítica encontrada. Backend pronto.
