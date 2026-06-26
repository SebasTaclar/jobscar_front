<template>
  <div class="cesar-container">
    <header class="cesar-header">
      <div class="header-left">
        <button class="back-btn" @click="goBack">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <div class="header-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div>
          <h1>Cesar Olivos</h1>
          <p>Control de gastos personales y del hogar</p>
        </div>
      </div>
      <div class="header-right">
        <span class="date-badge">{{ currentDate }}</span>
      </div>
    </header>

    <main class="cesar-main">
      <!-- Resumen -->
      <section class="summary-section">
        <div class="summary-card">
          <div class="summary-icon home">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div class="summary-info">
            <p class="summary-value">{{ formatCurrency(totalCasa) }}</p>
            <p class="summary-label">Gastos Casa</p>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon person">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="summary-info">
            <p class="summary-value">{{ formatCurrency(totalCesar) }}</p>
            <p class="summary-label">Gastos Cesar</p>
          </div>
        </div>
        <div class="summary-card total">
          <div class="summary-icon total">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="summary-info">
            <p class="summary-value">{{ formatCurrency(totalGeneral) }}</p>
            <p class="summary-label">Total General</p>
          </div>
        </div>
      </section>

      <!-- Tabs de categorías -->
      <div class="category-tabs">
        <button class="category-tab" :class="{ active: activeCategory === 'casa' }" @click="activeCategory = 'casa'">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Gastos Casa
        </button>
        <button class="category-tab" :class="{ active: activeCategory === 'cesar' }" @click="activeCategory = 'cesar'">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Gastos Cesar
        </button>
      </div>

      <!-- Formulario para agregar gasto -->
      <section class="form-section">
        <h3>Agregar Gasto</h3>
        <form @submit.prevent="addExpense" class="expense-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre</label>
              <input v-model="newExpense.name" type="text" placeholder="Ej: Luz, Agua, Mercado..." required />
            </div>
            <div class="form-group">
              <label>Concepto</label>
              <input v-model="newExpense.concept" type="text" placeholder="Ej: Pago mensual..." required />
            </div>
            <div class="form-group">
              <label>Monto</label>
              <input v-model.number="newExpense.amount" type="number" step="0.01" min="0" placeholder="0.00" required />
            </div>
            <div class="form-group">
              <label>Cuenta</label>
              <select v-model="newExpense.account">
                <option value="Banco">Banco</option>
                <option value="Caja Menor">Caja Menor</option>
              </select>
            </div>
            <div class="form-group">
              <label>Observación</label>
              <input v-model="newExpense.observation" type="text" placeholder="Opcional..." />
            </div>
          </div>
          <button type="submit" class="btn-add" :disabled="isSaving">
            <svg v-if="!isSaving" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {{ isSaving ? 'Guardando...' : 'Agregar' }}
          </button>
        </form>
      </section>

      <!-- Lista de gastos -->
      <section class="expenses-section">
        <h3>{{ activeCategory === 'casa' ? 'Gastos del Hogar' : 'Gastos Personales' }}</h3>
        <div v-if="isLoading" class="empty-state">
          <p>Cargando gastos...</p>
        </div>
        <div v-else-if="filteredExpenses.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <p>No hay gastos registrados</p>
        </div>
        <div v-else class="expenses-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Concepto</th>
                <th>Monto</th>
                <th>Cuenta</th>
                <th>Fecha</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="expense in filteredExpenses" :key="expense.id">
                <td>{{ expense.name }}</td>
                <td>{{ expense.concept }}</td>
                <td class="amount">{{ formatCurrency(expense.amount) }}</td>
                <td>{{ expense.account }}</td>
                <td>{{ formatDate(expense.date) }}</td>
                <td>{{ expense.observation || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { moneyMovementService } from '@/services/api'

defineOptions({ name: 'CesarOlivosView' })

const router = useRouter()

interface CajaGasto {
  id: number
  date: string
  reference: string
  name: string
  concept: string
  movement: string
  amount: number
  account: string
  observation: string
}

const activeCategory = ref<'casa' | 'cesar'>('casa')
const expenses = ref<CajaGasto[]>([])
const currentDate = ref('')
const isLoading = ref(false)
const isSaving = ref(false)

const newExpense = ref({
  name: '',
  concept: '',
  amount: 0,
  account: 'Banco',
  observation: ''
})

const filteredExpenses = computed(() =>
  expenses.value.filter(e => e.reference.toLowerCase().includes(activeCategory.value))
)

const totalCasa = computed(() =>
  expenses.value
    .filter(e => e.reference.toLowerCase().includes('casa'))
    .reduce((sum, e) => sum + e.amount, 0)
)

const totalCesar = computed(() =>
  expenses.value
    .filter(e => e.reference.toLowerCase().includes('cesar'))
    .reduce((sum, e) => sum + e.amount, 0)
)

const totalGeneral = computed(() => totalCasa.value + totalCesar.value)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function loadExpenses() {
  isLoading.value = true
  try {
    const response = await moneyMovementService.getAll()
    const movements = response.data?.moneyMovements || []
    expenses.value = movements
      .filter((mm: any) => {
        const ref = (mm.reference || '').toLowerCase()
        return ref.includes('gastos casa') || ref.includes('gastos cesar')
      })
      .map((mm: any) => ({
        id: mm.id,
        date: mm.createdAt ? mm.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
        reference: mm.reference || '',
        name: mm.name,
        concept: mm.concept,
        movement: mm.movement,
        amount: mm.amount,
        account: mm.account,
        observation: mm.observation || '',
      }))
  } catch (error) {
    console.error('Error cargando gastos:', error)
  } finally {
    isLoading.value = false
  }
}

async function addExpense() {
  isSaving.value = true
  const reference = activeCategory.value === 'casa' ? 'Gastos Casa' : 'Gastos Cesar'
  try {
    await moneyMovementService.create({
      reference,
      name: newExpense.value.name,
      concept: newExpense.value.concept,
      movement: 'EGRESO',
      amount: Number(newExpense.value.amount) || 0,
      account: newExpense.value.account,
      observation: newExpense.value.observation || '',
    })
    await loadExpenses()
    newExpense.value = { name: '', concept: '', amount: 0, account: 'Banco', observation: '' }
  } catch (error) {
    console.error('Error guardando gasto:', error)
    alert('Error al guardar el gasto')
  } finally {
    isSaving.value = false
  }
}

function goBack() {
  router.push('/admin/products')
}

onMounted(() => {
  loadExpenses()
  currentDate.value = new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})
</script>

<style scoped>
.cesar-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
}

.cesar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
  background: rgba(15, 23, 42, 0.8);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(30, 41, 59, 0.6);
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.back-btn:hover {
  background: rgba(51, 65, 85, 0.8);
  color: #e2e8f0;
}

.header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-left h1 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #f1f5f9;
}

