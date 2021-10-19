import { tick, acceleration, reverse, friction, steeringRadius, height, width, rocketWidth, vehicleheight, vehicleWidth } from './constants.js';
import { adjacent, position, opposite } from './util.js';

// TODO: 
// create the MovingEntity, Rocket and Vehicle classes 
// following the instructions in the README.

class MovingEntity {
    /**
     * Construct a MovingObject.
     * @param {*} id The identifier.
     * @param {Number} t The time t in milliseconds.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Number} speed The speed expressed in pixels/second.
     * @param {Number} angle The angle expressed in radians.
     */
    constructor(id, t, x, y, speed, angle) {
        this.id = id
        this.t = t
        this.x = x
        this.y = y
        this.speed = speed
        this.angle = angle
    }

    move() {
        throw new Error("Not implemented");
    }

    render(context) {
        throw new Error("Not implemented");
    }
}

class Rocket extends MovingEntity {
    /**
     * Construct a Rocket.
     * @param {*} id The identifier.
     * @param {Number} t The time t.
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {Number} speed The speed expressed in pixels/second.
     * @param {Number} angle The angle expressed in radians.
     */
    constructor(id, t, x, y, speed, angle) {
        super(id, t, x, y, speed, angle)
    }

    move() {
        this.t += tick
        const hypothenuse =  this.speed * tick/1000
        this.x = position(this.x + adjacent(hypothenuse, this.angle), width)
        this.y = position(this.y + opposite(hypothenuse, this.angle), height)
    }
    
    render(context) {
        
        context.beginPath();
        context.arc(this.x - rocketWidth/2, this.y, rocketWidth, 0, 2 * Math.PI);
        context.fillStyle = 'black'
        context.fill()
        context.stroke()
        
    }
}

/**
 * @param {MovingEntity} object to move
 */
function straightMove(movingEntity){
    movingEntity.t += tick
    const hypothenuse =  movingEntity.speed * tick/1000
    movingEntity.x = position(x + adjacent(hypothenuse, movingEntity.angle), width)
    movingEntity.y = position(y + opposite(hypothenuse, movingEntity.angle), height)
}

class Vehicle extends MovingEntity{
    /**
     * Construct a Vehicle.
     * @param {*} id The identifier.
     * @param {*} t The time t.
     * @param {*} x The x coordinate.
     * @param {*} y The y coordinate.
     * @param {*} speed The speed expressed in pixels/second.
     * @param {*} angle The angle expressed in radians.
     * @param {*} color The color expressed in RGB hex code.
     */
    constructor(id, t, x, y, speed, angle, isAccelerating, isReversing, isTurningLeft, isTurningRight, color) {
        super(id, t, x, y, speed, angle)
        this.isAccelerating = isAccelerating
        this.isReversing = isReversing
        this.isTurningLeft = isTurningLeft
        this.isTurningRight = isTurningRight
        this.color = color
        if(this.isTurningRight) {
            this.xCenter = position(x - adjacent(steeringRadius,angle - Math.PI/2), width)
            this.yCenter = position(y - opposite(steeringRadius, angle - Math.PI/2), height)
        } else if (this.isTurningLeft) {
            this.xCenter = position(x + adjacent(steeringRadius,angle - Math.PI/2), width)
            this.yCenter = position(y + opposite(steeringRadius, angle - Math.PI/2), height)

        }
    }

    move() {
        this.speed *= friction
        if (this.isAccelerating)
            this.speed += acceleration
        if (this.isReversing) 
            this.speed -= reverse

        var arc = this.speed*tick/1000
        var absoluteAngDiplacement = arc/steeringRadius
        var angularDisplacement = this.isTurningLeft ? -absoluteAngDiplacement : this.isTurningRight ? absoluteAngDiplacement : 0
        
        if (angularDisplacement == 0){
            const hypothenuse =  this.speed * tick/1000
            this.x = position(this.x + adjacent(hypothenuse, this.angle), width)
            this.y = position(this.y + opposite(hypothenuse, this.angle), height)
        } else {
            var cos = Math.cos(angularDisplacement)
            var sin = Math.sin(angularDisplacement) 
            var futX = position((cos * (this.x - this.xCenter)) - (sin * (this.y - this.yCenter)) + this.xCenter, width)
            var futY = position((cos * (this.y - this.yCenter)) + (sin * (this.x - this.xCenter)) + this.yCenter, height) 
            this.x = futX
            this.y = futY
            this.angle = (this.angle + angularDisplacement) % (Math.PI*2)
            }
        

    }

    render(context) {
        context.beginPath();
        context.rect(this.x-vehicleWidth/2, this.y-vehicleheight/2, vehicleWidth, vehicleheight)
        context.stroke()
    }
}

export { MovingEntity, Vehicle, Rocket };
