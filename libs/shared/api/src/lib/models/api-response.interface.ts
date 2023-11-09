export interface ApiMetaInfo {
  version: string
  type: 'object' | 'list' | 'none'
  count: number
}

export interface ApiResponse<T> {
  restult?: T[] | T
  info:ApiMetaInfo
}
