/**
 * LÓGICA DO PAINEL ADMINISTRATIVO - MIX
 */

const STORAGE_KEY = 'mix_roleta_premios';
let prizes = [];

// Elementos DOM
const prizeForm = document.getElementById('prizeForm');
const prizeIdInput = document.getElementById('prizeId');
const prizeNameInput = document.getElementById('prizeName');
const prizeQtyInput = document.getElementById('prizeQty');
const prizeActiveInput = document.getElementById('prizeActive');
const formTitle = document.getElementById('formTitle');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const prizeTableBody = document.getElementById('prizeTableBody');

document.addEventListener('DOMContentLoaded', () => {
    loadPrizes();
    renderTable();

    prizeForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
});

function loadPrizes() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            prizes = JSON.parse(data);
        } catch (e) {
            prizes = [];
        }
    } else {
        prizes = [
            { id: '1', name: 'Squeeze Mix', qty: 5, active: true },
            { id: '2', name: 'Vale R$ 20', qty: 3, active: true },
            { id: '3', name: 'Caneta Mix', qty: 10, active: true },
            { id: '4', name: 'Brinde Surpresa', qty: 2, active: true }
        ];
        savePrizes();
    }
}

function savePrizes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prizes));
}

function renderTable() {
    prizeTableBody.innerHTML = '';

    if (prizes.length === 0) {
        prizeTableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: #888;">Nenhum prêmio personalizado cadastrado.</td>
            </tr>
        `;
        return;
    }

    prizes.forEach(prize => {
        const tr = document.createElement('tr');

        const statusBadge = prize.active 
            ? `<span class="badge badge-active">Ativo</span>` 
            : `<span class="badge badge-inactive">Inativo</span>`;

        tr.innerHTML = `
            <td><strong>${escapeHtml(prize.name)}</strong></td>
            <td>${prize.qty} un</td>
            <td>${statusBadge}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editPrize('${prize.id}')">Editar</button>
                <button class="action-btn btn-toggle" onclick="togglePrize('${prize.id}')">${prize.active ? 'Desativar' : 'Ativar'}</button>
                <button class="action-btn btn-delete" onclick="deletePrize('${prize.id}')">Excluir</button>
            </td>
        `;

        prizeTableBody.appendChild(tr);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    const id = prizeIdInput.value;
    const name = prizeNameInput.value.trim();
    const qty = parseInt(prizeQtyInput.value, 10);
    const active = prizeActiveInput.checked;

    if (!name || isNaN(qty)) return;

    if (id) {
        const prize = prizes.find(p => p.id === id);
        if (prize) {
            prize.name = name;
            prize.qty = qty;
            prize.active = active;
        }
    } else {
        const newPrize = {
            id: Date.now().toString(),
            name,
            qty,
            active
        };
        prizes.push(newPrize);
    }

    savePrizes();
    renderTable();
    resetForm();
}

window.editPrize = function(id) {
    const prize = prizes.find(p => p.id === id);
    if (!prize) return;

    prizeIdInput.value = prize.id;
    prizeNameInput.value = prize.name;
    prizeQtyInput.value = prize.qty;
    prizeActiveInput.checked = prize.active;

    formTitle.textContent = 'Editar Prêmio';
    saveBtn.textContent = 'SALVAR ALTERAÇÕES';
    cancelBtn.classList.remove('hidden');

    prizeNameInput.focus();
};

window.togglePrize = function(id) {
    const prize = prizes.find(p => p.id === id);
    if (prize) {
        prize.active = !prize.active;
        savePrizes();
        renderTable();
    }
};

window.deletePrize = function(id) {
    if (confirm('Tem certeza que deseja excluir este prêmio?')) {
        prizes = prizes.filter(p => p.id !== id);
        savePrizes();
        renderTable();
        if (prizeIdInput.value === id) {
            resetForm();
        }
    }
};

function resetForm() {
    prizeIdInput.value = '';
    prizeNameInput.value = '';
    prizeQtyInput.value = '5';
    prizeActiveInput.checked = true;

    formTitle.textContent = 'Cadastrar Novo Prêmio';
    saveBtn.textContent = 'ADICIONAR PRÊMIO';
    cancelBtn.classList.add('hidden');
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}