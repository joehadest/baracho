// Menu mobile toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Prevenir scroll do body quando menu está aberto
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}));

// Fechar menu ao clicar fora dele
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Funções de máscara para formatação de campos
function maskCNPJ(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

function maskPhone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
        .replace(/(-\d{4})\d+?$/, '$1');
}

// Aplicar máscaras quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Máscara para CNPJ
    const cnpjInput = document.querySelector('input[name="cnpj"]');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', (e) => {
            e.target.value = maskCNPJ(e.target.value);
        });
    }

    // Máscara para telefone
    const telefoneInput = document.querySelector('input[name="telefone"]');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    }
});

// Header scroll effect
let headerTicking = false;

function updateHeader() {
    const header = document.querySelector('.header');
    const scrolled = window.scrollY > 50;

    if (scrolled) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    headerTicking = false;
}

window.addEventListener('scroll', () => {
    if (!headerTicking) {
        requestAnimationFrame(updateHeader);
        headerTicking = true;
    }
});

// Smooth scrolling para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animação de entrada dos elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .stat-item, .contact-item, .budget-card, .about-text, .about-image');
    animatedElements.forEach(el => observer.observe(el));
});

// Formulário de contato
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Simular envio do formulário
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        // Simular delay de envio
        setTimeout(() => {
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Adicionar keyframes para animações de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Contador animado para estatísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Animar contadores quando visíveis
const statItems = document.querySelectorAll('.stat-item h3');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.textContent.replace(/\D/g, ''));
            animateCounter(entry.target, target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statItems.forEach(item => statObserver.observe(item));

// Efeito parallax suave no hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBanner = document.querySelector('.hero-banner');
    if (heroBanner) {
        const rate = scrolled * -0.5;
        heroBanner.style.transform = `translateY(${rate}px)`;
    }
});

// Tooltip para ícones de serviços
document.querySelectorAll('.service-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function () {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.querySelector('i').className.split(' ')[1].replace('fa-', '');
        tooltip.style.cssText = `
            position: absolute;
            background: var(--primary-color);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            white-space: nowrap;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
        `;

        this.appendChild(tooltip);
    });

    icon.addEventListener('mouseleave', function () {
        const tooltip = this.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});

// Lazy loading para imagens
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Validação de formulário em tempo real
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .budget-form input, .budget-form select, .budget-form textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function () {
        if (this.value.trim() === '') {
            this.style.borderColor = '#dc3545';
        } else {
            this.style.borderColor = '#28a745';
        }
    });

    input.addEventListener('input', function () {
        if (this.value.trim() !== '') {
            this.style.borderColor = '#28a745';
        }
    });
});

// Scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Hover effect para cards de serviços
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Typing effect para o título principal
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Aplicar typing effect ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
});

