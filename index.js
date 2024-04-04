const radius = 25;
let vertexObjArr = [];
let touchedVertex = [];
let drawVertices = [];
let drawEdges = [];
let edgeObjArr = [];




class Vertex{
    constructor(id, x, y, visited){
        this.id = id;
        this.x = x;
        this.y = y;
        this.visited = visited;
        this.radius = radius;
    }

    show(){
        noStroke();
        fill(255)
        if(this.getVisited()){
            fill(255,0,0);
        }else{
            fill(255)
        }
        circle(this.x, this.y, this.radius)
    }

    setVisited(value=false){
        this.visited = value
    }

    getVisited(){
        return this.visited;
    }


    clicked(){
        let d = dist(mouseX, mouseY, this.x, this.y);
        if(d < this.radius){
            return true;
        }else{
            return false;
        }
    }
}

class Edge{
    constructor(weight, x1, y1, x2, y2, chosen){
        this.weight = weight;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.slope = (this.y2 - this.y1)/(this.x2 - this.x1); 
        this.chose = chosen;
        this.middle_pnt_x = (this.x1 + this.x2)/2
        this.middle_pnt_y = (this.y1 + this.y2)/2 
    }

    getMiddleX(){
        return this.middle_pnt_x
    }

    getMiddleY(){
        return this.middle_pnt_y
    }

    setChosen(value = false){
        this.chose = value;
    }
    getChosen(){
        return this.chose
    }

    show(){
        noStroke();
        text(this.weight, this.middle_pnt_x, this.middle_pnt_y);
        stroke(255, 165, 0);
        if(this.chose){
            stroke(255, 0, 0);
        }
        strokeWeight(this.weight/2);
        line(this.x1, this.y1, this.x2, this.y2)
    }




    clicked(){
        let isHit = (mouseY - this.y1) == this.slope * (mouseX - this.x1);
        if(isHit){
            console.log('hit');
        }else{
            console.log(isHit);
        }
    }
}


function setup() {
  createCanvas(1000, 1000);

  background(100);
  textSize(20);
  createGraph(6,5);
}

function mousePressed(){
    touchedVertex.forEach((vert)=>{
        if(vert.clicked()){
            if(vert.getVisited()){
                vert.setVisited(false);
            }else{
                vert.setVisited(true);
            }
            console.log(vert)
        }
    })
    fill(255)
    edgeObjArr.forEach((edge)=>{
        if (isMouseInsideText(edge.weight, edge.getMiddleX(), edge.getMiddleY())) {
            if(edge.getChosen()){
                edge.setChosen(false);
            }else{
                edge.setChosen(true);
            }
        }
    })

}

function draw() {
    background(100);
    drawAllEdges();
    drawAllVertices();
}


function isMouseInsideText(message, messageX, messageY) {
    const messageWidth = textWidth(message);
    const messageTop = messageY - textAscent();
    const messageBottom = messageY + textDescent();
  
    return mouseX > messageX && mouseX < messageX + messageWidth &&
      mouseY > messageTop && mouseY < messageBottom;
  }


function drawAllVertices(){
    drawVertices.forEach((vertex)=>{
        vertex.show()
    })
}

function drawAllEdges(){
    drawEdges.forEach((edge)=>{
        edge.show()
    })
}

function createGraph(num_of_edges, num_of_vertices){
    let num_edges_created = 0;
    createVertices(num_of_vertices);
    let current_vert = vertexObjArr[getRndInteger(0,vertexObjArr.length)];
    touchedVertex.push(current_vert);
    let current_vert_idx = vertexObjArr.indexOf(current_vert);
    console.log(current_vert)
    if(current_vert_idx > -1){
        vertexObjArr.splice(current_vert_idx, 1);
    }
    while(vertexObjArr.length > 0){
        let neighbour_node = vertexObjArr[getRndInteger(0,vertexObjArr.length)]
        if(!(touchedVertex.includes(neighbour_node))){
            let rndWeight = getRndInteger(3,10);
            createEdge(rndWeight, current_vert, neighbour_node,false);
            num_edges_created += 1;
            let neighbour_node_idx = vertexObjArr.indexOf(neighbour_node);
            if(neighbour_node_idx > -1){
                vertexObjArr.splice(neighbour_node_idx, 1);
            }
            touchedVertex.push(neighbour_node);
        }
        current_vert = neighbour_node;
    }

    console.log(num_edges_created);
    let diff_edges = num_of_edges - num_edges_created;
    console.log(diff_edges);
    while(diff_edges > 0){
        let current_vert = touchedVertex[getRndInteger(0,touchedVertex.length)];
        let neighbour_node = touchedVertex[getRndInteger(0, touchedVertex.length)];
        if(current_vert != neighbour_node){
            let rndWeight = getRndInteger(3,10);
            createEdge(rndWeight, current_vert, neighbour_node, false)
            diff_edges -= 1;
        }
    }
    console.log(touchedVertex);
    console.log(edgeObjArr);
    drawVertices = touchedVertex;
    drawEdges = edgeObjArr;
}

function createEdge(weight, vert1, vert2, chosen){
    let edge = new Edge(weight, vert1.x, vert1.y, vert2.x, vert2.y, chosen);
    edgeObjArr.push(edge);
}

function createVertices(n=1){

    for(let i = 1; i <= n; i++){

        let randX = getRndInteger(200,800);
        let randY = getRndInteger(100,400);

        let vertex = new Vertex(i , randX, randY, false);

        vertexObjArr.push(vertex);
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }