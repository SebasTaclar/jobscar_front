import { apiClient, type ApiResponse } from './apiConfig'
import type {
  WorkshopClient,
  CreateWorkshopClientRequest,
  UpdateWorkshopClientRequest,
} from '@/types/WorkshopClientType'

class WorkshopClientService {
  async getClients(params?: { search?: string; isActive?: boolean }): Promise<
    ApiResponse<WorkshopClient[]>
  > {
    try {
      let endpoint = '/workshop/clients'

      if (params) {
        const queryParams = new URLSearchParams()
        if (params.search) queryParams.append('search', params.search)
        if (params.isActive !== undefined)
          queryParams.append('isActive', String(params.isActive))

        const queryString = queryParams.toString()
        if (queryString) endpoint += `?${queryString}`
      }

      const result = await apiClient.get<WorkshopClient[]>(endpoint)
      return result
    } catch (error) {
      console.error('❌ [workshopClientService] Error fetching clients:', error)
      throw error
    }
  }

  async getClientById(id: number): Promise<ApiResponse<WorkshopClient>> {
    try {
      const result = await apiClient.get<WorkshopClient>(`/workshop/clients/${id}`)
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
      const result = await apiClient.post<WorkshopClient>('/workshop/clients', data)
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
      const result = await apiClient.put<WorkshopClient>(`/workshop/clients/${id}`, data)
      return result
    } catch (error) {
      console.error('❌ [workshopClientService] Error updating client:', error)
      throw error
    }
  }

  async deactivateClient(id: number): Promise<ApiResponse<WorkshopClient>> {
    try {
      const result = await apiClient.put<WorkshopClient>(`/workshop/clients/${id}/deactivate`)
      return result
    } catch (error) {
      console.error('❌ [workshopClientService] Error deactivating client:', error)
      throw error
    }
  }
}

export const workshopClientService = new WorkshopClientService()
