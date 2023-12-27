import {
  InterpolateFn,
  dotProduct,
  lerp,
  normalize,
  fade,
  randomUnitVec2,
  randomUnitVec3,
} from "./utils"
import { Vec2, Vec3 } from "./types"

export class PerlinNoise2D {
  /**
   * random gradient Vector at each corner with angle from 0 -> 2PI,
   */
  gV: Vec2[] = []
  sizeX: number
  sizeY: number
  interpolateFn: InterpolateFn

  constructor(
    sizeX: number,
    sizeY: number,
    interpolateFn: InterpolateFn = lerp
  ) {
    this.sizeX = sizeX
    this.sizeY = sizeY
    this.interpolateFn = interpolateFn
    this.initSeeds()
  }

  initSeeds() {
    const { sizeX, sizeY } = this
    const gV = new Array<Vec2>(sizeX * sizeY)
      .fill([0, 0])
      .map(() => randomUnitVec2())

    this.gV = gV
  }

  noiseOf(x: number, y: number) {
    const { gV, sizeX, sizeY, interpolateFn } = this
    x = x % sizeX
    y = y % sizeY
    const gridX = Math.floor(x)
    const gridY = Math.floor(y)

    const pos = [x - gridX, y - gridY]

    /**
     * Gradient top left - bottom left - top right - bottom right
     */
    const gTL = gV[this.indexOf(gridX, gridY)]
    const gBL = gV[this.indexOf(gridX, gridY + 1)]
    const gTR = gV[this.indexOf(gridX + 1, gridY)]
    const gBR = gV[this.indexOf(gridX + 1, gridY + 1)]

    /**
     * vector from point to top left - bottom left - top right - bottom right
     */
    const vTL = [pos[0], pos[1]]
    const vBL = [pos[0], pos[1] - 1]
    const vTR = [pos[0] - 1, pos[1]]
    const vBR = [pos[0] - 1, pos[1] - 1]

    /**
     * dot product of from point and gradient vector of top left - bottom left - top right - bottom right
     */
    const dotTL = dotProduct(vTL, gTL)
    const dotBL = dotProduct(vBL, gBL)
    const dotTR = dotProduct(vTR, gTR)
    const dotBR = dotProduct(vBR, gBR)

    const bX = fade(x - gridX)
    const bY = fade(y - gridY)

    const dotTop = interpolateFn(dotTL, dotTR, bX)
    const dotBottom = interpolateFn(dotBL, dotBR, bX)

    const noiseValue = interpolateFn(dotTop, dotBottom, bY)

    return (noiseValue + 1) / 2
  }

  /**
   * index of position [x][y] in 1d array, clamp if overflow
   */
  indexOf(x: number, y: number) {
    x = x % this.sizeX
    y = y % this.sizeY

    return y * this.sizeX + x
  }
}

export class PerlinNoise3D {
  /**
   * random gradient Vector at each corner with angle from 0 -> 2PI,
   * [x*y * z]
   * z index divides the array by chunk, each chuck has size of x * y
   * Example of x = 3, y = 2, z = 2
   * [
   *  1,2,3,
   *  4,5,6
   *  1,2,3,
   *  4,5,6
   * ]
   */
  gV: Vec3[] = []
  sizeX: number
  sizeY: number
  sizeZ: number
  interpolateFn: InterpolateFn

  constructor(
    sizeX: number,
    sizeY: number,
    sizeZ: number,
    interpolateFn: InterpolateFn = lerp
  ) {
    this.sizeX = sizeX
    this.sizeY = sizeY
    this.sizeZ = sizeZ
    this.interpolateFn = interpolateFn
    this.initSeeds()
  }

  initSeeds() {
    const { sizeX, sizeY, sizeZ } = this
    const gV = new Array<Vec2>(sizeX * sizeY * sizeZ)
      .fill([0, 0])
      .map(() => randomUnitVec3())

    this.gV = gV
  }

  noiseOf(x: number, y: number, z = 0) {
    const { gV, sizeX, sizeY, sizeZ, interpolateFn } = this
    x = x % sizeX
    y = y % sizeY
    z = z % sizeZ
    const gridX = Math.floor(x)
    const gridY = Math.floor(y)
    const gridZ = Math.floor(z)

    const pos: Vec3 = [x - gridX, y - gridY, z - gridZ]
    /**
     * Gradient top left - bottom left - top right - bottom right both front and back sides
     */
    const gTLF = gV[this.indexOf(gridX, gridY, gridZ)]
    const gTLB = gV[this.indexOf(gridX, gridY, gridZ + 1)]
    const gBLF = gV[this.indexOf(gridX, gridY + 1, gridZ)]
    const gBLB = gV[this.indexOf(gridX, gridY + 1, gridZ + 1)]
    const gTRF = gV[this.indexOf(gridX + 1, gridY, gridZ)]
    const gTRB = gV[this.indexOf(gridX + 1, gridY, gridZ + 1)]
    const gBRF = gV[this.indexOf(gridX + 1, gridY + 1, gridZ)]
    const gBRB = gV[this.indexOf(gridX + 1, gridY + 1, gridZ + 1)]

    /**
     * vector from point to top left - bottom left - top right - bottom right both front and back
     */
    const vTLF = [pos[0], pos[1], pos[2]]
    const vTLB = [pos[0], pos[1], pos[2] - 1]
    const vBLF = [pos[0], pos[1] - 1, pos[2]]
    const vBLB = [pos[0], pos[1] - 1, pos[2] - 1]
    const vTRF = [pos[0] - 1, pos[1], pos[2]]
    const vTRB = [pos[0] - 1, pos[1], pos[2] - 1]
    const vBRF = [pos[0] - 1, pos[1] - 1, pos[2]]
    const vBRB = [pos[0] - 1, pos[1] - 1, pos[2] - 1]

    /**
     * dot product of from point and gradient vector of top left - bottom left - top right - bottom right
     */
    const dotTLF = dotProduct(vTLF, gTLF)
    const dotBLF = dotProduct(vBLF, gBLF)
    const dotTRF = dotProduct(vTRF, gTRF)
    const dotBRF = dotProduct(vBRF, gBRF)

    const dotTLB = dotProduct(vTLB, gTLB)
    const dotBLB = dotProduct(vBLB, gBLB)
    const dotTRB = dotProduct(vTRB, gTRB)
    const dotBRB = dotProduct(vBRB, gBRB)

    const bX = fade(x - gridX)
    const bY = fade(y - gridY)
    const bZ = fade(z - gridZ)

    const dotTopF = interpolateFn(dotTLF, dotTRF, bX)
    const dotBottomF = interpolateFn(dotBLF, dotBRF, bX)

    const noiseValueF = interpolateFn(dotTopF, dotBottomF, bY)

    const dotTopB = interpolateFn(dotTLB, dotTRB, bX)
    const dotBottomB = interpolateFn(dotBLB, dotBRB, bX)

    const noiseValueB = interpolateFn(dotTopB, dotBottomB, bY)

    const noiseValue = interpolateFn(noiseValueF, noiseValueB, bZ)

    return (noiseValue + 1) / 2
  }

  /**
   * index of position [x][y][z] in 1d array, clamp if overflow
   */
  indexOf(x: number, y: number, z: number) {
    x = x % this.sizeX
    y = y % this.sizeY
    z = z % this.sizeZ

    return y * this.sizeX + x + z * (this.sizeX * this.sizeY)
  }
}
