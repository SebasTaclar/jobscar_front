<template>
  <section class="billing-section">
    <div class="section-title-bar">
      <div class="section-top" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:nowrap;">
        <h2 class="section-title">💵 Facturación</h2>
        <div class="header-actions" style="display:flex;gap:8px;align-items:center;justify-content:flex-end;">
          <button class="btn btn-secondary header-action" type="button">Exportar CSV</button>
          <button class="btn btn-primary header-action" type="button">➕ Nueva factura</button>
        </div>
      </div>
      <div class="section-controls" style="margin-top:10px;">
        <div class="header-controls">
          <div class="search-input-wrapper invoices-search">
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"/></svg>
            <input v-model="invoiceSearchLocal" type="search" class="search-input header-search-input" placeholder="🔍 Buscar por cliente, vehículo o id..." aria-label="Buscar facturas" />
            <button v-if="invoiceSearchLocal" class="search-clear" type="button" @click="invoiceSearchLocal = ''">X</button>
          </div>

          <select v-model="invoiceFilterStatusLocal" class="form-input">
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Abonado">Abonado</option>
            <option value="Pagado">Pagado</option>
            <option value="Anulado">Anulado</option>
          </select>
          <input type="date" v-model="dateFromLocal" class="form-input" />
          <input type="date" v-model="dateToLocal" class="form-input" />
        </div>
      </div>
    </div>

    <div class="table-responsive invoices-fullwidth" style="margin-top:12px;">
      <table class="simple-table invoices-table compact">
        <thead class="table-header">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Vehículo</th>
            <th>Items</th>
            <th>Subtotal</th>
            <th>IVA</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inv in paginatedInvoices" :key="inv.id">
            <td data-label="ID">#{{ inv.id }}</td>
            <td data-label="Fecha">{{ inv.createdAt ? formatShortDate(inv.createdAt) : '-' }}</td>
            <td data-label="Cliente">{{ inv.client }}</td>
            <td data-label="Vehículo">{{ inv.vehicle || '-' }}</td>
            <td data-label="Items">{{ Array.isArray(inv.items) ? inv.items.length : (inv.items || '').toString().split(',').length }}</td>
            <td data-label="Subtotal">${{ invoiceSubtotal(inv).toLocaleString() }}</td>
            <td data-label="IVA">${{ invoiceTax(inv).toLocaleString() }}</td>
            <td data-label="Total">${{ invoiceTotal(inv).toLocaleString() }}</td>
            <td data-label="Estado"><span class="status-badge" :class="(inv.status || '').toLowerCase()">{{ inv.status || '-' }}</span></td>
            <td data-label="Acciones">
              <div class="actions" style="display:flex;gap:6px;justify-content:center;">
                <button class="btn btn-sm btn-secondary" type="button">👁️</button>
                <button class="btn btn-sm btn-secondary" type="button">✏️</button>
                <button class="btn btn-sm btn-danger" type="button">🗑️</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredInvoices.length === 0">
            <td colspan="10">No hay facturas para mostrar.</td>
          </tr>
        </tbody>
      </table>

      <div class="table-footer" style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;gap:12px;flex-wrap:wrap;">
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="btn btn-secondary" type="button">Exportar Seleccionadas</button>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="btn" :disabled="currentPage<=1" @click.prevent="goToPage(currentPage-1)">Anterior</button>
          <span>Página {{ currentPage }} / {{ totalPages }}</span>
          <button class="btn" :disabled="currentPage>=totalPages" @click.prevent="goToPage(currentPage+1)">Siguiente</button>
          <select v-model.number="pageSize" class="form-input"><option :value="5">5</option><option :value="8">8</option><option :value="15">15</option><option :value="50">50</option></select>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface InvoiceLike { id: number | string; client?: string; vehicle?: string; items?: any; taxPct?: number; status?: string; createdAt?: string; subtotal?: number; total?: number }

const props = defineProps<{
  invoices?: InvoiceLike[]
}>()

const invoiceSearchLocal = ref('')
const invoiceFilterStatusLocal = ref('')
const dateFromLocal = ref('')
const dateToLocal = ref('')
const sortKey = ref<string>('id')
const sortDir = ref<number>(-1)
const currentPage = ref(1)
const pageSize = ref<number>(8)

