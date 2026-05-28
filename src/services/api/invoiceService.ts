import { apiClient, type ApiResponse } from './apiConfig'

const INVOICES_STORAGE_KEY = 'jobscar_invoices'

class InvoiceService {
  async getAll(): Promise<any> {
    try {
      console.log('🌐 [invoiceService] GET /invoices')
      const res = await apiClient.get<any>('/invoices')
      return res.data
    } catch (error) {
      console.warn('❌ [invoiceService] API no disponible, leyendo localStorage', error)
      try {
        const raw = localStorage.getItem(INVOICES_STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
      } catch (e) {
        return []
      }
    }
  }

  async create(invoice: any): Promise<any> {
    try {
      console.log('🌐 [invoiceService] POST /invoices', invoice)
      const res = await apiClient.post<any>('/invoices', invoice)
      return res.data
    } catch (error) {
      console.warn('❌ [invoiceService] POST falló, persistiendo localmente', error)
      const list = JSON.parse(localStorage.getItem(INVOICES_STORAGE_KEY) || '[]')
      const id = list.length ? Math.max(...list.map((i: any) => Number(i.id))) + 1 : 1001
      const toSave = { ...invoice, id }
      list.push(toSave)
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(list))
      return toSave
    }
  }

  async update(id: number | string, invoice: any): Promise<any> {
    try {
      console.log('🌐 [invoiceService] PUT /invoices/', id)
      const res = await apiClient.put<any>(`/invoices/${id}`, invoice)
      return res.data
    } catch (error) {
      console.warn('❌ [invoiceService] PUT falló, actualizando localmente', error)
      const list = JSON.parse(localStorage.getItem(INVOICES_STORAGE_KEY) || '[]')
      const idx = list.findIndex((i: any) => i.id == id)
      if (idx > -1) {
        list.splice(idx, 1, invoice)
        localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(list))
      }
      return invoice
    }
  }

  async delete(id: number | string): Promise<any> {
    try {
      console.log('🌐 [invoiceService] DELETE /invoices/', id)
      const res = await apiClient.delete<any>(`/invoices/${id}`)
      return res.data
    } catch (error) {
      console.warn('❌ [invoiceService] DELETE falló, eliminando localmente', error)
      const list = JSON.parse(localStorage.getItem(INVOICES_STORAGE_KEY) || '[]')
      const idx = list.findIndex((i: any) => i.id == id)
      if (idx > -1) {
        list.splice(idx, 1)
        localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(list))
      }
      return { id }
    }
  }
}

export const invoiceService = new InvoiceService()
