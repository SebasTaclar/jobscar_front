import { apiClient, type ApiResponse } from './apiConfig'
import type {
  WorkOrder,
  CreateWorkOrderRequest,
  UpdateWorkOrderRequest,
} from '@/types/WorkOrderType'

class WorkOrderService {
  async getWorkOrders(params?: {
    clientId?: number
    vehicleId?: number
    status?: string
  }): Promise<ApiResponse<WorkOrder[]>> {
    try {
      let endpoint = '/workshop/work-orders'

      if (params) {
        const queryParams = new URLSearchParams()
        if (params.clientId) queryParams.append('clientId', String(params.clientId))
        if (params.vehicleId) queryParams.append('vehicleId', String(params.vehicleId))
        if (params.status) queryParams.append('status', params.status)

        const queryString = queryParams.toString()
        if (queryString) endpoint += `?${queryString}`
      }

      const result = await apiClient.get<WorkOrder[]>(endpoint)
      return result
    } catch (error) {
      console.error('❌ [workOrderService] Error fetching work orders:', error)
      throw error
    }
  }

  async getWorkOrderById(id: number): Promise<ApiResponse<WorkOrder>> {
    try {
      const result = await apiClient.get<WorkOrder>(`/workshop/work-orders/${id}`)
      return result
    } catch (error) {
      console.error('❌ [workOrderService] Error fetching work order by ID:', error)
      throw error
    }
  }

  async createWorkOrder(
    data: CreateWorkOrderRequest,
  ): Promise<ApiResponse<WorkOrder>> {
    try {
      const result = await apiClient.post<WorkOrder>('/workshop/work-orders', data)
      return result
    } catch (error) {
      console.error('❌ [workOrderService] Error creating work order:', error)
      throw error
    }
  }

  async updateWorkOrder(
    id: number,
    data: UpdateWorkOrderRequest,
  ): Promise<ApiResponse<WorkOrder>> {
    try {
      const result = await apiClient.put<WorkOrder>(`/workshop/work-orders/${id}`, data)
      return result
    } catch (error) {
      console.error('❌ [workOrderService] Error updating work order:', error)
      throw error
    }
  }
}

export const workOrderService = new WorkOrderService()