.header-left p {
  margin: 2px 0 0;
  color: #94a3b8;
  font-size: 0.85rem;
}

.date-badge {
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
}

.cesar-main {
  padding: 24px 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.summary-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 14px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.summary-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-icon.home {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.summary-icon.person {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
}

.summary-icon.total {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.summary-value {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #f1f5f9;
}

.summary-label {
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: #94a3b8;
}

.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(30, 41, 59, 0.5);
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.category-tab:hover {
  background: rgba(51, 65, 85, 0.6);
}

.category-tab.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2));
  border-color: rgba(99, 102, 241, 0.4);
  color: #e2e8f0;
}

.form-section {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 24px;
}

.form-section h3 {
  margin: 0 0 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
}

.expense-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.6);
  color: #e2e8f0;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  border-color: rgba(99, 102, 241, 0.5);
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  transition: opacity 0.2s;
}

.btn-add:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.expenses-section {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 14px;
  padding: 20px;
}

.expenses-section h3 {
  margin: 0 0 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
  color: #64748b;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

.expenses-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 14px;
  text-align: left;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

th {
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

td {
  font-size: 0.9rem;
  color: #cbd5e1;
}

td.amount {
  font-weight: 600;
  color: #4ade80;
}

@media (max-width: 768px) {
  .summary-section {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .cesar-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
