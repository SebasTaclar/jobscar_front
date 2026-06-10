import { apiClient, type ApiResponse } from './apiConfig'

export interface InvoiceItem {
  description: string
  qty: number
  price: number
  isLabor: boolean
}

export interface Deposit {
  amount: number
  date: string
  method: string
}

export interface Invoice {
  id: number
  clientName?: string
  fechaCreacion?: string
  vehiculo?: string
  placa?: string
  total: number
  abono?: number
  saldo?: number
  workOrderId?: number | null
  items: InvoiceItem[]
  taxPct: boolean
  discount: number
  retention: number
  deposits: Deposit[]
  formaDePago: string
  status: string
  notes: string
  createdAt: string
  updatedAt: string
  client?: string
  clientPhone?: string
  clientEmail?: string
  clientAddress?: string
  vehicle?: string
  vehicleBrand?: string
  vehicleModel?: string
  vehicleKm?: string
  advisorName?: string
}

export interface GetAllInvoicesResponse {
  count: number
  invoices: Invoice[]
}

export interface CreateInvoiceRequest {
  items?: InvoiceItem[]
  taxPct?: boolean
  discount?: number
  retention?: number
  deposits?: Deposit[]
  formaDePago?: string
  status?: string
  notes?: string
  workOrderId?: number | null
  client?: string
  clientPhone?: string
  clientEmail?: string
  clientAddress?: string
  vehicle?: string
  vehicleBrand?: string
  vehicleModel?: string
  vehicleKm?: string
  advisorName?: string
}

export interface UpdateInvoiceRequest {
  items?: InvoiceItem[]
  taxPct?: boolean
  discount?: number
  retention?: number
  deposits?: Deposit[]
  formaDePago?: string
  status?: string
  notes?: string
}

class InvoiceService {
  async getAll(): Promise<ApiResponse<GetAllInvoicesResponse>> {
    const res = await apiClient.get<GetAllInvoicesResponse>('/invoices')
    return res
  }

  async getById(id: number): Promise<ApiResponse<Invoice>> {
    const res = await apiClient.get<Invoice>(`/invoices/${id}`)
    return res
  }

  async create(invoice: CreateInvoiceRequest): Promise<ApiResponse<Invoice>> {
    const res = await apiClient.post<Invoice>('/invoices', invoice)
    return res
  }

  async update(id: number, invoice: UpdateInvoiceRequest): Promise<ApiResponse<Invoice>> {
    const res = await apiClient.put<Invoice>(`/invoices/${id}`, invoice)
    return res
  }

  async delete(id: number): Promise<ApiResponse<unknown>> {
    const res = await apiClient.delete<unknown>(`/invoices/${id}`)
    return res
  }
}

export const invoiceService = new InvoiceService()
