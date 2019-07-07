const normalWidth = 500
const normalHeight = 900

const headlineText = 'Invisible\nHand'
const secondLineText = 'ARTIST\nCONSULTANCY'
const thirdLineText = 'shaking\nhands for:'

export const artistsList = ['MARCEL\nDETTMANN', 'FJAAK', 'GIAN', 'I$A', 'VICTOR']

export const textCanvasService = (texture, windowWidth, windowHeight) => {
    const ctx = texture.getContext('2d');

    const fontSizeHeadline = 80
    const lineHeightHeadline = 70

    const getInitialText = () => {
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(0, 0, windowWidth, windowHeight);
        const headLines = headlineText.split('\n');
        const x = 25;
        const y = 100;
        headLines.forEach((headline, index) => {
            ctx.font = `${fontSizeHeadline}px aktiv-grotesk`;
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 6;
            ctx.miterLimit=2;
            ctx.lineJoin = 'round'
            ctx.strokeText(headline, x, y + (index*lineHeightHeadline) );
            ctx.fillStyle = 'white';
            ctx.fillText(headline, x, y + (index*lineHeightHeadline) );
        })
        const fontSizeSecondLine = 30
        const lineHeightsecondLine = 27
        const secondLine = secondLineText.split('\n');
        secondLine.forEach((headline, index) => {
            ctx.font = `lighter ${fontSizeSecondLine}px aktiv-grotesk`;
            ctx.fillStyle = 'black';
            ctx.fillText(headline, x, y * (headLines.length + 0.2) + (index*lineHeightsecondLine) );
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
    const y = 195;
    const x = 25;
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
        ctx.fillText(line, x, y + 230 + (lineHeighThirdLine * (number + artistModifer)) + (index *lineHeighThirdLine));
    })
    return ctx
}