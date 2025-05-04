let trees = [];
let edges = [];
let treeIdCounter = 0;
let selectedTree = null;
let logsCreated = 0;
let movesTaken = 0;
let forestMode = "prime"; // default mode



// ===============canvas and draw===================================

function setup() {
  createCanvas(800, 600);
  textFont('Arial');
  console.log("Canvas initialized.");
}

function draw() {
  background(230);
  drawEdges();

  for (let tree of trees) {
    tree.draw();
  }

  // draw line while dragging
  if (selectedTree) {
    stroke(0, 100);
    line(selectedTree.x, selectedTree.y, mouseX, mouseY);
  }

  drawUI();
}

function drawUI() {
    fill(50);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);

    // Count trees by health color
    let greenCount = 0;
    let yellowCount = 0;
    let redCount = 0;
    let blackCount = 0;

    for (let tree of trees) {
    switch (tree.health) {
      case 'green': greenCount++; break;
      case 'yellow': yellowCount++; break;
      case 'red': redCount++; break;
      case 'black': blackCount++; break;
      }
    }
    text(`🪵 Logs: ${logsCreated}`, 10, 10);
    text(`🎯 Moves: ${movesTaken}`, 10, 30);

    fill(0, 200, 0);   // green
    text(`🟢: ${greenCount}`, 10, 60);

    fill(255, 215, 0); // yellow
    text(`🟡: ${yellowCount}`, 10, 80);

    fill(220, 20, 60); // red
    text(`🔴: ${redCount}`, 10, 100);

    fill(0);           // black
    text(`⚫: ${blackCount}`, 10, 120);

    text(`🧠 Rule: ${forestMode}`, 10, 140);
}

// ===============mouse==========================================

function mousePressed() {
  selectedTree = getTreeUnderMouse();
}

function mouseReleased() {
  if (selectedTree) {
    let targetTree = getTreeUnderMouse();
    if (targetTree && targetTree !== selectedTree) {
      createEdge(selectedTree, targetTree);
      movesTaken++;
    }
    selectedTree = null;
  } else {
    createTree(mouseX, mouseY);
  }
}

function getTreeUnderMouse() {
  for (let tree of trees) {
    if (dist(mouseX, mouseY, tree.x, tree.y) < 15) {
      return tree;
    }
  }
  return null;
}


// hover + C is to cut trees
function keyPressed() {
  console.log(`Key pressed: ${key}`);
  if (key === 'c') {
    let hoveredTree = getTreeUnderMouse();
    if (hoveredTree) {
      cutTree(hoveredTree);
      console.log(`🪓 Tree ${hoveredTree.id} cut down. Total logs: ${logsCreated}`);
    }
  }

  // Toggle forest rules
  if (key === '1') forestMode = "prime";
  if (key === '2') forestMode = "coprime";
  if (key === '3') forestMode = "mod5";
  if (key === '4') forestMode = "perfectSquare";

  console.log(`🌲 Forest mode set to: ${forestMode}`);
  }
  
// ===============functions=========================================
// function to create a node
function createTree(x, y) {
    let value = floor(random(0, 100));
    let tree = new Tree(treeIdCounter++, value, x, y);
    trees.push(tree);
    movesTaken++;
    console.log(`🌱 New tree created: ID=${tree.id}, Value=${tree.value}, X=${tree.x}, Y=${tree.y}`);
  
    // AUTO-CONNECTION based on different game modes
    switch (forestMode) {
        case "prime":
          if (tree.isPrime()) {
            for (let other of trees) {
              if (other !== tree && other.isPrime()) {
                createEdge(tree, other, { skipUpdate: true });
              }
            }
          }
          break;
    
        case "coprime":
          for (let other of trees) {
            if (other !== tree && gcd(tree.value, other.value) === 1) {
              createEdge(tree, other, { skipUpdate: true });
            }
          }
          break;
    
        case "mod5":
          for (let other of trees) {
            if (other !== tree && (tree.value % 5 === other.value % 5)) {
              createEdge(tree, other, { skipUpdate: true });
            }
          }
          break;
    
        case "perfectSquare":
          if (isPerfectSquare(tree.value)) {
            for (let other of trees) {
              if (other !== tree && isPerfectSquare(other.value)) {
                createEdge(tree, other, { skipUpdate: true });
              }
              if (isPerfectSquare(tree.value) && other !== tree) {
                createEdge(tree, other, { skipUpdate: true });
              }
            }
          }
          break;
      }
    updateAllEdgeCounts();  // 🟢 Also update visuals and health states
  }

