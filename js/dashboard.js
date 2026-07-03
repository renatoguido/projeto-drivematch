document.addEventListener('DOMContentLoaded', function() {
    console.log('🚗 DriveMarch · Sistema carregado');
    
    // Atualizar data atual
    updateCurrentDate();
    
    // Inicializar gráficos se estiver na página de relatórios
    if (document.getElementById('evolutionChart')) {
        initReportCharts();
    }
    
    // Inicializar gráficos se estiver na página de financeiro
    if (document.getElementById('earningsChart')) {
        initFinanceChart();
    }
    
    // Inicializar eventos
    initEvents();
    
    // Inicializar busca de alunos
    initStudentSearch();
    
    // Inicializar filtros de alunos
    initStudentFilters();
    
    console.log('✅ Sistema pronto!');
});

// ============================================
// 2. ATUALIZAR DATA
// ============================================
function updateCurrentDate() {
    const dateElements = document.querySelectorAll('.date-display, #currentDate');
    if (dateElements.length === 0) return;
    
    const hoje = new Date();
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const diaSemana = dias[hoje.getDay()];
    const dia = hoje.getDate();
    const mes = meses[hoje.getMonth()];
    const ano = hoje.getFullYear();
    const dataFormatada = `${diaSemana}, ${dia} de ${mes} de ${ano}`;
    
    dateElements.forEach(el => {
        el.textContent = dataFormatada;
    });
    
    // Atualizar data na agenda
    const todayDateElements = document.querySelectorAll('.today-date-full, #todayDate');
    if (todayDateElements.length > 0) {
        const diaStr = String(dia).padStart(2, '0');
        const mesStr = String(hoje.getMonth() + 1).padStart(2, '0');
        const dataAgenda = `${diaStr} de ${mes} de ${ano}`;
        todayDateElements.forEach(el => {
            el.textContent = dataAgenda;
        });
    }
}

// ============================================
// 3. INICIAR EVENTOS
// ============================================
function initEvents() {
    // Botão Suporte
    document.querySelectorAll('.btn-support-top, .btn-support').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openSupport();
        });
    });
    
    // Botão Sair
    document.querySelectorAll('.btn-logout').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Tem certeza que deseja sair?')) {
                showToast('👋 Até logo!');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
        });
    });
    
    // Links "Ver" nas aulas
    document.querySelectorAll('.link-ver').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const student = this.closest('li')?.querySelector('.student-full, .student')?.textContent || 'aula';
            showToast(`👁️ Detalhes da aula de ${student.trim()}`);
        });
    });
    
    // Botão "Nova aula"
    document.querySelectorAll('.btn-new-class-full, .btn-new-class').forEach(btn => {
        btn.addEventListener('click', function() {
            showToast('➕ Abrir formulário para nova aula');
        });
    });
    
    // Botão "Novo aluno"
    document.querySelectorAll('.btn-new-student-full, .btn-new-student').forEach(btn => {
        btn.addEventListener('click', function() {
            showToast('➕ Abrir formulário para cadastrar novo aluno');
        });
    });
    
    // Botão "Ver todas" - movimentações
    document.querySelectorAll('.link-ver-all').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('📋 Mostrando todos os registros');
        });
    });
    
    // Clique nos KPI cards
    document.querySelectorAll('.kpi-card-full, .kpi-card').forEach(card => {
        card.addEventListener('click', function() {
            const label = this.querySelector('.kpi-label-full, .kpi-label')?.textContent || 'indicador';
            const value = this.querySelector('.kpi-value-full, .kpi-value')?.textContent || '';
            showToast(`📊 ${label}: ${value}`);
        });
    });
    
    // Clique nas avaliações
    document.querySelectorAll('.review-list-full li, .review-list li').forEach(item => {
        item.addEventListener('click', function() {
            const student = this.querySelector('.review-student-full, .review-student')?.textContent || 'aluno';
            showToast(`⭐ Avaliação de ${student}`);
        });
    });
    
    // Clique nos cards financeiros
    document.querySelectorAll('.finance-kpi-card-full, .finance-kpi-card').forEach(card => {
        card.addEventListener('click', function() {
            const label = this.querySelector('.finance-kpi-label-full, .finance-kpi-label')?.textContent || 'indicador';
            const value = this.querySelector('.finance-kpi-value-full, .finance-kpi-value')?.textContent || '';
            showToast(`💰 ${label}: ${value}`);
        });
    });
    
    // Clique no botão "Ver financeiro"
    document.querySelectorAll('.btn-finance-full, .btn-finance').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'financeiro.html';
        });
    });
    
    // Filtro de período nos relatórios
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const period = this.dataset.period;
            const periodNames = {
                'today': 'Hoje',
                '7': '7 dias',
                '30': '30 dias',
                'custom': 'Personalizado'
            };
            showToast(`📊 Filtrando por: ${periodNames[period] || period}`);
        });
    });
}

