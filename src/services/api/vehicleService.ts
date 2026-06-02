import { apiClient, type ApiResponse } from './apiConfig'
import type {
  Vehicle,
  VehicleListData,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '@/types/VehicleType'

const normalizeVehicle = (vehicle: any): Vehicle => {
  const km =
    typeof vehicle.km === 'number' ? vehicle.km : Number(vehicle.km || vehicle.mileage || 0)

  return {
    ...vehicle,
    km,
    mileage: vehicle.mileage ?? km,
    client: vehicle.client ?? vehicle.clientName ?? vehicle.clientFullName ?? undefined,
    registrationDate:
      vehicle.registrationDate || vehicle.createdAt || vehicle.registrationDate || undefined,
  }
}

class VehicleService {
  async getVehicles(params?: {
    clientId?: number
    plate?: string
  }): Promise<ApiResponse<VehicleListData>> {
    try {
      let endpoint = '/vehicles'

      if (params) {
        const queryParams = new URLSearchParams()
        if (params.clientId) queryParams.append('clientId', String(params.clientId))
        if (params.plate) queryParams.append('plate', params.plate)

        const queryString = queryParams.toString()
        if (queryString) endpoint += `?${queryString}`
      }

      const result = await apiClient.get<VehicleListData>(endpoint)
      if (result.data?.vehicles) {
        result.data.vehicles = result.data.vehicles.map(normalizeVehicle)
      }
      return result
    } catch (error) {
      console.error('❌ [vehicleService] Error fetching vehicles:', error)
      throw error
    }
  }

  async getVehicleById(id: number): Promise<ApiResponse<Vehicle>> {
    try {
      const result = await apiClient.get<Vehicle>(`/vehicles/${id}`)
      if (result.data) {
        result.data = normalizeVehicle(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [vehicleService] Error fetching vehicle by ID:', error)
      throw error
    }
  }

  async createVehicle(data: CreateVehicleRequest): Promise<ApiResponse<Vehicle>> {
    try {
      const result = await apiClient.post<Vehicle>('/vehicles', data)
      if (result.data) {
        result.data = normalizeVehicle(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [vehicleService] Error creating vehicle:', error)
      throw error
    }
  }

  async updateVehicle(id: number, data: UpdateVehicleRequest): Promise<ApiResponse<Vehicle>> {
    try {
      const result = await apiClient.put<Vehicle>(`/vehicles/${id}`, data)
      if (result.data) {
        result.data = normalizeVehicle(result.data)
      }
      return result
    } catch (error) {
      console.error('❌ [vehicleService] Error updating vehicle:', error)
      throw error
    }
  }

  async deleteVehicle(id: number): Promise<ApiResponse<unknown>> {
    try {
      const result = await apiClient.delete<unknown>(`/vehicles/${id}`)
      return result
    } catch (error) {
      console.error('❌ [vehicleService] Error deleting vehicle:', error)
      throw error
    }
  }
}

export const vehicleService = new VehicleService()
