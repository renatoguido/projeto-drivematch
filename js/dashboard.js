// ============================================
// DRIVEMARCH - SCRIPT COMPLETO (SEM LOGIN)
// ============================================

// ===== VARIÁVEIS GLOBAIS =====
let performanceChart = null;
let currentChartType = 'faturamento';

// ============================================
// 1. INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚗 DriveMarch · Sistema carregado');

    // Atualizar data e hora
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Inicializar gráficos
    initPerformanceChart();
    initReportCharts();
    initFinanceChart();

    // Inicializar eventos
    initEvents();

    // Inicializar busca de alunos
    initStudentSearch();

    // Animar elementos
    animateElements();

    // Atualizar notificações
    updateNotifications();

    console.log('✅ Sistema pronto!');
});

// ============================================
// 2. ATUALIZAR DATA E HORA
// ============================================
function updateDateTime() {
    const dateElements = document.querySelectorAll('.date-display, #currentDate');
    const timeElements = document.querySelectorAll('.time-display, #currentTime');

    const agora = new Date();
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    if (dateElements.length > 0) {
        const diaSemana = dias[agora.getDay()];
        const dia = agora.getDate();
        const mes = meses[agora.getMonth()];
        const ano = agora.getFullYear();
        const dataFormatada = `${diaSemana}, ${dia} de ${mes} de ${ano}`;
        dateElements.forEach(el => {
            el.textContent = dataFormatada;
        });
    }

    if (timeElements.length > 0) {
        const horas = String(agora.getHours()).padStart(2, '0');
        const minutos = String(agora.getMinutes()).padStart(2, '0');
        const segundos = String(agora.getSeconds()).padStart(2, '0');
        const horaFormatada = `${horas}:${minutos}:${segundos}`;
        timeElements.forEach(el => {
            el.textContent = horaFormatada;
        });
    }

    // Atualizar data na agenda
    const todayDateElements = document.querySelectorAll('.today-date-full, #todayDate');
    if (todayDateElements.length > 0) {
        const dia = String(agora.getDate()).padStart(2, '0');
        const mes = meses[agora.getMonth()];
        const ano = agora.getFullYear();
        todayDateElements.forEach(el => {
            el.textContent = `${dia} de ${mes} de ${ano}`;
        });
    }
}

// ============================================
// 3. INICIAR EVENTOS
// ============================================
function initEvents() {
    // Botão Suporte
    document.querySelectorAll('.btn-support-top, .btn-support').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            openSupport();
        });
    });

    // Links "Ver" nas aulas
    document.querySelectorAll('.link-ver').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const student = this.closest('li')?.querySelector('.student-full, .student')?.textContent || 'aula';
            showToast(`👁️ Detalhes da aula de ${student.trim()}`);
        });
    });

    // Botão "Nova aula"
    document.querySelectorAll('.btn-new-class-full, .btn-new-class').forEach(btn => {
        btn.addEventListener('click', function () {
            showToast('➕ Abrir formulário para nova aula');
        });
    });

    // Botão "Novo aluno"
    document.querySelectorAll('.btn-new-student-full, .btn-new-student').forEach(btn => {
        btn.addEventListener('click', function () {
            showToast('➕ Abrir formulário para cadastrar novo aluno');
        });
    });

    // Clique nos KPI cards
    document.querySelectorAll('.kpi-card-full, .kpi-card').forEach(card => {
        card.addEventListener('click', function () {
            const label = this.querySelector('.kpi-label-full, .kpi-label')?.textContent || 'indicador';
            const value = this.querySelector('.kpi-value-full, .kpi-value')?.textContent || '';
            showToast(`📊 ${label}: ${value}`);
        });
    });

    // Clique nas avaliações
    document.querySelectorAll('.review-list-full li, .review-list li').forEach(item => {
        item.addEventListener('click', function () {
            const student = this.querySelector('.review-student-full, .review-student')?.textContent || 'aluno';
            showToast(`⭐ Avaliação de ${student}`);
        });
    });

    // Clique nos cards financeiros
    document.querySelectorAll('.finance-kpi-card-full, .finance-kpi-card').forEach(card => {
        card.addEventListener('click', function () {
            const label = this.querySelector('.finance-kpi-label-full, .finance-kpi-label')?.textContent || 'indicador';
            const value = this.querySelector('.finance-kpi-value-full, .finance-kpi-value')?.textContent || '';
            showToast(`💰 ${label}: ${value}`);
        });
    });
}

