# Task: Botão para Ativar Engines (TouchEngine)

## Information Gathered:
- index.html tem toggle 'Ativar Engine' só com log
- engine.js: TouchEngine para processar input touch/mouse (velocidades)
- engineBundles.js: eventos touch para #area/#info
- Remover referências C++/bridge conforme feedback

## Plan:
- Remover toggles Bridge Input e Input Bridge CPP do index.html
- Adicionar DIVs #engineArea e #engineInfo no painel principal
- Importar engine.js e engineBundles.js
- No toggle 'Ativar Engine' ON: mostrar area/info, carregar engines, iniciar loop RAF, adicionar eventos mouse+touch
- OFF: esconder, parar

## Dependent Files:
- index.html

## Steps:
- [x] Step 1: Criar/atualizar TODO.md com plano (feito)
- [ ] Step 2: Editar index.html - remover C++ bridges
- [ ] Step 3: Adicionar engine area/info DIVs e estilos
- [ ] Step 4: Importar scripts engine.js e engineBundles.js
- [ ] Step 5: Melhorar handler engineSwitch para ativar engines
- [ ] Step 6: Testar (abrir index.html, login, toggle ON → area visível, touch mostra velocidades)

## Followup:
- Executar `start index.html` ou servir com `npx serve .`

