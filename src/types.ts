export interface TokenAttribute {
  trait_type: string
  value: string | number
  display_type?: string
  max_value?: number
}

export interface TokenMetadataLocalization {
  uri: string
  default: string
  locales: string[]
}

export interface TokenMetadata {
  name: string | null
  description: string | null
  image: string | null
  animation_url: string | null
  external_url: string | null
  background_color: string | null
  attributes: TokenAttribute[]
  decimals: number | null
  properties: Record<string, unknown> | null
  localization: TokenMetadataLocalization | null
  extra: Record<string, unknown>
}

export interface ContractMetadata {
  name: string | null
  description: string | null
  image: string | null
  banner_image: string | null
  featured_image: string | null
  external_link: string | null
  collaborators: string[]
  extra: Record<string, unknown>
}
