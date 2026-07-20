"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

export const AnimatedTestimonials = ({ testimonials }) => {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // --- Dynamic Sizing Constants based on initial screen width ---
    const isMobile = window.innerWidth < 768;
    const dynamicRadius = isMobile ? 3.8 : 5.5;
    const cardWidth = isMobile ? 3.2 : 4.5;
    const cardHeight = isMobile ? 2.4 : 3.0;
    const cameraZOffset = isMobile ? 7.5 : 5.5;

    // --- Scene setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, dynamicRadius + cameraZOffset);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // --- Enhanced Studio Lighting Setup ---
    scene.add(new THREE.AmbientLight(0xffffff, 2.2));

    const key = new THREE.PointLight(0xffffff, 80, 30);
    key.position.set(0, 3, dynamicRadius + 2);
    scene.add(key);

    const rim = new THREE.PointLight(0x3b82f6, 45, 25);
    rim.position.set(-6, -1, -2);
    scene.add(rim);

    // --- Build card meshes ---
    const group = new THREE.Group();
    scene.add(group);
    const angleStep = (Math.PI * 2) / testimonials.length;
    const meshes = [];

    testimonials.forEach((t, i) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 700;

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      drawCard(canvas, t, () => {
        texture.needsUpdate = true;
      });

      // Using the calculated responsive configuration sizes
      const geo = new THREE.PlaneGeometry(cardWidth, cardHeight, 1, 1);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.05,
        transparent: true,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);

      const angle = i * angleStep;
      mesh.position.set(Math.sin(angle) * dynamicRadius, 0, Math.cos(angle) * dynamicRadius);
      mesh.rotation.y = angle;
      group.add(mesh);
      meshes.push(mesh);
    });

    // --- Drag to rotate ---
    let isDragging = false;
    let prevX = 0;
    let targetRotY = 0;
    let currentRotY = 0;
    let velocity = 0;

    const onDown = (e) => {
      isDragging = true;
      prevX = e.touches ? e.touches[0].clientX : e.clientX;
      velocity = 0;
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const dx = x - prevX;
      prevX = x;
      velocity = dx * 0.005;
      targetRotY += velocity;
    };
    const onUp = () => {
      if (!isDragging) return;
      isDragging = false;
      const nearest = Math.round(targetRotY / angleStep) * angleStep;
      targetRotY = nearest;
      const idx = (((-nearest / angleStep) % testimonials.length) + testimonials.length) % testimonials.length;
      setActive(Math.round(idx));
    };

    mount.addEventListener("mousedown", onDown);
    mount.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    mount.addEventListener("touchstart", onDown, { passive: true });
    mount.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    // --- Mouse parallax on camera ---
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
      const r = mount.getBoundingClientRect();
      mouseX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouseY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    mount.addEventListener("mousemove", onMouseMove);

    stateRef.current.goTo = (index) => {
      const angle = -index * angleStep;
      let diff = angle - targetRotY;
      diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
      targetRotY += diff;
    };

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      currentRotY += (targetRotY - currentRotY) * 0.08;
      group.rotation.y = currentRotY;

      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 1.0 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      meshes.forEach((m) => {
        const worldQuat = new THREE.Quaternion();
        m.getWorldQuaternion(worldQuat);
        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(worldQuat);
        const toCamera = camera.position.clone().sub(m.getWorldPosition(new THREE.Vector3())).normalize();
        const facing = forward.dot(toCamera);
        const t = THREE.MathUtils.clamp((facing - 0.3) / 0.7, 0, 1);

        m.material.opacity = THREE.MathUtils.lerp(0.35, 1, t);
        const s = THREE.MathUtils.lerp(0.85, 1, t);
        m.scale.set(s, s, s);
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      
      // Responsive adjustments inside the active resize loop thread
      const isMobileNow = window.innerWidth < 768;
      camera.position.z = (isMobileNow ? 3.8 : 5.5) + (isMobileNow ? 7.5 : 5.5);
      
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
      mount.removeEventListener("mousedown", onDown);
      mount.removeEventListener("mousemove", onMove);
      mount.removeEventListener("touchstart", onDown);
      mount.removeEventListener("touchmove", onMove);
      mount.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [testimonials]);

  const goTo = (idx) => {
    const clamped = ((idx % testimonials.length) + testimonials.length) % testimonials.length;
    setActive(clamped);
    stateRef.current.goTo?.(clamped);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-16 font-sans text-white select-none overflow-hidden">
      <div className="text-center mb-4 md:mb-6">
        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-2 md:mb-3">
          From Our Community
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 px-2">
          Builders who shipped with presets
        </h2>
        <p className="text-xs md:text-base text-neutral-400 max-w-xl mx-auto px-4">
          Drag cards to spin the deck or use arrows below.
        </p>
      </div>

      {/* RESPONSIVE HEIGHT SCALE: Scaled down gracefully to h-[420px] on mobile devices */}
      <div
        ref={mountRef}
        className="w-full h-[420px] md:h-[640px] cursor-grab active:cursor-grabbing overflow-visible mx-auto"
      />

      <div className="flex flex-col items-center gap-4 md:gap-6 mt-2">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => goTo(active - 1)}
            className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 hover:border-neutral-600 hover:text-white text-neutral-400 transition-colors shadow-xl"
          >
            <IconArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          <div className="flex items-center gap-2 md:gap-2.5">
            {testimonials.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 md:h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  i === active ? "w-6 md:w-8 bg-white" : "w-1.5 md:w-2 bg-neutral-700 hover:bg-neutral-500"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(active + 1)}
            className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 hover:border-neutral-600 hover:text-white text-neutral-400 transition-colors shadow-xl"
          >
            <IconArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>

        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-mono text-center px-4">
          Use Arrows or Drag • Auto-Advances Every 5s
        </span>
      </div>
    </div>
  );
};

function drawCard(canvas, t, onImageLoad) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height, r = 48;

  ctx.fillStyle = "#121214";
  roundRect(ctx, 0, 0, w, h, r);
  ctx.fill();

  ctx.strokeStyle = "#2d2d34";
  ctx.lineWidth = 5;
  roundRect(ctx, 2, 2, w - 4, h - 4, r);
  ctx.stroke();

  ctx.fillStyle = "#27272a";
  ctx.font = "italic 160px Georgia, serif";
  ctx.fillText("“", 65, 170);

  ctx.fillStyle = "#ffffff";
  ctx.font = "42px sans-serif";
  wrapText(ctx, t.quote, 80, 240, w - 160, 58, 6);

  ctx.strokeStyle = "#222226";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, h - 200);
  ctx.lineTo(w - 80, h - 200);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText(t.name, 80, h - 125);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "28px sans-serif";
  ctx.fillText(t.designation, 80, h - 75);

  if (t.src) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = t.src;
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(w - 140, h - 110, 65, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, w - 205, h - 175, 130, 130);
      ctx.restore();

      if (onImageLoad) onImageLoad();
    };
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Fixed argument assignments inside the rendering engine loop
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(" ");
  let line = "";
  let lines = 0;
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + " ";
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
      lines++;
      if (lines >= maxLines) {
        ctx.fillText(line.trim() + "…", x, y);
        return;
      }
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y);
}