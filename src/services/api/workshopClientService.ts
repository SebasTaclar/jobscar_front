import { apiClient, type ApiResponse } from './apiConfig'
import type {
  WorkshopClient,
  WorkshopClientListData,
  CreateWorkshopClientRequest,
  UpdateWorkshopClientRequest,
} from '@/types/WorkshopClientType'

class WorkshopClientService {
  async getClients(params?: { name?: string; isActive?: boolean }): Promise<
    ApiResponse<WorkshopClientListData>
  > {
    try {
      let endpoint = '/clients'

      if (params) {
        const queryParams = new URLSearchParams()
        if (params.name) queryParams.append('name', params.name)
        if (params.isActive !== undefined)
          queryParams.append('isActive', String(params.isActive))

        const queryString = queryParams.toString()
        if (queryString) endpoint += `?${queryString}`
      }

      const result = await apiClient.get<WorkshopClientListData>(endpoint)
      return result
    } catch (error) {
      console.error('❌ [workshopClientService] Error fetching clients:', error)
      throw error
    }
  }

  async getClientById(id: number): Promise<ApiResponse<WorkshopClient>> {
    try {
      const result = await apiClient.get<WorkshopClient>(`/clients/${id}`)
      return result
    } catch (error) {
      console.error('❌ [workshopClientService] Error fetching client by ID:', error)
      throw error
    }
  }

  async createClient(
    data: CreateWorkshopClientRequest,
  ): Promise<ApiResponse<WorkshopClient>> {
    try {
      const result = await apiClient.post<WorkshopClient>('/clients', data)
      return result
    } catch (error) {
      console.error('❌ [workshopClientService] Error creating client:', error)
      throw error
    }
  }

  async updateClient(
    id: number,
    data: UpdateWorkshopClientRequest,
  ): Promise<ApiResponse<WorkshopClient>> {
    try {
      const result = await apiClient.put<WorkshopClient>(`/clients/${id}`, data)
      return result
    } catch (error) {
      console.error('❌ [workshopClientService] Error updating client:', error)
      throw error
    }
  }

  async deleteClient(id: number): Promise<ApiResponse<WorkshopClient>> {
    try {
      const result = await apiClient.delete<WorkshopClient>(`/clients/${id}`)
      return result
    } catch (error) {
      console.error('❌ [workshopClientService] Error deleting client:', error)
      throw error
    }
  }

  async deactivateClient(id: number): Promise<ApiResponse<WorkshopClient>> {
    try {
      const result = await apiClient.put<WorkshopClient>(`/clients/${id}`, { isActive: false })
      return result
    } catch (error) {
      console.error('❌ [workshopClientService] Error deactivating client:', error)
      throw error
    }
  }
}

export const workshopClientService = new WorkshopClientService()
