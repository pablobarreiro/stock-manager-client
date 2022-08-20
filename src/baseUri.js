export const baseUri = process.env.REACT_APP_SERVER_BASE_URI ?? ''

export const prependBaseUri = (path) => baseUri+path