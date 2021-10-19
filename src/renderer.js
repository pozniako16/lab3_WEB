import { width, height, steeringRadius } from './constants.js';
import { Vehicle, Rocket } from './model.js';


/**
 * A class that renders the state of the game.
 */
class Renderer {
  /**
   * Constructor.
   * @param {*} game The state of the game.
   * @param {*} canvas The canvas element used to render the game.
   */
  constructor(game, context) {
    this.game = game;
    this.context = context;
  }

  /**
   * Draws the moving entity with context of the canvas
   */
  render() {
    // Reset the context
    this.context.strokeStyle = 'rgb(0, 0, 0)';
    this.context.font = '11px Arial';
    this.context.clearRect(0, 0, width, height);

    // Draw the entities
    for (let entity of this.game.entities) {
      // TODO:
      // Use the save, translate, rotate and restore methods of the context
      // to render the moving entities at the right place and angle.
      
      this.context.save()
      this.context.translate(entity.x, entity.y)
      this.context.rotate(entity.angle)
      this.context.translate(-entity.x, -entity.y)
      
      entity.render(this.context)      
      this.renderDebug(entity);
      this.context.restore()
      
      
    }
  }

  renderDebug(entity) {
    this.context.fillStyle = 'rgba(0, 0, 0, 0.25)';
    this.context.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    let i = 12;
    let x = entity.x - 20;
    let y = entity.y + 20;
    for (let k of Object.keys(entity)) {
      const v = entity[k];
      if (typeof v === 'number') {
        this.context.fillText(`${k}: ${v.toFixed(0)}`, x, y += i);
      }
    }
    if (!(entity.isTurningLeft ^ entity.isTurningRight)) {
      this.context.beginPath();
      this.context.moveTo(entity.x - 80, entity.y);
      this.context.lineTo(entity.x + 80, entity.y);
      this.context.stroke();
    }
    if (entity.isTurningLeft) {
      this.context.beginPath();
      this.context.arc(entity.x, entity.y - steeringRadius,
        steeringRadius, (Math.PI * 1) / 4, (Math.PI * 3) / 4);
      this.context.stroke();
    }
    if (entity.isTurningRight) {
      this.context.beginPath();
      this.context.arc(entity.x, entity.y + steeringRadius,
        steeringRadius, (Math.PI * 5) / 4, (Math.PI * 7) / 4);
      this.context.stroke();
    }
  }

}

export default Renderer;
