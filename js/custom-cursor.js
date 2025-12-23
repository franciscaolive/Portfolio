document.addEventListener("DOMContentLoaded", () => {
  // checks if the device is a touchscreen
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    return; // doesnt appear on touchscreens
  }

  const cursor = document.createElement("div");
  const cursorFollower = document.createElement("div");
  cursor.classList.add("cursor");
  cursorFollower.classList.add("cursor-follower");
  document.body.appendChild(cursor);
  document.body.appendChild(cursorFollower);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let followerX = 0;
  let followerY = 0;
  let isInitialized = false;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isInitialized) {
      cursorX = mouseX;
      cursorY = mouseY;
      followerX = mouseX;
      followerY = mouseY;
      cursor.style.opacity = "1";
      cursorFollower.style.opacity = "0.4";
      isInitialized = true;
    }
  });

  function animate() {
    cursorX = mouseX;
    cursorY = mouseY;

    const fdx = mouseX - followerX;
    const fdy = mouseY - followerY;
    followerX += fdx * 0.15;
    followerY += fdy * 0.15;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    cursorFollower.style.transform = `translate(${followerX - 4}px, ${
      followerY - 4
    }px)`;

    requestAnimationFrame(animate);
  }

  animate();

  const interactiveElements = document.querySelectorAll(
    'a, button, input, textarea, select, [role="button"]'
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
      cursorFollower.classList.add("hover");
    });

    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
      cursorFollower.classList.remove("hover");
    });
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    cursorFollower.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    if (isInitialized) {
      cursor.style.opacity = "1";
      cursorFollower.style.opacity = "0.4";
    }
  });
});
