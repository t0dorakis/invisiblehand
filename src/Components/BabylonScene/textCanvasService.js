const normalWidth = 500
const normalHeight = 900

const headlineText = 'Invisible\nHand'
const secondLineText = 'Artist Consultancy &\nLabel Management'
const thirdLineText = 'shaking\nhands for:'

const fontName = 'aktiv-grotesk'

export const loadFonts = () => document.fonts.load(`10pt ${fontName}`).then(res => res)


export const artistsList = ['MARCEL DETTMANN', 'FJAAK | Spandau20', 'LACKRec', 'GIAN', 'I$A', 'VICTOR']

export const textCanvasService = (texture, windowWidth, windowHeight) => {
    const ctx = texture.getContext('2d');

    const fontSizeHeadline = 80
    const lineHeightHeadline = 70
    const getInitialText = () => {
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(0, 0, windowWidth, windowHeight);
        const headLines = headlineText.split('\n');
        const x = ctx.canvas.width / 2;
        const y = 100;

        ctx.textAlign = "center";
        headLines.forEach((headline, index) => {
            ctx.font = `bold ${fontSizeHeadline}px ${fontName}`;
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 4;
            ctx.miterLimit=2;
            ctx.lineJoin = 'round'
            ctx.strokeText(headline, x, y + (index*lineHeightHeadline) );
            ctx.fillStyle = 'white';
            ctx.fillText(headline, x, y + (index*lineHeightHeadline) );
        })
        const fontSizeSecondLine = 20
        const lineHeightsecondLine = 24
        const secondLine = secondLineText.split('\n');
        secondLine.forEach((headline, index) => {
            ctx.font = `lighter ${fontSizeSecondLine}px aktiv-grotesk`;
            ctx.fillStyle = 'black';
            ctx.fillText(headline, x, y * (headLines.length) + (index*lineHeightsecondLine) );
        })
        const fontSizeThirdLine = 30
        const lineHeighThirdLine = 27
        const thirdLine = thirdLineText.split('\n');
        thirdLine.forEach((line, index) => {
            ctx.font = `italic ${fontSizeThirdLine}px aktiv-grotesk`;
            ctx.fillStyle = 'black';
            ctx.fillText(line, x, y + 280 + (index*lineHeighThirdLine) );
        })
        return ctx
    }
    return getInitialText()
}

export const changingArtistNames = (ctx, number, windowWidth, windowHeight) => {
    const y = 10;
    const x = ctx.canvas.width / 2;
    const fontSizeThirdLine = 30
    const lineHeighThirdLine = 27
    let previousArtistDoubleLine = false;
    if (number > 0) {
        previousArtistDoubleLine = artistsList[0].split('\n').length > 1;
    }
    const artist = artistsList[number].split('\n');
    // if (number === artistsList.length - 1) {
    //     ctx.beginPath();
    //     ctx.fillStyle = 'white';
    //     ctx.fillRect(x, y + 200, 1000, 2000);
    //     ctx.closePath();
    // }
    const artistModifer = previousArtistDoubleLine ? 2 : 1
    artist.forEach((line, index) => {
        ctx.font = `lighter ${fontSizeThirdLine}px aktiv-grotesk`;
        ctx.fillStyle = 'black';
        ctx.fillText(line, x, y + 230 + (lineHeighThirdLine * (number + artistModifer)) + (index * lineHeighThirdLine));
    })
    return ctx
}

let counter = 0
export const smallTextAnimation = (dynamicTexture, sizes) => {
  if (counter >= artistsList.length) counter = 0

  const ctx = dynamicTexture.getContext();
  const fontType = 'aktiv-grotesk'
  const text = artistsList[counter]
  const size = 12; //any value will work
  ctx.font = size + "px " + fontType;
  const textWidth = ctx.measureText(text).width;


  //Calculate ratio of text width to size of font used
  const ratio = textWidth/size;

  //set font to be actually used to write text on dynamic texture
  // const fontSize = Math.floor(sizes.width / (ratio * 1.5)); //size of multiplier (1) can be adjusted, increase for smaller text
  const fontSize = 40;
  const font = fontSize + "px " + fontType;

  //Draw text
  dynamicTexture.drawText(text, null, null, font, "#000000", "#fffaf7", true);
  counter ++
}