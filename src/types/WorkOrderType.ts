export type WorkOrderStatus = string

export interface WorkOrderVehicleSummary {
  plate: string
  client: string
}

export interface WorkOrder {
  id: number
  vehicleId: number
  mechanicId?: number
  status: WorkOrderStatus
  services: string[]
  gases: boolean
  escaner: boolean
  observations?: string
  diagnosis?: string
  deliveryDate?: string
  garantia?: number
  total?: number
  vehicle?: WorkOrderVehicleSummary
  createdAt?: string
  updatedAt?: string
}

export interface WorkOrderListData {
  count: number
  workOrders: WorkOrder[]
}

export interface CreateWorkOrderRequest {
  vehicleId: number
  mechanicId: number
  status: string
  services?: string[]
  gases?: boolean
  escaner?: boolean
  observations?: string
  diagnosis?: string
  deliveryDate?: string
  garantia?: number
  total?: number
}

export interface UpdateWorkOrderRequest {
  vehicleId?: number
  mechanicId?: number
  status?: string
  services?: string[]
  gases?: boolean
  escaner?: boolean
  observations?: string
  diagnosis?: string
  deliveryDate?: string
  garantia?: number
  total?: number
}
