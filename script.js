import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const loader = document.querySelector("#loader");
const enter = document.querySelector("#enter");
const clock = document.querySelector("#clock");
const sound = document.querySelector("#sound");

setTimeout(() => loader.classList.add("done"), 1700);

enter.onclick = () =>
  document.querySelector("#cosmos").scrollIntoView({
    behavior: "smooth"
  });

function time() {
  clock.textContent = new Date().toLocaleTimeString([], {
    hour12: false
  });
}

time();
setInterval(time, 1000);

sound.onclick = () => {
  sound.textContent = sound.textContent === "◌" ? "◉" : "◌";
};


// ==============================
// INTERACTIVE PARTICLE FIELD
// ==============================

const field = document.querySelector("#field");
const parts = [];
const N = 120;

let pointer = {
  x: -999,
  y: -999
};

for (let i = 0; i < N; i++) {
  const e = document.createElement("i");

  e.className = "p";

  const p = {
    e,
    x: Math.random() * 100,
    y: Math.random() * 100,
    dx: 0,
    dy: 0
  };

  e.style.left = p.x + "%";
  e.style.top = p.y + "%";

  field.appendChild(e);
  parts.push(p);
}

field.onpointermove = (e) => {
  const r = field.getBoundingClientRect();

  pointer = {
    x: ((e.clientX - r.left) / r.width) * 100,
    y: ((e.clientY - r.top) / r.height) * 100
  };
};

field.onpointerleave = () => {
  pointer = {
    x: -999,
    y: -999
  };
};

(function loop() {
  for (const p of parts) {
    const dx = p.x - pointer.x;
    const dy = p.y - pointer.y;
    const d = Math.hypot(dx, dy);

    if (d < 18) {
      const f = (18 - d) / 18;

      p.dx = (dx / (d || 1)) * f * 10;
      p.dy = (dy / (d || 1)) * f * 10;
    } else {
      p.dx *= 0.9;
      p.dy *= 0.9;
    }

    p.e.style.transform =
      `translate(${p.dx}px,${p.dy}px)`;
  }

  requestAnimationFrame(loop);
})();


// ==============================
// THREE.JS STARFIELD
// ==============================

const canvas = document.querySelector("#space");

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(
  Math.min(devicePixelRatio, 1.5)
);

renderer.setSize(
  innerWidth,
  innerHeight,
  false
);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  100
);

camera.position.z = 12;


// ==============================
// STARS
// ==============================

const geo = new THREE.BufferGeometry();

const amount = 1500;

const pos = new Float32Array(amount * 3);

for (let i = 0; i < amount; i++) {
  pos[i * 3] =
    (Math.random() - 0.5) * 45;

  pos[i * 3 + 1] =
    (Math.random() - 0.5) * 30;

  pos[i * 3 + 2] =
    (Math.random() - 0.5) * 35;
}

geo.setAttribute(
  "position",
  new THREE.BufferAttribute(pos, 3)
);

const stars = new THREE.Points(
  geo,
  new THREE.PointsMaterial({
    color: 0xaecbff,
    size: 0.035,
    transparent: true,
    opacity: 0.8
  })
);

scene.add(stars);


// ==============================
// CAMERA MOVEMENT
// ==============================

let mx = 0;
let my = 0;

addEventListener("pointermove", (e) => {
  mx =
    (e.clientX / innerWidth - 0.5) * 0.35;

  my =
    (e.clientY / innerHeight - 0.5) * 0.2;
});


// ==============================
// RENDER LOOP
// ==============================

(function render() {

  stars.rotation.y += 0.00025;
  stars.rotation.x += 0.00006;

  camera.position.x +=
    (mx - camera.position.x) * 0.015;

  camera.position.y +=
    (-my - camera.position.y) * 0.015;

  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);

  requestAnimationFrame(render);

})();


// ==============================
// RESPONSIVE
// ==============================

addEventListener("resize", () => {

  renderer.setSize(
    innerWidth,
    innerHeight,
    false
  );

  camera.aspect =
    innerWidth / innerHeight;

  camera.updateProjectionMatrix();

});
