const map_range = (value, low1, high1, low2, high2) => {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

export const paint = (textureContext, textureGround, {width, height}, {width: pixelWidth, height: pixelHeight}, current, isTouchDeviceCheck) => {

    const drawCircle = (r, x, y, polar, ctx, gradient) => {
        if (polar) {
            let a = x;
            let d = y;
            x = Math.cos(a) * d;
            y = Math.sin(a) * d;
        }
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.strokeStyle = gradient;
        ctx.fill();
        ctx.closePath()
    }

  const radius = isTouchDeviceCheck ? 40 : 60

    const maxX =  width / 2
    const minX = - width / 2
    const maxY = height / 2
    const minY = - height / 2
    const touchingCardX = (current.x > minX) && (current.x < maxX)
    const touchingCardY = (current.y > minY) && (current.y < maxY)
    if (touchingCardX && touchingCardY) {
        const x = map_range(current.x, minX, maxX, 0, pixelWidth)
        const y = pixelHeight - map_range(current.y, minY, maxY, 0, pixelHeight)
        const gradient = textureContext.createRadialGradient(x, y, (radius - 10), x, y, (radius + 10));
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        // const maxDist=8;
        // const points=new Array();
        // for (let i = 0; i < 15; i++) {
        //     let d=Math.pow(Math.random(),2);
        //     const a=Math.random()*Math.PI*2;
        //     const r=0.1+(Math.pow(1-d,2)*4);
        //     d*=maxDist;
        //     points.push({
        //         d:d,
        //         a:a,
        //         r:r
        //     });
        // }
        textureContext.beginPath();
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