
export const paint = (textureContext, textureGround, fingerPosition, fingerIsTouching) => {

    const drawCircle = (r, x, y, polar, ctx) => {
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

    const radius = 50;
    const x = fingerPosition.x;
    const y = fingerPosition.y;

    const gradient = textureContext.createRadialGradient(x, y, (radius - 10), x, y, (radius + 10));
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    console.log(textureGround)

    const maxDist=8;
    const points=new Array();
    for (let i = 0; i < 15; i++) {
        let d=Math.pow(Math.random(),2);
        const a=Math.random()*Math.PI*2;
        const r=0.1+(Math.pow(1-d,2)*4);
        d*=maxDist;
        points.push({
            d:d,
            a:a,
            r:r
        });
    }
    textureContext.beginPath();
    textureContext.beginPath();
    textureContext
        .arc(x, y, radius, 0, 2 * Math.PI)
    textureContext.globalCompositeOperation = "destination-out";
    textureContext.strokeStyle = gradient;
    textureContext.fillStyle = gradient;
    textureContext.fill();
    textureContext.closePath();


    textureGround.update();
}