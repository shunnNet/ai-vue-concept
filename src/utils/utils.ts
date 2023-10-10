export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const simpleTimeId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}
