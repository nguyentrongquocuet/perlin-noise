import p5 from "p5"
import { PerlinNoise3D } from "./noise"
import { cerp, floor, random } from "./utils"

class Particle {
  pos: p5.Vector
  vel: p5.Vector
  prevPos: p5.Vector
  size = 10
  w: number
  h: number
  p5: p5

  constructor(p5: p5, w: number, h: number) {
    this.w = w
    this.h = h
    this.p5 = p5
    this.renew()
  }

  renew() {
    this.pos = this.p5.createVector(
      this.p5.random(0, this.w),
      this.p5.random(0, this.h)
    )
    this.prevPos = this.pos.copy()

    this.vel = this.p5.createVector(0, 0)
  }

  applyForce(force: p5.Vector) {
    this.vel.add(force.x, force.y)
    this.vel.limit(4)
  }

  updatePrevPos() {
    this.prevPos.x = this.pos.x
    this.prevPos.y = this.pos.y
  }

  follow(field: p5.Vector[]) {
    const x = floor(this.pos.x / this.size)
    const y = floor(this.pos.y / this.size)

    const idx = y * x + x

    const force = field[idx]

    if (force) {
      this.applyForce(force)
    }

    this.updatePrevPos()

    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }

  edges() {
    if (this.pos.x < 0) {
      this.pos.x = this.w
      this.updatePrevPos()
    }

    if (this.pos.x > this.w) {
      this.pos.x = 0
      this.updatePrevPos()
    }

    if (this.pos.y < 0) {
      this.pos.y = this.h
      this.updatePrevPos()
    }

    if (this.pos.y > this.h) {
      this.pos.y = 0
      this.updatePrevPos()
    }
  }

  draw() {
    // this.p5.circle(this.pos.x, this.pos.y, 10)
    this.p5.stroke(31, 81, 255)
    this.p5.line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y)
  }
}

class Sketch extends p5 {
  perlin: PerlinNoise3D
  W = 400
  H = 400
  pace = 10
  fieldX = 41
  fieldY = 41
  noiseIncX = 0.003
  noiseIncY = 0.007
  angleInc = this.PI / 10
  particles: Particle[]
  flowField: p5.Vector[] = []

  constructor() {
    super(() => {})
    this.perlin = new PerlinNoise3D(32, 32, 32, cerp)
    this.initParticles()
    this.flowField = []
    this.updateField()
  }

  setup(): void {
    this.createCanvas(this.W, this.H)
    this.background(51)
  }

  initParticles() {
    this.particles = new Array(400)
      .fill(new Particle(this, this.W, this.H))
      .map(() => new Particle(this, this.W, this.H))
  }

  updateField() {
    const {
      PI,
      frameCount,
      perlin,
      pace,
      noiseIncX,
      noiseIncY,
      flowField,
      fieldX,
      fieldY,
    } = this

    for (let i = 0; i < fieldX; i++) {
      for (let j = 0; j < fieldY; j++) {
        const noiseValue = perlin.noiseOf(
          noiseIncX * i * pace,
          noiseIncY * j * pace,
          (frameCount % 100) * random() * 0.013
        )

        const angle = (noiseValue - 0.5) * 8 * PI

        const force = p5.Vector.fromAngle(angle, 1)

        flowField[j * fieldX + i] = force
      }
    }
  }

  draw(): void {
    const { fieldX, fieldY, pace, flowField } = this

    this.background(51)
    this.updateField()

    // for (let i = 0; i < fieldX; i++) {
    //   for (let j = 0; j < fieldY; j++) {
    //     const v = flowField[j * fieldX + i]

    //     const x = i * pace
    //     const y = j * pace

    //     this.line(x, y, x + v.x * pace, y + v.y * pace)
    //   }
    // }

    this.particles.forEach((particle) => {
      particle.follow(flowField)
      particle.edges()
      particle.draw()
    })
  }
}

new Sketch()
