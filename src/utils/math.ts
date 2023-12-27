const { random, cos, sin, sqrt, floor, PI, tan, E, pow } = Math

export { random, cos, sin, sqrt, floor, PI, tan, E, pow }

export const max = (nums: number[]) => {
  let m = nums[0]

  nums.forEach((n) => {
    if (n > m) {
      m = n
    }
  })

  return m
}

export const min = (nums: number[]) => {
  let m = nums[0]

  nums.forEach((n) => {
    if (n < m) {
      m = n
    }
  })

  return m
}

export const sum = (nums: number[]) => nums.reduce((r, c) => r + c, 0)

export const product = (nums: number[]) =>
  nums.reduce((r, c) => r * c, nums.length ? 1 : 0)

export type InterpolateFn = (y1: number, y2: number, p: number) => number

/**
 * Linear interpolation
 * @param y1 value at p = 0
 * @param y2 value at p = 1
 * @param p between 0-1
 * @returns
 */
export const lerp: InterpolateFn = (y1: number, y2: number, p: number) =>
  (y2 - y1) * p + y1

/**
 * Cosine interpolation
 * @param y1 value at p = 0
 * @param y2 value at p = 1
 * @param p between 0-1
 * @returns
 */
export const cerp: InterpolateFn = (y1: number, y2: number, p: number) => {
  const amplitude = (y2 - y1) / 2

  return cos(p * PI - PI) * amplitude + amplitude + y1
}

export const fade = (x: number) => x * x * x * (x * (6.0 * x - 15.0) + 10.0)