// ============================================
// 4. BUSCA DE ALUNOS
// ============================================
function initStudentSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
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
// 5. FILTRAR ALUNOS
// ============================================
function filterStudents(filter) {
    const buttons = document.querySelectorAll('.filter-btn-full, .filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.filter-btn-full[data-filter="${filter}"]`)?.classList.add('active');

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
}

// ============================================
// 6. INICIAR GRÁFICO DE DESEMPENHO
// ============================================
function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Faturamento (R$)',
                data: [320, 450, 280, 520, 380, 680, 420],
                borderColor: '#22C55E',
                backgroundColor: 'rgba(34, 197, 94, 0.08)',
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
                        label: function (context) {
                            if (currentChartType === 'faturamento') {
                                return `R$ ${context.parsed.y}`;
                            }
                            return `${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#777777' },
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
// 7. ATUALIZAR GRÁFICO
// ============================================
function updateChart(type) {
    currentChartType = type;

    document.querySelectorAll('.btn-chart').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.btn-chart[data-chart="${type}"]`)?.classList.add('active');

    const dataSets = {
        'aulas': {
            label: 'Aulas realizadas',
            data: [3, 5, 2, 6, 4, 7, 5],
            color: '#3B82F6'
        },
        'faturamento': {
            label: 'Faturamento (R$)',
            data: [320, 450, 280, 520, 380, 680, 420],
            color: '#22C55E'
        },
        'alunos': {
            label: 'Novos alunos',
            data: [1, 3, 0, 2, 1, 4, 2],
            color: '#F59E0B'
        }
    };

    const dataSet = dataSets[type];
    if (!dataSet || !performanceChart) return;

    performanceChart.data.datasets[0].label = dataSet.label;
    performanceChart.data.datasets[0].data = dataSet.data;
    performanceChart.data.datasets[0].borderColor = dataSet.color;
    performanceChart.data.datasets[0].backgroundColor = dataSet.color + '14';
    performanceChart.data.datasets[0].pointBackgroundColor = dataSet.color;

    performanceChart.update();
}

