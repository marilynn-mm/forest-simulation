


let trees = [];
let edges = [];
let selectedTree = null;
let turnCount = 0;
let logsCreated = 0;
let treeIdCounter = 0;

function setup() {
  createCanvas(800, 600);
  textFont('Arial');
}

function draw() {
  background(230);
  drawEdges();
  for (let tree of trees) {
    tree.draw();
  }
  drawUI();
}

function mousePressed() {
  selectedTree = getTreeUnderMouse();
}

function mouseReleased() {
  if (selectedTree) {
    let targetTree = getTreeUnderMouse();
    if (targetTree && targetTree !== selectedTree) {
      createEdge(selectedTree, targetTree);
    }
    selectedTree = null;
    endTurn();
  }
}

function keyPressed() {
  if (key === 'N') createTree(); // 'N' = new tree
  if (key === 'C') {
    let t = getTreeUnderMouse();
    if (t) {
      cutTree(t);
      endTurn();
    }
  }
}

function createTree() {
  let value = floor(random(0, 100));
  let x = random(50, width - 50);
  let y = random(50, height - 50);
  let tree = new Tree(treeIdCounter++, value, x, y);
  trees.push(tree);

  if (tree.isPrime()) {
    for (let other of trees) {
      if (other !== tree && other.isPrime()) {
        createEdge(tree, other);
      }
    }
  }

  tree.updateHealth();
  endTurn();
}

function createEdge(a, b) {
  // Avoid duplicates
  for (let edge of edges) {
    if ((edge[0] === a.id && edge[1] === b.id) ||
        (edge[1] === a.id && edge[0] === b.id)) {
      return;
    }
  }
  edges.push([a.id, b.id]);
  a.edges.add(b.id);
  b.edges.add(a.id);
  a.updateHealth();
  b.updateHealth();
}

function cutTree(tree) {
  // Remove all edges to/from this tree
  edges = edges.filter(edge => {
    if (edge[0] === tree.id || edge[1] === tree.id) {
      let otherId = edge[0] === tree.id ? edge[1] : edge[0];
      let other = trees.find(t => t.id === otherId);
      if (other) {
        other.edges.delete(tree.id);
        other.updateHealth();
      }
      return false;
    }
    return true;
  });

  trees = trees.filter(t => t !== tree);
  logsCreated++;
}

function endTurn() {
  turnCount++;
  for (let tree of trees) {
    if (tree.edges.size === 0) {
      tree.deadTurns++;
      if (tree.deadTurns >= 2) {
        cutTree(tree);
      }
    } else {
      tree.deadTurns = 0;
    }
    tree.updateHealth();
  }
}

function getTreeUnderMouse() {
  for (let tree of trees) {
    if (tree.isMouseOver(mouseX, mouseY)) {
      return tree;
    }
  }
  return null;
}

function drawEdges() {
  stroke(120);
  strokeWeight(2);
  for (let [idA, idB] of edges) {
    let a = trees.find(t => t.id === idA);
    let b = trees.find(t => t.id === idB);
    if (a && b) {
      line(a.x, a.y, b.x, b.y);
    }
  }
}

function drawUI() {
  noStroke();
  fill(50);
  textSize(14);
  text(`🌲 Trees: ${trees.length}`, 10, 20);
  text(`🪓 Logs: ${logsCreated}`, 10, 40);
  text(`🎮 Turns: ${turnCount}`, 10, 60);
}

// Tree class
class Tree {
  constructor(id, value, x, y) {
    this.id = id;
    this.value = value;
    this.x = x;
    this.y = y;
    this.edges = new Set();
    this.health = 'black';
    this.deadTurns = 0;
  }

  isPrime() {
    if (this.value < 2) return false;
    for (let i = 2; i <= sqrt(this.value); i++) {
      if (this.value % i === 0) return false;
    }
    return true;
  }

  updateHealth() {
    const n = this.edges.size;
    if (n >= 3) this.health = 'green';
    else if (n === 2) this.health = 'yellow';
    else if (n === 1) this.health = 'red';
    else this.health = 'black';
  }

  draw() {
    stroke(0);
    fill(this.health);
    ellipse(this.x, this.y, 30, 30);
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text(this.value, this.x, this.y);
  }

  isMouseOver(mx, my) {
    return dist(mx, my, this.x, this.y) < 15;
  }
}


-----------------

let trees = [];
let treeIdCounter = 0;

// -- Basic styling to show the canvas and printing tree
function setup() {
  createCanvas(800, 600);
  background(230);
  textFont('Arial');
  console.log("Canvas initialized.");
}
function draw() {
  background(230);
  for (let tree of trees) {
    tree.draw();
  }
}

// Detech for when tree is created
function mousePressed() {
  let value = floor(random(0, 100));
  let x = mouseX;
  let y = mouseY;
  let tree = new Tree(treeIdCounter++, value, x, y);
  trees.push(tree);

  console.log(`🌱 New tree created: ID=${tree.id}, Value=${tree.value}, X=${tree.x}, Y=${tree.y}`);
}

// Tree object
class Tree {
  constructor(id, value, x, y) {
    this.id = id;
    this.value = value;
    this.x = x;
    this.y = y;
  }

  draw() {
    fill(100, 200, 100);
    stroke(0);
    ellipse(this.x, this.y, 30, 30);

    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text(this.value, this.x, this.y);
  }
}

