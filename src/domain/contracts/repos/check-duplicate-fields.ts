export interface CheckDuplicateFields {
  load: (params: CheckDuplicateFields.Input) => Promise<CheckDuplicateFields.Output>
}

export namespace CheckDuplicateFields {
  export type Input = {
    table: string
    fieldName: string
    value: string
    id?: number
  }

  export type Output = boolean
}