// Função para abrir WhatsApp com dados do formulário de orçamento
function openWhatsApp() {
    const form = document.querySelector('.budget-form-content');
    const name = form.querySelector('input[type="text"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const service = form.querySelector('select').value;
    const description = form.querySelector('textarea').value;

    if (!name || !phone || !service || !description) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }

    const message = `Olá! Gostaria de solicitar um orçamento para um projeto.

Nome: ${name}
Telefone: ${phone}
Tipo de Serviço: ${service}
Descrição: ${description}

Aguardo seu retorno!`;

    const whatsappUrl = `https://wa.me/5584999263052?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Função para enviar dados do formulário de contato para WhatsApp
function sendContactToWhatsApp() {
    const form = document.getElementById('contactForm');

    // Capturar dados da empresa
    const razaoSocial = form.querySelector('input[name="razaoSocial"]').value;
    const cnpj = form.querySelector('input[name="cnpj"]').value;
    const responsavel = form.querySelector('input[name="responsavel"]').value;
    const cargo = form.querySelector('input[name="cargo"]').value;

    // Capturar dados de contato
    const telefone = form.querySelector('input[name="telefone"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const localizacao = form.querySelector('input[name="localizacao"]').value;

    // Capturar serviços selecionados
    const servicosCheckboxes = form.querySelectorAll('input[name="servicos"]:checked');
    const servicos = Array.from(servicosCheckboxes).map(cb => cb.value);

    // Capturar detalhes do projeto
    const detalhes = form.querySelector('textarea[name="detalhes"]').value;
    const prazo = form.querySelector('input[name="prazo"]').value;

    // Validação básica
    if (!razaoSocial || !cnpj || !responsavel || !cargo || !telefone || !email || !localizacao || servicos.length === 0 || !detalhes || !prazo) {
        showNotification('Por favor, preencha todos os campos obrigatórios e selecione pelo menos um serviço.', 'error');
        return;
    }

    // Formatar a data
    const dataFormatada = new Date(prazo).toLocaleDateString('pt-BR');

    // Formatar serviços para a mensagem
    const servicosFormatados = servicos.map(servico => {
        const nomes = {
            'isolamento-termico': 'Isolamento Térmico',
            'isolamento-acustico': 'Isolamento Acústico',
            'protecao-passiva': 'Proteção Passiva',
            'alpinismo-industrial': 'Alpinismo Industrial',
            'pintura-industrial': 'Pintura Industrial',
            'controle-vibracao': 'Controle de Vibração'
        };
        return nomes[servico] || servico;
    }).map(s => `• ${s}`).join('\n');

    // Criar a mensagem formatada
    const message = `*NOVA SOLICITAÇÃO DE ORÇAMENTO* 📋

*EMPRESA:*
🏢 *Razão Social:* ${razaoSocial}
📄 *CNPJ:* ${cnpj}
👤 *Responsável:* ${responsavel}
💼 *Cargo:* ${cargo}

*CONTATOS:*
📱 *Telefone:* ${telefone}
📧 *E-mail:* ${email}
📍 *Localização:* ${localizacao}

*SERVIÇOS SOLICITADOS:*
${servicosFormatados}

*DETALHES DO PROJETO:*
${detalhes}

*PRAZO DESEJADO:*
📅 ${dataFormatada}

_Mensagem enviada automaticamente via formulário de orçamento_
_Baracho Soluções e Serviços_`;

    const whatsappUrl = `https://wa.me/5584999263052?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Limpar formulário após envio
    form.reset();
    showNotification('Dados enviados para WhatsApp! Aguarde nosso retorno.', 'success');
}

// Modal para projetos do portfólio
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', function () {
        const title = this.querySelector('h3').textContent;
        const description = this.querySelector('p').textContent;
        const image = this.querySelector('img').src;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-image">
                    <img src="${image}" alt="${title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 1rem;">
                </div>
                <h2 style="color: #ffffff; margin-bottom: 1rem;">${title}</h2>
                <p style="color: #cccccc; line-height: 1.6; margin-bottom: 2rem;">${description}</p>
                <div class="modal-actions">
                    <button class="btn btn-whatsapp" onclick="openWhatsApp()">
                        <i class="fab fa-whatsapp"></i>
                        Solicitar Orçamento
                    </button>
                    <button class="btn btn-primary" onclick="closeModal()">
                        Ver Mais Projetos
                    </button>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 20px;
        `;

        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: #111111;
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            width: 100%;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
            color: #ffffff;
        `;

        document.body.appendChild(modal);

        // Prevenir scroll do body quando modal está aberto
        document.body.style.overflow = 'hidden';

        // Fechar modal
        const closeModal = () => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        };

        // Função global para fechar modal
        window.closeModal = closeModal;

        modal.querySelector('.btn-primary').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    });
});

// Melhorar responsividade do menu mobile
function handleResize() {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

window.addEventListener('resize', handleResize);

// Adicionar suporte para gestos touch no mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe para cima - mostrar scroll to top
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            }
        } else {
            // Swipe para baixo - esconder scroll to top
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }
}

// Melhorar performance em dispositivos móveis
let ticking = false;

function updateOnScroll() {
    // Atualizar elementos baseados no scroll
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Adicionar suporte para PWA (Progressive Web App)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Melhorar acessibilidade
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar atributos ARIA
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });

    // Melhorar navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
});

// Adicionar suporte para modo escuro (futuro)
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function handleColorSchemeChange(e) {
    if (e.matches) {
        // Modo escuro
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        // Modo claro
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

prefersDarkScheme.addListener(handleColorSchemeChange);
handleColorSchemeChange(prefersDarkScheme); 