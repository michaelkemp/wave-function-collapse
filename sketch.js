// Preload Source Image
let srcImage;

function preload() {
  srcImage = loadImage('circuit2.png');
}

const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []);
const DIM = 50;
const TILE = 7;
const WIDE = DIM * TILE;
const PCOUNT = 36;
let ALL = [];
let tiles = [];
let reductions = [];

function setup() {
  loadPieces();
  for(let i=0; i<PIECES.length; ++i) {
    ALL[i] = i;
  }
  loadTiles();
  for (let i = 0; i < DIM * DIM; ++i) {
    reductions[i] = PCOUNT;
  }
  createCanvas(WIDE, WIDE);
  background(240);

  // SEED CHIPS
  for(let i=0; i<10; ++i) {
    tmp = Math.floor(Math.random() * DIM * DIM);
    reductions[tmp] = 100;
    tiles[tmp].available = [...[0]];
    tiles[tmp].collapse();
    propagate(tmp);
    PIECES[tiles[tmp].tile].display( tiles[tmp].x, tiles[tmp].y, tiles[tmp].wide );
  }
}


function draw() {
  let min = Math.min(...reductions);
  if (min == 100) {
    noLoop();
    return;
  } else {
    let tmp = indexOfAll(reductions, min);
    coll = tmp[Math.floor(Math.random() * tmp.length)];
  }
  tiles[coll].collapse();
  reductions[coll] = 100;
  propagate(coll);

  PIECES[tiles[coll].tile].display( tiles[coll].x, tiles[coll].y, tiles[coll].wide );
}

function urdl(i) {
  let u = i >= DIM ? i - DIM : -1;
  let r = (i + 1) % DIM > 0 ? i + 1 : -1;
  let d = i < DIM * DIM - DIM ? i + DIM : -1;
  let l = i % DIM > 0 ? i - 1 : -1;
  return [u, r, d, l];
}

function reduce(i) {
  const [up, rt, dn, lt] = urdl(i);
  let FILTER = [...ALL];
  if (up >= 0 && tiles[up].collapsed) {
    FILTER = ALL.filter((x) => PIECES[tiles[up].tile].d.includes(x));
  }
  if (rt >= 0 && tiles[rt].collapsed) {
    FILTER = FILTER.filter((x) => PIECES[tiles[rt].tile].l.includes(x));
  }
  if (dn >= 0 && tiles[dn].collapsed) {
    FILTER = FILTER.filter((x) => PIECES[tiles[dn].tile].u.includes(x));
  }
  if (lt >= 0 && tiles[lt].collapsed) {
    FILTER = FILTER.filter((x) => PIECES[tiles[lt].tile].r.includes(x));
  }
  tiles[i].available = [...FILTER];
  reductions[i] = FILTER.length;
}

function propagate(i) {
  const [up, rt, dn, lt] = urdl(i);
  let test = tiles[i].tile;
  if ((up >= 0) && (!tiles[up].collapsed)) reduce(up);
  if ((rt >= 0) && (!tiles[rt].collapsed)) reduce(rt);
  if ((dn >= 0) && (!tiles[dn].collapsed)) reduce(dn);
  if ((lt >= 0) && (!tiles[lt].collapsed)) reduce(lt);
}

class Tile {
  constructor(i, x, y, width) {
    this.index = i;
    this.x = x * width;
    this.y = y * width;
    this.wide = width;
    this.available = [...ALL];
    this.collapsed = false;
    this.tile = -1;
  }
  collapse() {
    if (this.available.length > 0) {
      this.tile = this.available[
        Math.floor(Math.random() * this.available.length)
      ];
    } else {
      // KLUDGE
      console.log("K:", this.index);
      this.tile = 1;
    }
    this.available = [...[this.tile]];
    this.collapsed = true;
  }
}

function loadTiles() {
  for (let i = 0; i < DIM * DIM; ++i) {
    let x = i % DIM;
    let y = floor(i / DIM);
    tiles[i] = new Tile(i, x, y, TILE);
  }
}

