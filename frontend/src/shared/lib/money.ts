const moneyPattern = /^\d{1,13}(\.\d{1,2})?$/

export function isMoneyAmount(value: string) {
  return moneyPattern.test(value.trim())
}

export function parseMoney(value: string) {
  return Number.parseFloat(value.trim())
}

export function toAmountInput(value: number) {
  return (Math.floor(value * 100) / 100).toFixed(2)
}