const filteredInvoices = computed(() => {
  const q = String(invoiceSearchLocal.value || '').trim().toLowerCase()
  return (props.invoices || []).filter((inv) => {
    const hay = [inv.id, inv.client, inv.vehicle, inv.status, inv.createdAt, String(inv.total || '')].map(v => String(v ?? '').toLowerCase()).join(' ')
    const matchesQ = !q || hay.includes(q)
    const matchesStatus = !invoiceFilterStatusLocal.value || (String(inv.status || '') === invoiceFilterStatusLocal.value)
    const matchesFrom = !dateFromLocal.value || (inv.createdAt && inv.createdAt >= dateFromLocal.value)
    const matchesTo = !dateToLocal.value || (inv.createdAt && inv.createdAt <= dateToLocal.value)
    return matchesQ && matchesStatus && matchesFrom && matchesTo
  }).sort((a,b) => {
    const aVal = (a as any)[sortKey.value] ?? ''
    const bVal = (b as any)[sortKey.value] ?? ''
    if (aVal < bVal) return -1 * sortDir.value
    if (aVal > bVal) return 1 * sortDir.value
    return 0
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredInvoices.value.length / pageSize.value)))

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredInvoices.value.slice(start, start + pageSize.value)
})

function goToPage(p: number) {
  currentPage.value = Math.max(1, Math.min(totalPages.value, p))
}

function invoiceSubtotal(inv: any) {
  try {
    if (Array.isArray(inv.items) && inv.items.length) {
      return inv.items.reduce((s: number, it: any) => {
        if (typeof it === 'string') return s
        const qty = Number(it.qty ?? it.quantity ?? 1) || 1
        const unit = Number(it.price ?? it.unit ?? 0) || 0
        const total = Number(it.total ?? (qty * unit)) || (qty * unit)
        return s + total
      }, 0)
    }
    if (typeof inv.subtotal === 'number') return inv.subtotal
    if (typeof inv.total === 'number') return Math.round(inv.total / 1.19)
  } catch (e) { }
  return 0
}

function invoiceTax(inv: any) {
  try { const pct = typeof inv.taxPct === 'number' ? inv.taxPct : 19; return Math.round(invoiceSubtotal(inv) * (pct / 100)) } catch (e) { }
  return 0
}

function invoiceTotal(inv: any) { if (typeof inv.total === 'number') return inv.total; return invoiceSubtotal(inv) + invoiceTax(inv) }

function formatShortDate(v?: string) { if (!v) return '-'; try { const d=new Date(v); return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('es-CO') } catch(e){ return '-'} }
</script>

<style scoped>
.billing-section { display:flex; flex-direction:column; gap:14px }
.section-title-bar { padding:12px; border-radius:12px }
.header-controls { display:flex; gap:10px; align-items:center }
.invoices-search { display:flex; align-items:center; gap:8px; border-radius:12px; padding:6px 8px; background: rgba(255,255,255,0.02) }
.invoices-search .search-icon { color:#7dd3fc }
.invoices-search .header-search-input { min-height:40px; border-radius:999px; padding-left:6px; border:1px solid var(--brand-border); background:var(--brand-bg-end); color:var(--brand-primary-contrast) }
.search-clear { width:28px; height:28px; border:0; border-radius:999px; background:rgba(59,130,246,0.18); color:#dbeafe; cursor:pointer }
.table-responsive { overflow-x:auto }
.simple-table { width:100%; border-collapse:collapse; background:linear-gradient(180deg,var(--brand-bg-end) 0%, rgba(255,255,255,0.01) 100%); border:1px solid var(--brand-border); border-radius:12px; overflow:hidden }
.simple-table thead th { background:var(--brand-surface); color:var(--brand-primary-contrast); font-weight:700; padding:12px; text-align:center }
.simple-table tbody td { padding:12px; color:var(--brand-accent-alt); text-align:center }
.status-badge.pagado { background:linear-gradient(135deg,#10b981 0%,#34d399 100%); color:white; padding:6px 10px; border-radius:999px }
.status-badge.pendiente { background:linear-gradient(135deg,#f59e0b 0%,#fb7185 100%); color:white; padding:6px 10px; border-radius:999px }
.status-badge.abonado { background:linear-gradient(135deg,#3b82f6 0%,#60a5fa 100%); color:white; padding:6px 10px; border-radius:999px }
.status-badge.anulado { background:linear-gradient(135deg,#ef4444 0%,#fb7185 100%); color:white; padding:6px 10px; border-radius:999px }
</style>
