export interface SparePart {
  id: number
  workOrderId: number
  invoiceId?: number | null
  item: string
  quantity: number
  unitCost: number
  unitValue: number
  totalCost: number
  totalInvoice: number
  gananciaNeta: number
  createdAt?: string
  updatedAt?: string
}

export interface SparePartListData {
  count: number
  spareParts: SparePart[]
}

export interface CreateSparePartRequest {
  workOrderId: number
  invoiceId?: number | null
  item: string
  quantity: number
  unitCost: number
  unitValue: number
  totalCost: number
  totalInvoice: number
  gananciaNeta: number
}

export interface UpdateSparePartRequest {
  workOrderId?: number
  invoiceId?: number | null
  item?: string
  quantity?: number
  unitCost?: number
  unitValue?: number
  totalCost?: number
  totalInvoice?: number
  gananciaNeta?: number
}

export interface SparePartFilters {
  workOrderId?: number
  invoiceId?: number
}
