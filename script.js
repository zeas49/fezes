// Configuração da API
const API_BASE = '/api';

// Estado da aplicação
let currentTab = 'alunos';
let alunos = [];
let cursos = [];

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    setupEventListeners();
    await loadInitialData();
    showTab('alunos');
}

// Configurar event listeners
function setupEventListeners() {
    // Navegação por abas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });

    // Formulário de matrícula
    document.getElementById('matriculaForm').addEventListener('submit', handleMatriculaSubmit);
    
    // Formulário de edição
    document.getElementById('editForm').addEventListener('submit', handleEditSubmit);
    
    // Fechar modal ao clicar fora
    document.getElementById('editModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditModal();
        }
    });
}

// Navegação por abas
function showTab(tabId) {
    // Atualizar botões
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Atualizar conteúdo
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    
    currentTab = tabId;
    
    // Carregar dados específicos da aba
    if (tabId === 'alunos') {
        refreshAlunos();
    } else if (tabId === 'cursos') {
        refreshCursos();
    } else if (tabId === 'matricula') {
        loadCursosForSelect();
    }
}

// Carregar dados iniciais
async function loadInitialData() {
    showLoading(true);
    try {
        await Promise.all([
            loadCursos(),
            loadAlunos(),
            loadEstatisticas()
        ]);
    } catch (error) {
        showToast('Erro ao carregar dados iniciais', 'error');
    } finally {
        showLoading(false);
    }
}

// Carregar estatísticas
async function loadEstatisticas() {
    try {
        const response = await fetch(`${API_BASE}/estatisticas`);
        if (!response.ok) throw new Error('Erro ao carregar estatísticas');
        
        const stats = await response.json();
        
        document.getElementById('totalAlunos').textContent = stats.total_alunos;
        document.getElementById('totalCursos').textContent = stats.total_cursos;
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Carregar cursos
async function loadCursos() {
    try {
        const response = await fetch(`${API_BASE}/cursos`);
        if (!response.ok) throw new Error('Erro ao carregar cursos');
        
        cursos = await response.json();
        renderCursos();
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        showToast('Erro ao carregar cursos', 'error');
    }
}

// Carregar alunos
async function loadAlunos() {
    try {
        const response = await fetch(`${API_BASE}/alunos`);
        if (!response.ok) throw new Error('Erro ao carregar alunos');
        
        alunos = await response.json();
        renderAlunos();
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        showToast('Erro ao carregar alunos', 'error');
    }
}

// Renderizar cursos
function renderCursos() {
    const container = document.getElementById('cursosGrid');
    
    if (cursos.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #718096;">
                <i class="fas fa-book-open" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <p style="font-size: 1.2rem;">Nenhum curso encontrado</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cursos.map(curso => `
        <div class="course-card">
            <h3><i class="fas fa-book"></i> ${curso.nome_curso}</h3>
            <p><strong>Duração:</strong> <span class="duration">${curso.duracao} meses</span></p>
            <p><strong>ID:</strong> ${curso.id}</p>
        </div>
    `).join('');
}

// Renderizar alunos
function renderAlunos() {
    const tbody = document.getElementById('alunosTableBody');
    
    if (alunos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #718096;">
                    <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 15px; opacity: 0.5; display: block;"></i>
                    Nenhum aluno matriculado
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = alunos.map(aluno => `
        <tr>
            <td>${aluno.id}</td>
            <td>${aluno.nome}</td>
            <td>${aluno.email}</td>
            <td>${aluno.curso_nome || 'Não definido'}</td>
            <td>${aluno.data_matricula ? formatDate(aluno.data_matricula) : 'N/A'}</td>
            <td>
                <button class="btn btn-primary btn-small" onclick="editAluno(${aluno.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteAluno(${aluno.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        </tr>
    `).join('');
}

// Carregar cursos para select
function loadCursosForSelect() {
    const selects = ['cursoAluno', 'editCurso'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        // Manter a primeira opção
        const firstOption = select.querySelector('option[value=""]');
        select.innerHTML = '';
        if (firstOption) {
            select.appendChild(firstOption);
        }
        
        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;
            option.textContent = curso.nome_curso;
            select.appendChild(option);
        });
    });
}

// Manipular submissão de matrícula
async function handleMatriculaSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        curso_id: parseInt(formData.get('curso_id'))
    };
    
    if (!data.nome || !data.email || !data.curso_id) {
        showToast('Todos os campos são obrigatórios', 'warning');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/alunos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.erro || 'Erro ao matricular aluno');
        }
        
        showToast('Aluno matriculado com sucesso!', 'success');
        e.target.reset();
        await loadAlunos();
        await loadEstatisticas();
        
        // Voltar para a aba de alunos
        showTab('alunos');
        
    } catch (error) {
        console.error('Erro ao matricular aluno:', error);
        showToast(error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Editar aluno
function editAluno(alunoId) {
    const aluno = alunos.find(a => a.id === alunoId);
    if (!aluno) {
        showToast('Aluno não encontrado', 'error');
        return;
    }
    
    // Preencher formulário de edição
    document.getElementById('editAlunoId').value = aluno.id;
    document.getElementById('editNome').value = aluno.nome;
    document.getElementById('editEmail').value = aluno.email;
    document.getElementById('editCurso').value = aluno.curso_id || '';
    
    // Mostrar modal
    document.getElementById('editModal').classList.add('show');
}

// Manipular submissão de edição
async function handleEditSubmit(e) {
    e.preventDefault();
    
    const alunoId = document.getElementById('editAlunoId').value;
    const formData = new FormData(e.target);
    const data = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        curso_id: formData.get('curso_id') ? parseInt(formData.get('curso_id')) : null
    };
    
    if (!data.nome || !data.email) {
        showToast('Nome e email são obrigatórios', 'warning');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/alunos/${alunoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.erro || 'Erro ao atualizar aluno');
        }
        
        showToast('Aluno atualizado com sucesso!', 'success');
        closeEditModal();
        await loadAlunos();
        
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        showToast(error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Fechar modal de edição
function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
}

// Excluir aluno
async function deleteAluno(alunoId) {
    const aluno = alunos.find(a => a.id === alunoId);
    if (!aluno) {
        showToast('Aluno não encontrado', 'error');
        return;
    }
    
    if (!confirm(`Tem certeza que deseja excluir o aluno "${aluno.nome}"?`)) {
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/alunos/${alunoId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.erro || 'Erro ao excluir aluno');
        }
        
        showToast('Aluno excluído com sucesso!', 'success');
        await loadAlunos();
        await loadEstatisticas();
        
    } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        showToast(error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Atualizar dados
async function refreshAlunos() {
    await loadAlunos();
    await loadEstatisticas();
    showToast('Lista de alunos atualizada', 'info');
}

async function refreshCursos() {
    await loadCursos();
    await loadEstatisticas();
    showToast('Lista de cursos atualizada', 'info');
}

// Utilitários
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    } catch (error) {
        return dateString;
    }
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

function getToastIcon(type) {
    switch (type) {
        case 'success':
            return 'fas fa-check-circle';
        case 'error':
            return 'fas fa-exclamation-circle';
        case 'warning':
            return 'fas fa-exclamation-triangle';
        case 'info':
            return 'fas fa-info-circle';
        default:
            return 'fas fa-info-circle';
    }
}

// Funções globais para os botões
window.refreshAlunos = refreshAlunos;
window.refreshCursos = refreshCursos;
window.editAluno = editAluno;
window.deleteAluno = deleteAluno;
window.closeEditModal = closeEditModal;

