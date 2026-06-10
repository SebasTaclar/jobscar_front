export interface MoneyMovement {
  id: number
  reference?: string
  name: string
  concept: string
  movement: string
  amount: number
  account: string
  observation?: string
  createdAt?: string
  updatedAt?: string
}

export interface MoneyMovementListData {
  count: number
  moneyMovements: MoneyMovement[]
}

export interface CreateMoneyMovementRequest {
  reference?: string
  name: string
  concept: string
  movement: string
  amount: number
  account: string
  observation?: string
}

export interface UpdateMoneyMovementRequest {
  reference?: string
  name?: string
  concept?: string
  movement?: string
  amount?: number
  account?: string
  observation?: string
}

export interface MoneyMovementFilters {
  movement?: string
  account?: string
  name?: string
}
