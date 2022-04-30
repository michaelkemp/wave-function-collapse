const xDim = 10;
const yDim = 4;
const pSize = 15;
let PIECES = [];
let EDGES = []; 

class Piece {
    constructor(image, index, uE, rE, dE, lE) {
        this.image = image;
        this.index = index;
        this.uE = uE;
        this.rE = rE;
        this.dE = dE;
        this.lE = lE;
        this.u = [];
        this.r = [];
        this.d = [];
        this.l = [];
    }
    display(x, y, imgSize) {
        image(this.image, x, y, imgSize, imgSize);
    }
}

function loadPieces() {
    for(let y=0; y<yDim; ++y) {
        for(let x=0; x<xDim; ++x) {
            img = createImage(pSize, pSize);
            img.copy(srcImage, x * pSize, y * pSize, pSize, pSize, 0, 0, pSize, pSize);
            let i = (y * xDim) + x;
            let [uE, rE, dE, lE] = edges(img);
            PIECES[i] = new Piece(img, i, uE, rE, dE, lE);
        }
    }
    // Write Edge Matches into Pieces
    for(let i=0; i<PIECES.length; ++i) {
        let testU = PIECES[i].uE;
        let testR = PIECES[i].rE;
        let testD = PIECES[i].dE;
        let testL = PIECES[i].lE
        let matchU = [];
        let matchR = [];
        let matchD = [];
        let matchL = [];
        for(let j=0; j<PIECES.length; ++j) {
            if (testU == PIECES[j].dE) matchU.push(parseInt(j));
            if (testR == PIECES[j].lE) matchR.push(parseInt(j));
            if (testD == PIECES[j].uE) matchD.push(parseInt(j));
            if (testL == PIECES[j].rE) matchL.push(parseInt(j));
        }
        PIECES[i].u = [...matchU];
        PIECES[i].r = [...matchR];
        PIECES[i].d = [...matchD];
        PIECES[i].l = [...matchL];
    }
}

// Calculate an Edge Index based on Pixel Color of Each Edge
function edges(image) {
    image.loadPixels();
    let x, y, ind, r, g, b, a;
    let uE, rE, dE, lE;
    let up="";
    let right="";
    let down="";
    let left="";
    for(let i=0 ;i<pSize; ++i) {
        //up
        y=0; x=i;
        ind = (x + y*pSize)*4
        r = image.pixels[ind+0];
        g = image.pixels[ind+1];
        b = image.pixels[ind+2];
        a = image.pixels[ind+3];
        up+=r+"-"+g+"-"+b+"-"
        //down
        y=pSize-1; x=i;
        ind = (x + y*pSize)*4
        r = image.pixels[ind+0];
        g = image.pixels[ind+1];
        b = image.pixels[ind+2];
        a = image.pixels[ind+3];
        down+=r+"-"+g+"-"+b+"-"
        //left
        x=0; y=i;
        ind = (x + y*pSize)*4
        r = image.pixels[ind+0];
        g = image.pixels[ind+1];
        b = image.pixels[ind+2];
        a = image.pixels[ind+3];
        left+=r+"-"+g+"-"+b+"-"
        //right
        x=pSize-1; y=i;
        ind = (x + y*pSize)*4
        r = image.pixels[ind+0];
        g = image.pixels[ind+1];
        b = image.pixels[ind+2];
        a = image.pixels[ind+3];
        right+=r+"-"+g+"-"+b+"-"
    }
    uE = EDGES.indexOf(up);
    if (uE == -1) {
        EDGES.push(up);
        uE = EDGES.length-1;
    }
    rE = EDGES.indexOf(right);
    if (rE == -1) {
        EDGES.push(right);
        rE = EDGES.length-1;
    }
    dE = EDGES.indexOf(down);
    if (dE == -1) {
        EDGES.push(down);
        dE = EDGES.length-1;
    }
    lE = EDGES.indexOf(left);
    if (lE == -1) {
        EDGES.push(left);
        lE = EDGES.length-1;
    }
    return [uE,rE,dE,lE];
}