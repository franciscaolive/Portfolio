class AsciiAnimation {
  constructor(element) {
    this.element = element;
    this.frameIndex = 0;

    // cat animation frames
    this.frames = [
      `   /\\_/\\  
  ( o.o ) 
   > ^ <
  /|   |\\
 (_|   |_)`,

      `   /\\_/\\  
  ( ^.^ ) 
   > ~ <
  /|   |\\
 (_|   |_)`,

      `   /\\_/\\  
  ( -.- ) 
   > ^ <
  /|   |\\
 (_|   |_)`,

      `   /\\_/\\  
  ( o.o ) 
   > w <
  /|   |\\
 (_|   |_)`,
    ];

    this.animate();
  }

  animate() {
    this.element.textContent = this.frames[this.frameIndex];
    this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    setTimeout(() => this.animate(), 500); // changes frame every 500ms
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const asciiElement = document.getElementById("ascii-animation");
  if (asciiElement) {
    new AsciiAnimation(asciiElement);
  }
});
