
function setup() {
  createCanvas(300, 300);

}

function draw() {
  background(32);


}

function mouseClicked() {
  if (isMouseInsideText(message, messageX, messageY)) {
    window.open('https://blacklivesmatter.com/', '_blank');
  }
}
