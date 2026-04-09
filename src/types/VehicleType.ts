export interface Vehicle {
  id: number
  clientId: number
  plate: string
  brand: string
  model: string
  year: number
  mileage: number
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateVehicleRequest {
  clientId: number
  plate: string
  brand: string
  model: string
  year: number
  mileage: number
  notes?: string
}

export interface UpdateVehicleRequest {
  plate?: string
  brand?: string
  model?: string
  year?: number
  mileage?: number
  notes?: string
}
