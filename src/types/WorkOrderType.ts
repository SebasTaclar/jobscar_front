export type WorkOrderStatus = 'pending' | 'in-progress' | 'completed' | 'delivered'

export interface WorkOrderServiceItem {
  description: string
  quantity: number
  unitPrice: number
}

export interface WorkOrderPartItem {
  partId?: number
  description: string
  quantity: number
  unitPrice: number
}

export interface WorkOrder {
  id: number
  clientId: number
  vehicleId: number
  mechanicId?: number
  createdAt: string
  closedAt?: string
  initialDiagnosis: string
  services: WorkOrderServiceItem[]
  parts: WorkOrderPartItem[]
  status: WorkOrderStatus
  customerApproved: boolean
  customerNameAtApproval?: string
}

export interface CreateWorkOrderRequest {
  clientId: number
  vehicleId: number
  mechanicId?: number
  initialDiagnosis: string
  services?: WorkOrderServiceItem[]
  parts?: WorkOrderPartItem[]
}

export interface UpdateWorkOrderRequest {
  mechanicId?: number
  initialDiagnosis?: string
  services?: WorkOrderServiceItem[]
  parts?: WorkOrderPartItem[]
  status?: WorkOrderStatus
  customerApproved?: boolean
  customerNameAtApproval?: string
  closedAt?: string
}