// ============================================
// 4. BUSCA DE ALUNOS
// ============================================
function initStudentSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const studentCards = document.querySelectorAll('.student-card-full, .student-card');
        
        studentCards.forEach(card => {
            const name = card.querySelector('.student-name-full, .student-name')?.textContent?.toLowerCase() || '';
            const category = card.querySelector('.student-category-full, .student-category')?.textContent?.toLowerCase() || '';
            const matches = name.includes(searchTerm) || category.includes(searchTerm);
            card.style.display = matches ? '' : 'none';
        });
    });
}

// ============================================
// 5. FILTROS DE ALUNOS
// ============================================
function initStudentFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn-full, .filter-btn');
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            const studentCards = document.querySelectorAll('.student-card-full, .student-card');
            const searchInput = document.getElementById('searchInput');
            const searchTerm = searchInput?.value?.toLowerCase().trim() || '';
            
            studentCards.forEach(card => {
                const status = card.dataset.status;
                let show = true;
                
                if (filter === 'active' && status !== 'active') show = false;
                if (filter === 'inactive' && status !== 'inactive') show = false;
                
                if (show && searchTerm) {
                    const name = card.querySelector('.student-name-full, .student-name')?.textContent?.toLowerCase() || '';
                    const category = card.querySelector('.student-category-full, .student-category')?.textContent?.toLowerCase() || '';
                    if (!name.includes(searchTerm) && !category.includes(searchTerm)) {
                        show = false;
                    }
                }
                
                card.style.display = show ? '' : 'none';
            });
        });
    });
}

// ============================================
// 6. GRÁFICOS DOS RELATÓRIOS
// ============================================
function initReportCharts() {
    // Gráfico de Evolução (Line)
    const ctx1 = document.getElementById('evolutionChart');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['01/06', '02/06', '03/06', '04/06', '05/06', '06/06', '07/06', '08/06', '09/06', '10/06', '11/06', '12/06'],
                datasets: [{
                    label: 'Aulas',
                    data: [1, 2, 1, 3, 2, 1, 0, 2, 3, 1, 2, 2],
                    borderColor: '#22C55E',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#22C55E',
                    pointBorderColor: '#000000',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} aulas`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: '#777777' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: { color: '#777777', maxRotation: 45, font: { size: 10 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // Gráfico de Categorias (Doughnut)
    const ctx2 = document.getElementById('categoryChart');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Categoria B', 'Categoria A', 'Categoria AB', 'Categoria D'],
                datasets: [{
                    data: [24, 12, 8, 4],
                    backgroundColor: ['#22C55E', '#3B82F6', '#F59E0B', '#8B5CF6'],
                    borderColor: '#000000',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                cutout: '65%'
            }
        });
    }
    
    // Gráfico de Receita Mensal (Bar)
    const ctx3 = document.getElementById('monthlyRevenueChart');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Receita (R$)',
                    data: [3200, 2800, 3500, 4200, 3900, 4680, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(34, 197, 94, 0.7)',
                    borderColor: '#22C55E',
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `R$ ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) { return `R$ ${value}`; },
                            color: '#777777'
                        },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: { color: '#777777' },
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

// ============================================
// 7. GRÁFICO DO FINANCEIRO
// ============================================
function initFinanceChart() {
    const ctx = document.getElementById('earningsChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['01/06', '08/06', '15/06', '22/06', '29/06'],
            datasets: [{
                label: 'Ganhos (R$)',
                data: [1200, 1800, 2800, 3800, 4680],
                borderColor: '#22C55E',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#22C55E',
                pointBorderColor: '#000000',
                pointBorderWidth: 2,
                pointRadius: 5,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `R$ ${context.parsed.y.toLocaleString('pt-BR')}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value >= 1000 ? `${value/1000}k` : value;
                        },
                        color: '#777777'
                    },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                x: {
                    ticks: { color: '#777777' },
                    grid: { display: false }
                }
            }
        }
    });
}

// ============================================
// 8. ABRIR SUPORTE
// ============================================
function openSupport() {
    showToast('🛟 Chamado aberto! Em breve responderemos.');
}

// ============================================
// 9. TOAST NOTIFICATION
// ============================================
function showToast(message) {
    // Remover toast existente
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        toast.style.transition = '0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// 10. EXPORTAR FUNÇÕES (para uso global)
// ============================================
window.showToast = showToast;
window.openSupport = openSupport;
window.updateCurrentDate = updateCurrentDate;