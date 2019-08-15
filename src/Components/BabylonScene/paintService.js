import { isTouchDevice } from '../../utils/isTouchDevice'
import { chromeModifier } from '../../utils/chromeModifier'

const map_range = (value, low1, high1, low2, high2) => {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

let lastCurrent = {x: 99, y:99};

const radius = isTouchDevice() ? chromeModifier(20) : chromeModifier(20)

const checkIfFarEnough = (oldVector, newVector) => {
  const distance = 0.07;
  const check1 = (oldVector.x !== newVector.x) && (oldVector.y !== newVector.y)
  const check2x = ((oldVector.x + distance) < newVector.x) || ((oldVector.x - distance) > newVector.x)
  const check2y = ((oldVector.y + distance) < newVector.y) || ((oldVector.y - distance) > newVector.y)
  return check1 && (check2x && check2y)
}

export const paint = (textureContext, textureGround, {width, height}, {width: pixelWidth, height: pixelHeight}, current, isTouchDeviceCheck) => {
  // this check might help improving the performance
  const distanceIsEnough = checkIfFarEnough(lastCurrent, current)
  if (distanceIsEnough) {
    lastCurrent = current
    // const drawCircle = (r, x, y, polar, ctx, gradient) => {
    //     if (polar) {
    //         let a = x;
    //         let d = y;
    //         x = Math.cos(a) * d;
    //         y = Math.sin(a) * d;
    //     }
    //     ctx.beginPath();
    //     ctx.arc(x, y, r, 0, Math.PI * 2);
    //     ctx.fillStyle = gradient;
    //     ctx.strokeStyle = gradient;
    //     ctx.fill();
    //     ctx.closePath()
    // }


    const maxX = width / 2
    const minX = -width / 2
    const maxY = height / 2
    const minY = -height / 2
    const touchingCardX = (current.x > minX) && (current.x < maxX)
    const touchingCardY = (current.y > minY) && (current.y < maxY)
    if (touchingCardX && touchingCardY) {
      const x = map_range(current.x, minX, maxX, 0, pixelWidth)
      const y = pixelHeight - map_range(current.y, minY, maxY, 0, pixelHeight)
      const gradient = textureContext.createRadialGradient(x, y, (radius - 10), x, y, (radius + 10));
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      textureContext.beginPath();
      textureContext
        .arc(Math.floor(x), Math.floor(y), radius, 0, 2 * Math.PI)
      textureContext.globalCompositeOperation = "destination-out";
      textureContext.strokeStyle = gradient;
      textureContext.fillStyle = gradient;
      textureContext.fill();
      textureContext.closePath();

      textureGround.update();
    }
  }
}