// moves particularly is black are incremented one more time. this is because when prime is called, it calls on funciton ____ multiple times which increment black counut multiple times even though its only supoose to be implememted once in this case

// function to create an edge
function createEdge(a, b, { skipUpdate = false } = {}) {
    // prevent duplicates
    for (let edge of edges) {
      if ((edge[0] === a.id && edge[1] === b.id) ||
          (edge[1] === a.id && edge[0] === b.id)) {
        return;
      }
    }
  
    edges.push([a.id, b.id]);         // Add the connection
    console.log(`🔗 Edge created between Tree ${a.id} and Tree ${b.id}`);
    
    if (!skipUpdate) {
        updateAllEdgeCounts(); // Recompute edge counts + health
      }
    }

  function updateAllEdgeCounts() {
    // Reset all edge counts
    for (let tree of trees) {
      tree.edgeCount = 0;
    }
  
    // Recount based on current edge list
    for (let [idA, idB] of edges) {
      let a = trees.find(t => t.id === idA);
      let b = trees.find(t => t.id === idB);
      if (a && b) {
        a.edgeCount++;
        b.edgeCount++;
      }
    }
    
    // Update health color based on edge count
    for (let tree of trees) {
      tree.updateHealth();
    }

    // Remove black trees that have been isolated for 2 or more turns
    trees = trees.filter(tree => {
    const isDying = tree.health === 'black' && tree.turnsBlack >= 4;
    if (isDying) {
      console.log(`💀 Tree ${tree.id} died from isolation.`);
    }
      return !isDying;
    });
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

  function cutTree(tree) {
    // Remove all edges involving this tree
    edges = edges.filter(edge => {
      return edge[0] !== tree.id && edge[1] !== tree.id;
    });
  
    // Remove the tree from the trees array
    trees = trees.filter(t => t !== tree);
  
    // Increment log counter
    logsCreated++;
  
    // Recalculate edge counts and health
    updateAllEdgeCounts();
  }
  

  
// ==============tree class=========================================

class Tree {
  constructor(id, value, x, y) {
    this.id = id;
    this.value = value;
    this.x = x;
    this.y = y;
    this.health = 'black';  // default
    this.edgeCount = 0;     // will be updated later
    this.turnsBlack = 0;
  }

  draw() {
    let c;
    switch (this.health) {
      case 'green':  c = color(0, 200, 0); break;
      case 'yellow': c = color(255, 215, 0); break;
      case 'red':    c = color(220, 20, 60); break;
      case 'black':  c = color(0); break;
      default:       c = color(180);
    }
  
    stroke(0);
    fill(c);
    ellipse(this.x, this.y, 30, 30);
  
    fill(255);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text(this.value, this.x, this.y);
    
  }
  

  isPrime() {
    if (this.value < 2) return false;
    for (let i = 2; i <= Math.sqrt(this.value); i++) {
      if (this.value % i === 0) return false;
    }
    return true;
  }
  
  updateHealth() {
    const n = this.edgeCount;
    console.log(`Tree ${this.id} has ${n} edge(s)`);
  
    if (n >= 3) {
        this.health = 'green';
        this.turnsBlack = 0;
      } else if (n === 2) {
        this.health = 'yellow';
        this.turnsBlack = 0;
      } else if (n === 1) {
        this.health = 'red';
        this.turnsBlack = 0;
      } else {
        this.health = 'black';
        this.turnsBlack++;
      }
  
    console.log(`→ Health set to ${this.health}`);
  }

}

// ===============helper functions==================================

function gcd(a, b) {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  }
  
  function isPerfectSquare(n) {
    return Number.isInteger(Math.sqrt(n));
  }
  

// add tree graphics 
// implement better logic than isprime 
// toggle between dynamic ecosystem rules! 
// starting location with five trees!


// rule book and purpose on the side draw UI 