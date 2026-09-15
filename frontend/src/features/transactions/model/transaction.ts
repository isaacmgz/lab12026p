export interface Transaction {
  id: number
  senderAccountNumber: string
  receiverAccountNumber: string
  amount: number
  timestamp: string
}

export interface TransferPayload {
  senderAccountNumber: string
  receiverAccountNumber: string
  amount: number
}
