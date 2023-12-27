import { floor, random } from "./math"

/**
 * Choose one from a set in uniform distribution
 */
export const randomPick = <T>(set: T[]): T => set[floor(random() * set.length)]
