import { apiClient, type ApiResponse } from './apiConfig'
import type {
  WorkOrder,
  WorkOrderListData,
  CreateWorkOrderRequest,
  UpdateWorkOrderRequest,
} from '@/types/WorkOrderType'

const WORK_ORDERS_ENDPOINT = '/work-orders'

const normalizeWorkOrderListData = (data: unknown): WorkOrderListData => {
  if (Array.isArray(data)) {
    return {
      count: data.length,
      workOrders: data as WorkOrder[],
    }
  }

  if (data && typeof data === 'object') {
    const responseData = data as Partial<WorkOrderListData> & { workOrders?: WorkOrder[] }

    if (Array.isArray(responseData.workOrders)) {
      return {
        count:
          typeof responseData.count === 'number'
            ? responseData.count
            : responseData.workOrders.length,
        workOrders: responseData.workOrders,
      }
    }
  }

  return {
    count: 0,
    workOrders: [],
  }
}

const normalizeWorkOrder = (data: unknown): WorkOrder => {
  if (data && typeof data === 'object' && 'workOrder' in data) {
    return (data as { workOrder: WorkOrder }).workOrder
  }

  return data as WorkOrder
}

class WorkOrderService {
  async getWorkOrders(params?: {
    vehicleId?: number
    mechanicId?: number
    status?: string
  }): Promise<ApiResponse<WorkOrderListData>> {
    try {
      let endpoint = WORK_ORDERS_ENDPOINT

      if (params) {
        const queryParams = new URLSearchParams()
        if (params.vehicleId) queryParams.append('vehicleId', String(params.vehicleId))
        if (params.mechanicId) queryParams.append('mechanicId', String(params.mechanicId))
        if (params.status) queryParams.append('status', params.status)

        const queryString = queryParams.toString()
        if (queryString) endpoint += `?${queryString}`
      }

      const result = await apiClient.get<WorkOrderListData>(endpoint)
      if (result.data) {
        result.data = normalizeWorkOrderListData(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [workOrderService] Error fetching work orders:', error)
      throw error
    }
  }

  async getWorkOrderById(id: number): Promise<ApiResponse<WorkOrder>> {
    try {
      const result = await apiClient.get<WorkOrder>(`${WORK_ORDERS_ENDPOINT}/${id}`)
      if (result.data) {
        result.data = normalizeWorkOrder(result.data)
      }
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
      const result = await apiClient.post<WorkOrder>(WORK_ORDERS_ENDPOINT, data)
      if (result.data) {
        result.data = normalizeWorkOrder(result.data)
      }
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
      const result = await apiClient.put<WorkOrder>(`${WORK_ORDERS_ENDPOINT}/${id}`, data)
      if (result.data) {
        result.data = normalizeWorkOrder(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [workOrderService] Error updating work order:', error)
      throw error
    }
  }

  async deleteWorkOrder(id: number): Promise<ApiResponse<unknown>> {
    try {
      const result = await apiClient.delete<unknown>(`${WORK_ORDERS_ENDPOINT}/${id}`)
      return result
    } catch (error) {
      console.error('❌ [workOrderService] Error deleting work order:', error)
      throw error
    }
  }
}

export const workOrderService = new WorkOrderService()
