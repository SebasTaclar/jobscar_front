import { apiClient, type ApiResponse } from './apiConfig'
import type {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '@/types/VehicleType'

class VehicleService {
  async getVehicles(params?: {
    clientId?: number
    plate?: string
  }): Promise<ApiResponse<Vehicle[]>> {
    try {
      let endpoint = '/workshop/vehicles'

      if (params) {
        const queryParams = new URLSearchParams()
        if (params.clientId) queryParams.append('clientId', String(params.clientId))
        if (params.plate) queryParams.append('plate', params.plate)

        const queryString = queryParams.toString()
        if (queryString) endpoint += `?${queryString}`
      }

      const result = await apiClient.get<Vehicle[]>(endpoint)
      return result
    } catch (error) {
      console.error('❌ [vehicleService] Error fetching vehicles:', error)
      throw error
    }
  }

  async getVehicleById(id: number): Promise<ApiResponse<Vehicle>> {
    try {
      const result = await apiClient.get<Vehicle>(`/workshop/vehicles/${id}`)
      return result
    } catch (error) {
      console.error('❌ [vehicleService] Error fetching vehicle by ID:', error)
      throw error
    }
  }

  async createVehicle(data: CreateVehicleRequest): Promise<ApiResponse<Vehicle>> {
    try {
      const result = await apiClient.post<Vehicle>('/workshop/vehicles', data)
      return result
    } catch (error) {
      console.error('❌ [vehicleService] Error creating vehicle:', error)
      throw error
    }
  }

  async updateVehicle(id: number, data: UpdateVehicleRequest): Promise<ApiResponse<Vehicle>> {
    try {
      const result = await apiClient.put<Vehicle>(`/workshop/vehicles/${id}`, data)
      return result
    } catch (error) {
      console.error('❌ [vehicleService] Error updating vehicle:', error)
      throw error
    }
  }
}

export const vehicleService = new VehicleService()
