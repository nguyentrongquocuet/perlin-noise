import { Vec2, Vec3 } from "../types"
import { cos, random, sin, sqrt, sum } from "./math"

export const multiply = <V extends Array<number>>(v: V, by: number): V => {
  return v.map((cor) => cor * by) as V
}

export const divide = <V extends Array<number>>(v: V, by: number): V => {
  return v.map((cor) => cor / by) as V
}

export const add = <V extends Array<number>>(v1: V, v2: V): V => {
  return v1.map((cor, idx) => cor + v2[idx]) as V
}

export const sub = <V extends Array<number>>(v1: V, v2: V): V => {
  return v1.map((cor, idx) => cor - v2[idx]) as V
}

export const addScalar = <V extends Array<number>>(v: V, by: number): V => {
  return v.map((cor) => cor + by) as V
}

export const subScalar = <V extends Array<number>>(v: V, by: number): V => {
  return v.map((cor) => cor - by) as V
}

/**
 * Magnitude
 */
export const magnitude = (v: number[]) => sqrt(sum(v.map((cor) => cor * cor)))

export const normalize = <V extends Array<number>>(v: V): V => {
  const mag = magnitude(v)

  return v.map((cor) => cor / mag) as V
}

export const dotProduct = <V extends Array<number>>(v1: V, v2: V) => {
  let result = 0

  for (let i = 0; i < v1.length; i++) {
    result += v1[i] * v2[i]
  }

  return result
}

export const rotate2D = ([x, y]: Vec2, phi: number): [number, number] => {
  const newX = x * cos(phi) - y * sin(phi)
  const newY = x * sin(phi) + y * cos(phi)

  return [newX, newY]
}

export const randomUnitVec3 = (): Vec3 => {
  const x = random() - 0.5
  const y = random() - 0.5
  const z = random() - 0.5
  const v: Vec3 = [x, y, z]
  const mag = magnitude(v)

  return divide(v, mag)
}

export const randomUnitVec2 = (): Vec2 => {
  const x = random() - 0.5
  const y = random() - 0.5
  const v: Vec2 = [x, y]
  const mag = magnitude(v)

  return divide(v, mag)
}
