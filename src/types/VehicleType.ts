export interface Vehicle {
  id: number
  clientId: number
  client?: string
  plate: string
  brand: string
  model: string
  year: number
  km: number
  mileage?: number
  vehicleType?: string
  status?: string
  registrationDate?: string
  lastServiceDate?: string
  nextServiceKm?: number
  observations?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface VehicleListData {
  count: number
  vehicles: Vehicle[]
}

export interface CreateVehicleRequest {
  clientId: number
  plate: string
  brand: string
  model: string
  year: number
  km: number
  vehicleType?: string
  status?: string
  registrationDate?: string
  lastServiceDate?: string
  nextServiceKm?: number
  observations?: string
}

export interface UpdateVehicleRequest {
  clientId?: number
  plate?: string
  brand?: string
  model?: string
  year?: number
  km?: number
  vehicleType?: string
  status?: string
  registrationDate?: string
  lastServiceDate?: string
  nextServiceKm?: number
  observations?: string
}
