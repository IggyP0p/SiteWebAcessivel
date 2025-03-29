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
});