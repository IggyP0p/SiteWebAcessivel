document.addEventListener('DOMContentLoaded', function() {
    // Variáveis para controle de estado
    let leituraAtiva = false;
    let elementoAtual = null;
    let synthesis = window.speechSynthesis;
    let utterance = null;

    // Função para alternar alto contraste
    const contrasteBtn = document.getElementById('contraste');
    contrasteBtn.addEventListener('click', function() {
        document.body.classList.toggle('alto-contraste');
        
        // Salvar preferência no localStorage
        const isAltoContraste = document.body.classList.contains('alto-contraste');
        localStorage.setItem('altoContraste', isAltoContraste);
        
        // Feedback auditivo
        anunciar(isAltoContraste ? "Alto contraste ativado" : "Alto contraste desativado");
    });

    // Função para aumentar fonte
    const aumentarFonteBtn = document.getElementById('aumentar-fonte');
    aumentarFonteBtn.addEventListener('click', function() {
        if (document.body.classList.contains('fonte-maior')) {
            document.body.classList.remove('fonte-maior');
            document.body.classList.add('fonte-enorme');
            anunciar("Fonte aumentada para tamanho máximo");
        } else if (document.body.classList.contains('fonte-enorme')) {
            // Já está no tamanho máximo
            anunciar("A fonte já está no tamanho máximo");
        } else {
            document.body.classList.add('fonte-maior');
            anunciar("Fonte aumentada");
        }
        
        // Salvar preferência
        const tamanhoFonte = document.body.classList.contains('fonte-enorme') ? 'enorme' : 
                           document.body.classList.contains('fonte-maior') ? 'maior' : 'normal';
        localStorage.setItem('tamanhoFonte', tamanhoFonte);
    });

    // Função para diminuir fonte
    const diminuirFonteBtn = document.getElementById('diminuir-fonte');
    diminuirFonteBtn.addEventListener('click', function() {
        if (document.body.classList.contains('fonte-enorme')) {
            document.body.classList.remove('fonte-enorme');
            document.body.classList.add('fonte-maior');
            anunciar("Fonte diminuída para tamanho médio");
        } else if (document.body.classList.contains('fonte-maior')) {
            document.body.classList.remove('fonte-maior');
            anunciar("Fonte diminuída para tamanho normal");
        } else {
            anunciar("A fonte já está no tamanho normal");
        }
        
        // Salvar preferência
        const tamanhoFonte = document.body.classList.contains('fonte-enorme') ? 'enorme' : 
                           document.body.classList.contains('fonte-maior') ? 'maior' : 'normal';
        localStorage.setItem('tamanhoFonte', tamanhoFonte);
    });

    // Botão para ativar/desativar leitor de texto
    const leitorBtn = document.getElementById('leitor');
    leitorBtn.addEventListener('click', function() {
        leituraAtiva = !leituraAtiva;
        
        if (leituraAtiva) {
            leitorBtn.classList.add('ativo');
            anunciar("Leitor de texto ativado. Passe o mouse sobre um texto para ouvir.");
        } else {
            leitorBtn.classList.remove('ativo');
            if (synthesis.speaking) {
                synthesis.cancel();
            }
            anunciar("Leitor de texto desativado");
        }
        
        localStorage.setItem('leitorAtivo', leituraAtiva);
    });

    // Função para anunciar mensagens via voz
    function anunciar(texto) {
        if (synthesis.speaking) {
            synthesis.cancel();
        }
        utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        synthesis.speak(utterance);
    }

    // Adicionar eventos de foco e mouse para leitura de texto
    document.querySelectorAll('p, h1, h2, h3, a, figcaption').forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (leituraAtiva && element !== elementoAtual) {
                elementoAtual = element;
                anunciar(element.textContent);
            }
        });
        
        element.addEventListener('focus', function() {
            if (leituraAtiva && element !== elementoAtual) {
                elementoAtual = element;
                anunciar(element.textContent);
            }
        });
    });

    // Adicionar leitura para imagens quando focadas
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('mouseenter', function() {
            if (leituraAtiva) {
                anunciar(img.alt || "Imagem sem descrição");
            }
        });
        
        img.addEventListener('focus', function() {
            if (leituraAtiva) {
                anunciar(img.alt || "Imagem sem descrição");
            }
        });
    });

    // Restaurar preferências salvas
    function restaurarPreferencias() {
        if (localStorage.getItem('altoContraste') === 'true') {
            document.body.classList.add('alto-contraste');
        }
        
        const tamanhoFonte = localStorage.getItem('tamanhoFonte');
        if (tamanhoFonte === 'maior') {
            document.body.classList.add('fonte-maior');
        } else if (tamanhoFonte === 'enorme') {
            document.body.classList.add('fonte-enorme');
        }
        
        if (localStorage.getItem('leitorAtivo') === 'true') {
            leituraAtiva = true;
            leitorBtn.classList.add('ativo');
        }
    }
    
    // Verificar suporte para Speech Synthesis
    if (!('speechSynthesis' in window)) {
        leitorBtn.style.display = 'none';
        console.log("Navegador não suporta síntese de voz");
    }

    // Inicializar carregando preferências salvas
    restaurarPreferencias();
    
    // Adicionar atalhos de teclado para acessibilidade
    document.addEventListener('keydown', function(e) {
        // Alt + C: Toggle contraste
        if (e.altKey && e.key === 'c') {
            contrasteBtn.click();
            e.preventDefault();
        }
        
        // Alt + +: Aumentar fonte
        if (e.altKey && e.key === '+') {
            aumentarFonteBtn.click();
            e.preventDefault();
        }
        
        // Alt + -: Diminuir fonte
        if (e.altKey && e.key === '-') {
            diminuirFonteBtn.click();
            e.preventDefault();
        }
        
        // Alt + L: Ativar/desativar leitor
        if (e.altKey && e.key === 'l') {
            leitorBtn.click();
            e.preventDefault();
        }
    });

  /**
   * Adiciona estilos CSS específicos para melhorar o foco visual
   * Isso ajuda usuários que navegam com teclado a identificar o elemento selecionado
   */
  const style = document.createElement("style");
  style.textContent = `
    /* Estilo de foco para elementos interativos */
    a:focus, 
    button:focus, 
    input:focus, 
    textarea:focus, 
    [tabindex="0"]:focus {
      outline: 3px solid rgb(0, 252, 42) !important;
      outline-offset: 2px;
      box-shadow: 0 0 8px rgb(0, 252, 42) !important;
      transition: all 0.2s ease;
      padding: 0.1rem;
    }
    
    /* Estilo de foco para botões */
    button:focus, 
    .btn-enviar:focus, 
    .btn-limpar:focus,
    .btn-acessibilidade:focus,
    .btn-topo:focus {
      background-color: var(--quaternaria) !important;
      color: var(--branco) !important;
      transform: scale(1.05) !important;
      transition: all 0.2s ease;
    }
    
    /* Estilo de foco para links de navegação */
    nav a:focus h5 {
      color: var(--branco) !important;
      background-color: var(--quaternaria) !important;
      transform: translateY(-2px);
      transition: all 0.2s ease;
    }
    
    /* Estilo de foco para links em linhas */
    .links-row a:focus {
      color: var(--secundaria) !important;
      background-color: var(--quaternaria) !important;
      border-radius: 4px;
      transform: translateY(-2px);
    }
    
    /* Estilo de foco para ícones de redes sociais */
    .fa-brands:focus {
      color: var(--branco) !important;
      transform: scale(1.2);
    }
  `;
  document.head.appendChild(style);

    // Coleta todos os elementos focáveis para navegação por teclado
  const focusableElements = Array.from(
    document.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex="0"]'
    )
  ).filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0); // Filtra elementos visíveis

  /**
 * Adiciona suporte para navegação por teclado personalizada
 * Permite que usuários naveguem entre elementos usando as teclas de seta
 */
  document.addEventListener("keydown", function (e) {
    const activeElement = document.activeElement;
    const currentIndex = focusableElements.indexOf(activeElement);

    // Verifica se algum elemento focável está ativo
    if (currentIndex !== -1) {
      let nextIndex;

      // Determina qual ação tomar com base na tecla pressionada
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          // Se a tecla for seta para direita ou para baixo,
          // move o foco para o próximo elemento
          nextIndex = (currentIndex + 1) % focusableElements.length;
          e.preventDefault();
          focusableElements[nextIndex].focus();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          // Se a tecla for seta para esquerda ou para cima,
          // move o foco para o elemento anterior
          nextIndex =
            (currentIndex - 1 + focusableElements.length) %
            focusableElements.length;
          e.preventDefault();
          focusableElements[nextIndex].focus();
          break;
        case "Enter":
          // Se a tecla for Enter, simula um clique no elemento
          // exceto para campos de texto onde Enter tem outra função
          if (
            activeElement.tagName === "A" ||
            activeElement.tagName === "BUTTON"
          ) {
            e.preventDefault();
            activeElement.click();
          } else if (
            activeElement.tagName !== "INPUT" &&
            activeElement.tagName !== "TEXTAREA"
          ) {
            e.preventDefault();
            activeElement.click();
          }
          break;
      }
    }
  });
});