// ============================================
// 8. FILTRAR AULAS
// ============================================
function filterAulas(filter) {
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.btn-filter[data-filter="${filter}"]`)?.classList.add('active');

    const items = document.querySelectorAll('.class-list-full li');
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split('T')[0];

    items.forEach(item => {
        const date = item.dataset.date;
        let show = false;

        if (filter === 'all') {
            show = true;
        } else if (filter === 'hoje') {
            show = date === hojeStr;
        } else if (filter === 'semana') {
            const itemDate = new Date(date);
            const diffDays = Math.floor((itemDate - hoje) / (1000 * 60 * 60 * 24));
            show = diffDays >= 0 && diffDays <= 7;
        }

        item.style.display = show ? '' : 'none';
    });
}

// ============================================
// 9. GRÁFICOS DOS RELATÓRIOS
// ============================================
function initReportCharts() {
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
                            label: function (context) {
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
                            label: function (context) {
                                return `R$ ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) { return `R$ ${value}`; },
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
// 10. GRÁFICO DO FINANCEIRO
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
                        label: function (context) {
                            return `R$ ${context.parsed.y.toLocaleString('pt-BR')}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return value >= 1000 ? `${value / 1000}k` : value;
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
// 11. ANIMAR ELEMENTOS
// ============================================
function animateElements() {
    document.querySelectorAll('.kpi-card-full').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// ============================================
// 12. ATUALIZAR NOTIFICAÇÕES
// ============================================
function updateNotifications() {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        const count = Math.floor(Math.random() * 5) + 1;
        badge.textContent = count;
        badge.classList.remove('hidden');
    }
}

// ============================================
// 13. MOSTRAR NOTIFICAÇÕES
// ============================================
function showNotifications() {
    const modal = document.getElementById('detailModal');
    if (!modal) return;

    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    const notifications = [
        { icon: 'fa-calendar-check', text: 'Aula de Juliana Oliveira confirmada para amanhã', time: '10:30' },
        { icon: 'fa-star', text: 'Nova avaliação de Lucas Andrade (4.8)', time: '09:15' },
        { icon: 'fa-coins', text: 'Pagamento de R$ 150,00 recebido de Beatriz Lima', time: '08:00' }
    ];

    title.textContent = '🔔 Notificações';
    body.innerHTML = `
        <div style="padding:4px 0;">
            ${notifications.map(n => `
                <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #1a1a1a;">
                    <div style="width:36px;height:36px;background:rgba(34,197,94,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#22C55E;">
                        <i class="fas ${n.icon}"></i>
                    </div>
                    <div style="flex:1;">
                        <div style="color:#ffffff;font-size:14px;">${n.text}</div>
                        <div style="color:#777777;font-size:12px;">${n.time}</div>
                    </div>
                </div>
            `).join('')}
            <button class="btn-settings primary" style="margin-top:16px;width:100%;justify-content:center;" onclick="closeDetailModal()">Fechar</button>
        </div>
    `;

    const badge = document.getElementById('notificationBadge');
    if (badge) badge.classList.add('hidden');

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// ============================================
// 14. ATUALIZAR DASHBOARD
// ============================================
function refreshDashboard() {
    const btn = document.querySelector('.btn-refresh-top');
    if (btn) btn.classList.add('spinning');

    showToast('🔄 Atualizando dados...');

    setTimeout(() => {
        const kpiAulas = document.getElementById('kpiAulasHoje');
        const kpiAlunos = document.getElementById('kpiAlunos');
        const kpiGanho = document.getElementById('kpiGanho');
        const kpiAvaliacao = document.getElementById('kpiAvaliacao');

        if (kpiAulas) {
            const novoValor = Math.floor(Math.random() * 8) + 2;
            kpiAulas.textContent = novoValor;
            animateValue(kpiAulas);
        }

        if (kpiAlunos) {
            const novoValor = Math.floor(Math.random() * 15) + 20;
            kpiAlunos.textContent = novoValor;
            animateValue(kpiAlunos);
        }

        if (kpiGanho) {
            const novoValor = (Math.random() * 2000 + 3000).toFixed(2);
            kpiGanho.textContent = `R$ ${novoValor.replace('.', ',')}`;
            animateValue(kpiGanho);
        }

        if (kpiAvaliacao) {
            const novoValor = (Math.random() * 0.4 + 4.6).toFixed(1);
            kpiAvaliacao.textContent = novoValor;
            animateValue(kpiAvaliacao);
        }

        updateNotifications();

        if (btn) btn.classList.remove('spinning');
        showToast('✅ Dados atualizados com sucesso!');
    }, 1500);
}

// ============================================
// 15. ANIMAR VALOR
// ============================================
function animateValue(element) {
    element.style.transition = 'transform 0.3s ease';
    element.style.transform = 'scale(1.2)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 300);
}

// ============================================
// 16. MUDAR PERÍODO FINANCEIRO
// ============================================
function changeFinancePeriod(period) {
    const periodNames = {
        'mes': 'Este mês',
        'trimestre': 'Último trimestre',
        'ano': 'Último ano'
    };
    showToast(`📊 Alterando período para: ${periodNames[period]}`);
}

// ============================================
// 17. FECHAR MODAL
// ============================================
function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ============================================
// 18. ABRIR SUPORTE
// ============================================
function openSupport() {
    showToast('🛟 Chamado aberto! Em breve responderemos.');
}

// ============================================
// 19. TOAST NOTIFICATION
// ============================================
function showToast(message) {
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
// 20. FECHAR MODAL COM ESC
// ============================================
window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeDetailModal();
    }
});

// ============================================
// 21. EXPORTAR FUNÇÕES
// ============================================
window.filterStudents = filterStudents;
window.filterAulas = filterAulas;
window.updateChart = updateChart;
window.refreshDashboard = refreshDashboard;
window.showNotifications = showNotifications;
window.showToast = showToast;
window.openSupport = openSupport;
window.closeDetailModal = closeDetailModal;
window.changeFinancePeriod = changeFinancePeriod;





// ============================================
// FUNÇÕES DO MODAL DE ALUNOS - DATAS 2026
// ============================================

// ===== 1. MOSTRAR DETALHES DO ALUNO =====
function showStudentDetail(name) {
    const modal = document.getElementById('studentModal');
    if (!modal) return;

    const title = document.getElementById('modalStudentTitle');
    const body = document.getElementById('modalStudentBody');

    title.innerHTML = `<i class="fas fa-user"></i> ${name}`;
    body.innerHTML = `
        <div class="detail-row"><span class="detail-label">Nome completo</span><span class="detail-value">${name}</span></div>
        <div class="detail-row"><span class="detail-label">Categoria</span><span class="detail-value">Categoria B</span></div>
        <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value" style="color:#22C55E;">Ativo</span></div>
        <div class="detail-row"><span class="detail-label">Total de aulas</span><span class="detail-value">12</span></div>
        <div class="detail-row"><span class="detail-label">Progresso</span><span class="detail-value">75%</span></div>
        <div class="detail-row"><span class="detail-label">Data de cadastro</span><span class="detail-value">15/03/2026</span></div>
        <div class="detail-row"><span class="detail-label">Telefone</span><span class="detail-value">(11) 99999-9999</span></div>
        <div class="detail-row" style="border-bottom:none;"><span class="detail-label">E-mail</span><span class="detail-value">${name.toLowerCase().replace(' ', '.')}@email.com</span></div>
        <button class="btn-close-modal" onclick="closeStudentModal()"><i class="fas fa-times"></i> Fechar</button>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ===== 2. MOSTRAR AULAS DO ALUNO =====
function showStudentClasses(name) {
    const modal = document.getElementById('studentModal');
    if (!modal) return;

    const title = document.getElementById('modalStudentTitle');
    const body = document.getElementById('modalStudentBody');

    title.innerHTML = `<i class="fas fa-calendar-alt"></i> Aulas de ${name}`;
    body.innerHTML = `
        <div class="detail-row"><span class="detail-label">Próxima aula</span><span class="detail-value">15/06/2026 - 08:00</span></div>
        <div class="detail-row"><span class="detail-label">Última aula</span><span class="detail-value">08/06/2026 - 10:00</span></div>
        <div class="detail-row"><span class="detail-label">Total de aulas</span><span class="detail-value">12</span></div>
        <div class="detail-row"><span class="detail-label">Aulas concluídas</span><span class="detail-value">9</span></div>
        <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Frequência</span><span class="detail-value" style="color:#22C55E;">95%</span></div>
        <button class="btn-close-modal" onclick="closeStudentModal()"><i class="fas fa-times"></i> Fechar</button>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ===== 3. MOSTRAR FINANCEIRO DO ALUNO =====
function showStudentFinance(name) {
    const modal = document.getElementById('studentModal');
    if (!modal) return;

    const title = document.getElementById('modalStudentTitle');
    const body = document.getElementById('modalStudentBody');

    title.innerHTML = `<i class="fas fa-coins"></i> Financeiro de ${name}`;
    body.innerHTML = `
        <div class="detail-row"><span class="detail-label">Total investido</span><span class="detail-value">R$ 1.800,00</span></div>
        <div class="detail-row"><span class="detail-label">Último pagamento</span><span class="detail-value">R$ 150,00 - 10/06/2026</span></div>
        <div class="detail-row"><span class="detail-label">Próximo vencimento</span><span class="detail-value">15/06/2026</span></div>
        <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value" style="color:#22C55E;">Em dia</span></div>
        <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Pacote</span><span class="detail-value">10 aulas + 2 extras</span></div>
        <button class="btn-close-modal" onclick="closeStudentModal()"><i class="fas fa-times"></i> Fechar</button>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ============================================
// 4. VER PERFIL COMPLETO
// ============================================
function viewFullProfile(name) {
    showToast(`👤 Abrindo perfil completo de ${name}`);
}

// ============================================
// 5. FECHAR MODAL DE ALUNOS
// ============================================
function closeStudentModal() {
    const modal = document.getElementById('studentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ============================================
// 6. FILTRAR ALUNOS
// ============================================
function filterStudents(filter) {
    const buttons = document.querySelectorAll('.filter-btn-full');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.filter-btn-full[data-filter="${filter}"]`)?.classList.add('active');

    const studentCards = document.querySelectorAll('.student-card-full');
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput?.value?.toLowerCase().trim() || '';

    studentCards.forEach(card => {
        const status = card.dataset.status;
        let show = true;

        if (filter === 'active' && status !== 'active') show = false;
        if (filter === 'inactive' && status !== 'inactive') show = false;

        if (show && searchTerm) {
            const name = card.querySelector('.student-name-full')?.textContent?.toLowerCase() || '';
            const category = card.querySelector('.student-category-full')?.textContent?.toLowerCase() || '';
            if (!name.includes(searchTerm) && !category.includes(searchTerm)) {
                show = false;
            }
        }

        card.style.display = show ? '' : 'none';
    });
}

// ============================================
// 7. BUSCA DE ALUNOS
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase().trim();
            const studentCards = document.querySelectorAll('.student-card-full');

            // Pegar o filtro ativo
            const activeFilter = document.querySelector('.filter-btn-full.active');
            const filter = activeFilter?.dataset?.filter || 'all';

            studentCards.forEach(card => {
                const status = card.dataset.status;
                const name = card.querySelector('.student-name-full')?.textContent?.toLowerCase() || '';
                const category = card.querySelector('.student-category-full')?.textContent?.toLowerCase() || '';

                let show = true;

                // Aplicar filtro de status
                if (filter === 'active' && status !== 'active') show = false;
                if (filter === 'inactive' && status !== 'inactive') show = false;

                // Aplicar busca
                if (show && searchTerm) {
                    if (!name.includes(searchTerm) && !category.includes(searchTerm)) {
                        show = false;
                    }
                }

                card.style.display = show ? '' : 'none';
            });
        });
    }
});

// ============================================
// 8. FECHAR MODAL CLICANDO FORA
// ============================================
window.addEventListener('click', function (event) {
    const studentModal = document.getElementById('studentModal');
    if (event.target === studentModal) {
        closeStudentModal();
    }
});

// ============================================
// 9. FECHAR MODAL COM ESC
// ============================================
window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeStudentModal();
        closeDetailModal();
    }
});

// ============================================
// 10. EXPORTAR FUNÇÕES
// ============================================
window.showStudentDetail = showStudentDetail;
window.showStudentClasses = showStudentClasses;
window.showStudentFinance = showStudentFinance;
window.viewFullProfile = viewFullProfile;
window.closeStudentModal = closeStudentModal;
window.filterStudents = filterStudents;


// Adicione estas funções ao final do arquivo dashboard.js

// ============================================
// RELATÓRIOS - FUNÇÕES PARA GRÁFICOS
// ============================================

// ===== 1. INICIALIZAR GRÁFICOS DOS RELATÓRIOS =====
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
                    borderWidth: 2,
                    pointBackgroundColor: '#22C55E',
                    pointBorderColor: '#000000',
                    pointBorderWidth: 1,
                    pointRadius: 3,
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
                            label: function (context) {
                                return `${context.parsed.y} aulas`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: '#777777',
                            maxTicksLimit: 5
                        },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: {
                            color: '#777777',
                            maxRotation: 30,
                            font: { size: 9 },
                            maxTicksLimit: 12
                        },
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
                cutout: '60%'
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
                    borderWidth: 1,
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
                            label: function (context) {
                                return `R$ ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                if (value >= 1000) return `R$ ${value / 1000}k`;
                                return `R$ ${value}`;
                            },
                            color: '#777777',
                            maxTicksLimit: 6
                        },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: {
                            color: '#777777',
                            maxTicksLimit: 12
                        },
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

// ===== 2. VERIFICAR E INICIALIZAR GRÁFICOS =====
document.addEventListener('DOMContentLoaded', function () {
    // Verificar se está na página de relatórios
    if (document.getElementById('evolutionChart') ||
        document.getElementById('categoryChart') ||
        document.getElementById('monthlyRevenueChart')) {
        setTimeout(initReportCharts, 100);
    }
});





// ============================================
// TOAST NOTIFICATION MELHORADA
// ============================================
function showToast(message) {
    // Remover toast existente
    const existingToast = document.querySelector('.toast-notification-dashboard');
    if (existingToast) {
        existingToast.remove();
    }

    // Determinar o ícone baseado na mensagem
    let icon = 'fa-check-circle';
    let color = '#22C55E';

    if (message.includes('⚠️') || message.includes('❌')) {
        icon = 'fa-exclamation-circle';
        color = '#ef4444';
    } else if (message.includes('📊') || message.includes('📈')) {
        icon = 'fa-chart-line';
        color = '#3B82F6';
    } else if (message.includes('👋') || message.includes('🔴')) {
        icon = 'fa-sign-out-alt';
        color = '#ef4444';
    } else if (message.includes('✅') || message.includes('✔')) {
        icon = 'fa-check-circle';
        color = '#22C55E';
    } else if (message.includes('🔄')) {
        icon = 'fa-sync-alt';
        color = '#F59E0B';
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification-dashboard';
    toast.innerHTML = `
        <i class="fas ${icon}" style="color:${color};"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Remover após 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}




// ============================================
// FUNÇÕES DO MODAL DE ALUNOS
// ============================================

// ===== 1. MOSTRAR DETALHES DO ALUNO =====
function showStudentDetail(name) {
    const modal = document.getElementById('studentModal');
    if (!modal) return;

    const title = document.getElementById('modalStudentTitle');
    const body = document.getElementById('modalStudentBody');

    title.innerHTML = `<i class="fas fa-user"></i> ${name}`;
    body.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Nome completo</span>
            <span class="detail-value">${name}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Categoria</span>
            <span class="detail-value">Categoria B</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value" style="color:#22C55E;">Ativo</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Total de aulas</span>
            <span class="detail-value">12</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Progresso</span>
            <span class="detail-value">75%</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Data de cadastro</span>
            <span class="detail-value">15/03/2024</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Telefone</span>
            <span class="detail-value">(11) 99999-9999</span>
        </div>
        <div class="detail-row" style="border-bottom:none;">
            <span class="detail-label">E-mail</span>
            <span class="detail-value">${name.toLowerCase().replace(' ', '.')}@email.com</span>
        </div>
        <button class="btn-close-modal" onclick="closeStudentModal()">
            <i class="fas fa-times"></i> Fechar
        </button>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ===== 2. MOSTRAR AULAS DO ALUNO =====
function showStudentClasses(name) {
    const modal = document.getElementById('studentModal');
    if (!modal) return;

    const title = document.getElementById('modalStudentTitle');
    const body = document.getElementById('modalStudentBody');

    title.innerHTML = `<i class="fas fa-calendar-alt"></i> Aulas de ${name}`;
    body.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Próxima aula</span>
            <span class="detail-value">15/06/2024 - 08:00</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Última aula</span>
            <span class="detail-value">08/06/2024 - 10:00</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Total de aulas</span>
            <span class="detail-value">12</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Aulas concluídas</span>
            <span class="detail-value">9</span>
        </div>
        <div class="detail-row" style="border-bottom:none;">
            <span class="detail-label">Frequência</span>
            <span class="detail-value" style="color:#22C55E;">95%</span>
        </div>
        <button class="btn-close-modal" onclick="closeStudentModal()">
            <i class="fas fa-times"></i> Fechar
        </button>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ===== 3. MOSTRAR FINANCEIRO DO ALUNO =====
function showStudentFinance(name) {
    const modal = document.getElementById('studentModal');
    if (!modal) return;

    const title = document.getElementById('modalStudentTitle');
    const body = document.getElementById('modalStudentBody');

    title.innerHTML = `<i class="fas fa-coins"></i> Financeiro de ${name}`;
    body.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Total investido</span>
            <span class="detail-value">R$ 1.800,00</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Último pagamento</span>
            <span class="detail-value">R$ 150,00 - 10/06/2024</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Próximo vencimento</span>
            <span class="detail-value">15/06/2024</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value" style="color:#22C55E;">Em dia</span>
        </div>
        <div class="detail-row" style="border-bottom:none;">
            <span class="detail-label">Pacote</span>
            <span class="detail-value">10 aulas + 2 extras</span>
        </div>
        <button class="btn-close-modal" onclick="closeStudentModal()">
            <i class="fas fa-times"></i> Fechar
        </button>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ===== 4. FECHAR MODAL DE ALUNOS =====
function closeStudentModal() {
    const modal = document.getElementById('studentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===== 5. FECHAR MODAL COM ESC =====
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeStudentModal();
        closeDetailModal();
        closeLogoutModal();
    }
});

// ===== 6. FECHAR MODAL CLICANDO FORA =====
window.addEventListener('click', function (event) {
    const modal = document.getElementById('studentModal');
    if (event.target === modal) {
        closeStudentModal();
    }
});












// ============================================
// DRIVEMARCH - BOTÃO SAIR
// ============================================

// ===== 1. ABRIR MODAL DE CONFIRMAÇÃO DE SAÍDA =====
function openLogoutModal() {
    let modal = document.getElementById('logoutModal');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'logoutModal';
        modal.className = 'modal-logout-dashboard';
        modal.innerHTML = `
            <div class="modal-overlay-dashboard">
                <div class="modal-content-dashboard">
                    <div class="modal-header-dashboard">
                        <h2><i class="fas fa-sign-out-alt" style="color:#ef4444;"></i> Sair do sistema</h2>
                        <button class="modal-close-dashboard" onclick="closeLogoutModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body-dashboard">
                        <div class="logout-icon-dashboard">
                            <i class="fas fa-question-circle"></i>
                        </div>
                        <h3>Tem certeza que deseja sair?</h3>
                        <p>Você será redirecionado para a página de login do DriveMatch.</p>
                        <div class="modal-actions-dashboard">
                            <button class="btn-cancel-dashboard" onclick="closeLogoutModal()">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                            <button class="btn-confirm-dashboard" onclick="confirmLogout()">
                                <i class="fas fa-sign-out-alt"></i> Sair
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// ===== 2. FECHAR MODAL DE CONFIRMAÇÃO DE SAÍDA =====
function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ===== 3. CONFIRMAR SAÍDA - REDIRECIONA PARA LOGIN =====
function confirmLogout() {
    closeLogoutModal();

    showToast('👋 Até logo! Redirecionando para o login...');

    localStorage.removeItem('driveMarchSession');

    setTimeout(function () {
        window.location.href = '../login.html';
    }, 1500);
}

// ===== 4. FECHAR MODAL CLICANDO FORA =====
document.addEventListener('click', function (event) {
    const modal = document.getElementById('logoutModal');
    if (modal && (event.target === modal || event.target === modal?.querySelector('.modal-overlay-dashboard'))) {
        closeLogoutModal();
    }
});

// ===== 5. FECHAR MODAL COM ESC =====
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeLogoutModal();
    }
});

// ===== 6. TOAST NOTIFICATION =====
function showToast(message) {
    const existingToast = document.querySelector('.toast-notification-dashboard');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification-dashboard';
    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        toast.style.transition = '0.3s';
        setTimeout(function () {
            toast.remove();
        }, 300);
    }, 3000);
}

// ===== 7. EXPORTAR FUNÇÕES =====
window.openLogoutModal = openLogoutModal;
window.closeLogoutModal = closeLogoutModal;
window.confirmLogout = confirmLogout;
window.showToast = showToast;

console.log('✅ Sistema de logout carregado com sucesso!');
console.log('📁 Redirecionando para: ../login.html');