export interface WorkshopClient {
  id: number
  name: string
  phone: string
  email: string
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateWorkshopClientRequest {
  name: string
  phone: string
  email: string
  notes?: string
}

export interface UpdateWorkshopClientRequest {
  name?: string
  phone?: string
  email?: string
  notes?: string
  isActive?: boolean
}
