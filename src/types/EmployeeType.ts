export interface Employee {
  id: number
  name: string
  role: string
  specialty?: string
  email?: string
  phone?: string
  status?: string
  entryDate?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
  activeOrders?: number
}

export interface EmployeeListData {
  count: number
  employees: Employee[]
}

export interface CreateEmployeeRequest {
  name: string
  role: string
  specialty?: string
  email?: string
  phone?: string
  status?: string
  entryDate?: string
  notes?: string
}

export type UpdateEmployeeRequest = Partial<CreateEmployeeRequest>
