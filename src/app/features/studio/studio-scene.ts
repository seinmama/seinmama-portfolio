import * as THREE from 'three';
import { STUDIO_SCREEN } from '../../data/studio';

/**
 * The 3D studio: a three.js room with a desk of clickable objects and an orbiting camera.
 * Ported from `design_handoff_3d_studio/reference/Studio 3D.dc.html` (`init()`), which is the
 * source of truth for every value. Browser-only: never construct this during SSR.
 */

export type HotId = 'work' | 'stack' | 'about' | 'contact' | 'lamp';
/** Hot objects that open a panel (the lamp toggles day/night instead). */
export type FocusId = Exclude<HotId, 'lamp'>;

interface Pose {
  yaw: number;
  pitch: number;
  dist: number;
  tx: number;
  ty: number;
  tz: number;
}

interface HotObject {
  group: THREE.Group;
  mats: THREE.MeshStandardMaterial[];
}

type Draw = (g: CanvasRenderingContext2D, w: number, h: number) => void;

const DAY = new THREE.Color('#efe9df');
const NIGHT = new THREE.Color('#1a1c2d');
const GLASS_DAY = new THREE.Color('#ffffff');
const GLASS_NIGHT = new THREE.Color('#3a4170');
const BULB_DAY = new THREE.Color('#d8d1c4');
const BULB_NIGHT = new THREE.Color('#fff3cf');
const HOVER_GLOW = '#ff9a50';

const INTRO_VIEW: Pose = { yaw: 0.8, pitch: 0.72, dist: 13, tx: 0, ty: 1.15, tz: 0 };
const USER_VIEW: Pose = { yaw: 0.32, pitch: 0.36, dist: 4.9, tx: 0, ty: 1.12, tz: 0 };
const FOCUS: Record<FocusId, Pose> = {
  work: { yaw: 0, pitch: 0.1, dist: 2.0, tx: -0.15, ty: 1.6, tz: -0.3 },
  stack: { yaw: -0.5, pitch: 0.34, dist: 1.65, tx: 0.84, ty: 1.2, tz: 0.06 },
  about: { yaw: 0.3, pitch: 0.45, dist: 1.25, tx: 0.36, ty: 1.08, tz: 0.32 },
  contact: { yaw: 0.4, pitch: 0.85, dist: 1.2, tx: -0.9, ty: 1.02, tz: 0.26 },
};

// Light intensities: hemisphere, sun, fill, desk-lamp spot, lamp glow, monitor glow.
const LIGHTS_DAY = { h: 1.0, s: 1.8, f: 0.35, sp: 0, lg: 0, mg: 0 };
const LIGHTS_NIGHT = { h: 0.16, s: 0.06, f: 0.05, sp: 9, lg: 1.4, mg: 0.9 };

const MARKERS: [HotId, number, number, number][] = [
  ['work', -0.15, 1.98, -0.3],
  ['stack', 0.84, 1.5, 0.06],
  ['about', 0.36, 1.3, 0.32],
  ['contact', -0.9, 1.18, 0.26],
  ['lamp', -0.8, 1.68, -0.23],
];

/** Wide screens shift the scene left so the side panel doesn't cover the focused object. */
const PANEL_OFFSET_MIN_WIDTH = 760;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const isFocusId = (id: string | null): id is FocusId => !!id && id in FOCUS;

export class StudioScene {
  private el!: HTMLElement;
  private renderer!: THREE.WebGLRenderer;
  private canvas!: HTMLCanvasElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private fog!: THREE.Fog;
  private readonly timer = new THREE.Timer();
  private ro?: ResizeObserver;
  private raf = 0;
  private disposed = false;
  private rendered = false;

  // Animated pieces.
  private hot = {} as Record<HotId, HotObject>;
  private markers: THREE.Sprite[] = [];
  private steam: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>[] = [];
  private leaves!: THREE.Group;
  private codeTex!: THREE.CanvasTexture;
  private glassM!: THREE.MeshBasicMaterial;
  private bulbM!: THREE.MeshBasicMaterial;
  private hemi!: THREE.HemisphereLight;
  private sun!: THREE.DirectionalLight;
  private fill!: THREE.DirectionalLight;
  private spot!: THREE.SpotLight;
  private lampGlow!: THREE.PointLight;
  private monGlow!: THREE.PointLight;

  // Camera rig: `cur` eases toward `goal` every frame; `userView` remembers the free-look pose.
  private readonly cur: Pose = { ...INTRO_VIEW };
  private readonly userView: Pose = { ...USER_VIEW };
  private readonly goal: Pose = { ...USER_VIEW };
  private offX = 0;

  private focused: FocusId | null = null;
  private night = false;

  // Picking and pointer state.
  private readonly ray = new THREE.Raycaster();
  private readonly ndc = new THREE.Vector2();
  private targets: THREE.Object3D[] = [];
  private hov: HotId | null = null;
  private down: { x: number; y: number; yaw: number; pitch: number } | null = null;
  private moved = false;

  private pickCb?: (id: HotId | null) => void;
  private hoverCb?: (id: HotId | null) => void;
  private readyCb?: () => void;

  /** Builds the scene into `el` and starts the render loop. Rejects if WebGL is unavailable. */
  async init(el: HTMLElement): Promise<void> {
    // Canvas textures draw text, so wait for the fonts first (best effort).
    try {
      await Promise.all([
        document.fonts.load("600 64px 'JetBrains Mono'"),
        document.fonts.load("700 24px 'Manrope'"),
      ]);
    } catch {}
    if (this.disposed) return;

    this.el = el;
    const renderer = (this.renderer = new THREE.WebGLRenderer({ antialias: true }));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(this.W(), this.H());
    renderer.shadowMap.enabled = true;
    // The prototype's PCFSoftShadowMap was removed in r18x; three falls back to PCFShadowMap.
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    const cv = (this.canvas = renderer.domElement);
    cv.style.display = 'block';
    cv.style.touchAction = 'none';
    el.appendChild(cv);

    this.scene = new THREE.Scene();
    this.scene.background = DAY.clone();
    this.fog = new THREE.Fog(DAY.clone(), 12, 24);
    this.scene.fog = this.fog;
    this.camera = new THREE.PerspectiveCamera(38, this.W() / this.H(), 0.05, 80);

    this.build();
    if (this.focused) Object.assign(this.goal, FOCUS[this.focused]);
    this.bindInput();

    this.ro = new ResizeObserver(() => {
      this.renderer.setSize(this.W(), this.H());
      this.camera.aspect = this.W() / this.H();
      this.camera.updateProjectionMatrix();
    });
    this.ro.observe(el);

    this.timer.connect(document);
    this.loop();
  }

  /** Flies the camera to a hot object's pose, or back to the free-look view with `null`. */
  focus(id: FocusId | null): void {
    this.focused = isFocusId(id) ? id : null;
    Object.assign(this.goal, this.focused ? FOCUS[this.focused] : this.userView);
  }

  setNight(night: boolean): void {
    this.night = night;
  }

  /** Fires on a click (not a drag) with the hot object under the pointer, or `null` for empty space. */
  onPick(cb: (id: HotId | null) => void): void {
    this.pickCb = cb;
  }

  /** Fires when the hovered hot object changes. */
  onHover(cb: (id: HotId | null) => void): void {
    this.hoverCb = cb;
  }

  /** Fires once, after the first frame has rendered. */
  onReady(cb: () => void): void {
    this.readyCb = cb;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    this.pickCb = this.hoverCb = this.readyCb = undefined;
    this.timer.dispose();
    if (!this.renderer) return;

    const cv = this.canvas;
    cv.removeEventListener('pointerdown', this.onDown);
    cv.removeEventListener('pointermove', this.onMove);
    cv.removeEventListener('pointerup', this.onUp);
    cv.removeEventListener('pointerleave', this.onLeave);
    cv.removeEventListener('wheel', this.onWheel);

    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.Sprite) {
        geometries.add(o.geometry);
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) materials.add(m);
      }
    });
    this.sun.shadow.dispose();
    this.spot.shadow.dispose();
    for (const m of materials) {
      for (const v of Object.values(m)) if (v instanceof THREE.Texture) textures.add(v);
    }
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());

    this.renderer.dispose();
    this.renderer.forceContextLoss();
    cv.remove();
  }

  private W = () => this.el.clientWidth || window.innerWidth;
  private H = () => this.el.clientHeight || window.innerHeight;

  // ---------------------------------------------------------------- build

  private build(): void {
    const scene = this.scene;
    const rr = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      g.beginPath();
      g.roundRect(x, y, w, h, r);
    };
    const ctex = (w: number, h: number, draw: Draw) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      draw(c.getContext('2d')!, w, h);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      return t;
    };
    const M = (c: THREE.ColorRepresentation, o: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, metalness: 0, ...o });
    const B = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
    const add = <G extends THREE.BufferGeometry, Mt extends THREE.Material>(
      geo: G,
      mat: Mt,
      p: THREE.Object3D,
      x = 0,
      y = 0,
      z = 0,
      cast = true,
    ) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = cast;
      m.receiveShadow = true;
      p.add(m);
      return m;
    };
    const group = (x: number, y: number, z: number, parent: THREE.Object3D = scene) => {
      const g = new THREE.Group();
      g.position.set(x, y, z);
      parent.add(g);
      return g;
    };

    // room
    const floorTex = ctex(512, 512, (g, w) => {
      for (let r = 0; r < 8; r++) {
        const y = r * 64;
        g.fillStyle = r % 2 ? '#d8bd95' : '#dfc6a2';
        g.fillRect(0, y, w, 64);
        g.fillStyle = '#c4a67c';
        g.fillRect(0, y, w, 2);
        for (let x = (r * 173) % 256; x < w; x += 256) g.fillRect(x, y, 2, 64);
      }
    });
    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(3, 3);
    add(new THREE.PlaneGeometry(16, 16), M('#ffffff', { map: floorTex, roughness: 0.85 }), scene, 0, 0, 0, false).rotation.x = -Math.PI / 2;
    add(new THREE.PlaneGeometry(16, 8), M('#f5f0e7', { roughness: 0.95 }), scene, 0, 4, -4, false);
    add(new THREE.PlaneGeometry(16, 8), M('#efe8dc', { roughness: 0.95 }), scene, -5.5, 4, 0, false).rotation.y = Math.PI / 2;
    add(B(16, 0.16, 0.04), M('#fbfaf6'), scene, 0, 0.08, -3.98, false);
    const rug = add(new THREE.CircleGeometry(2.6, 64), M('#e9e2d6', { roughness: 1 }), scene, 0, 0.005, 0.2, false);
    rug.rotation.x = -Math.PI / 2;
    rug.scale.set(1, 0.72, 1);

    // window
    const win = group(-2.4, 2.7, -3.95);
    const frameM = M('#fbfaf6', { roughness: 0.5 });
    add(B(2.1, 0.1, 0.1), frameM, win, 0, 0.9, 0);
    add(B(2.1, 0.1, 0.1), frameM, win, 0, -0.9, 0);
    add(B(0.1, 1.9, 0.1), frameM, win, -1, 0, 0);
    add(B(0.1, 1.9, 0.1), frameM, win, 1, 0, 0);
    add(B(0.05, 1.7, 0.05), frameM, win, 0, 0, 0);
    add(B(1.9, 0.05, 0.05), frameM, win, 0, 0.05, 0);
    add(B(2.4, 0.06, 0.24), frameM, win, 0, -0.98, 0.08);
    const skyTex = ctex(256, 256, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, '#9fd2ef');
      gr.addColorStop(0.75, '#dcf0fa');
      gr.addColorStop(1, '#f3fafc');
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(255,255,255,.95)';
      for (const [x, y, r] of [[60, 70, 34], [92, 60, 26], [180, 120, 24], [204, 112, 18]]) {
        g.beginPath();
        g.arc(x, y, r, 0, 7);
        g.fill();
      }
      g.fillStyle = '#bcd9a6';
      g.beginPath();
      g.ellipse(128, h + 30, 200, 70, 0, 0, 7);
      g.fill();
    });
    this.glassM = new THREE.MeshBasicMaterial({ map: skyTex, toneMapped: false });
    add(new THREE.PlaneGeometry(1.9, 1.7), this.glassM, win, 0, 0, -0.02, false);

    // shelf, poster
    const shelf = group(2.3, 2.3, -3.86);
    add(B(1.7, 0.05, 0.26), M('#fbfaf6'), shelf, 0, 0, 0);
    const books: [string, number, number][] = [
      ['#7f978c', 0.07, 0.32],
      ['#d98c6a', 0.06, 0.27],
      ['#6f7d99', 0.08, 0.3],
      ['#c9b79c', 0.05, 0.24],
      ['#e8a581', 0.07, 0.29],
    ];
    books.forEach(([c, w, h], i) => add(B(w, h, 0.2), M(c), shelf, -0.7 + i * 0.085, h / 2 + 0.025, 0));
    add(new THREE.CylinderGeometry(0.06, 0.07, 0.18, 20), M('#ece6da'), shelf, 0.45, 0.115, 0);
    const posterTex = ctex(512, 384, (g, w, h) => {
      g.fillStyle = '#f3ebdd';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#e59a6b';
      g.beginPath();
      g.arc(170, 130, 58, 0, 7);
      g.fill();
      g.fillStyle = '#9fb59b';
      g.beginPath();
      g.ellipse(160, h + 40, 260, 150, 0, 0, 7);
      g.fill();
      g.fillStyle = '#7d9884';
      g.beginPath();
      g.ellipse(380, h + 60, 240, 150, 0, 0, 7);
      g.fill();
    });
    const poster = group(0.9, 3.0, -3.96);
    add(B(1.1, 0.85, 0.04), M('#ffffff', { roughness: 0.5 }), poster, 0, 0, 0);
    add(new THREE.PlaneGeometry(0.95, 0.7), M('#ffffff', { map: posterTex, roughness: 0.9 }), poster, 0, 0, 0.021, false);

    // desk + chair
    add(B(2.6, 0.06, 1.2), M('#fbfaf7', { roughness: 0.45 }), scene, 0, 0.97, 0);
    const legM = M('#e6e3dc', { roughness: 0.5 });
    for (const [x, z] of [[-1.22, -0.52], [1.22, -0.52], [-1.22, 0.52], [1.22, 0.52]]) {
      add(B(0.06, 0.94, 0.06), legM, scene, x, 0.47, z);
    }
    const chair = group(-0.1, 0, 0.98);
    chair.rotation.y = 0.25;
    const chM = M('#d9d5cd', { roughness: 0.6 });
    const chD = M('#2b2a28', { roughness: 0.5, metalness: 0.3 });
    add(B(0.52, 0.07, 0.5), chM, chair, 0, 0.56, 0);
    add(B(0.5, 0.55, 0.06), chM, chair, 0, 0.9, 0.24);
    add(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 12), chD, chair, 0, 0.32, 0);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      add(B(0.32, 0.03, 0.04), chD, chair, Math.cos(a) * 0.16, 0.07, Math.sin(a) * 0.16).rotation.y = -a;
    }

    // interactive objects
    const mkHot = (id: HotId, x: number, y: number, z: number, ry = 0) => {
      const g = group(x, y, z);
      g.rotation.y = ry;
      this.hot[id] = { group: g, mats: [] };
      return g;
    };
    const hm = (id: HotId, c: THREE.ColorRepresentation, o?: THREE.MeshStandardMaterialParameters) => {
      const m = M(c, o);
      this.hot[id].mats.push(m);
      return m;
    };

    const mon = mkHot('work', -0.15, 1.0, -0.3);
    add(B(0.38, 0.02, 0.22), hm('work', '#d9d9dc', { metalness: 0.5, roughness: 0.35 }), mon, 0, 0.01, 0);
    add(B(0.05, 0.36, 0.05), hm('work', '#cfd0d4', { metalness: 0.5, roughness: 0.35 }), mon, 0, 0.19, -0.05);
    add(B(1.18, 0.7, 0.045), hm('work', '#1d1e22', { roughness: 0.4 }), mon, 0, 0.62, -0.02);
    const monTex = ctex(1024, 576, (g, w, h) => {
      g.fillStyle = '#fbf9f4';
      g.fillRect(0, 0, w, h);
      ['#ec6a5e', '#f4bf4f', '#61c554'].forEach((c, i) => {
        g.fillStyle = c;
        g.beginPath();
        g.arc(46 + i * 30, 40, 9, 0, 7);
        g.fill();
      });
      g.fillStyle = '#9a948a';
      g.font = "500 22px 'JetBrains Mono', monospace";
      g.textAlign = 'right';
      g.fillText(STUDIO_SCREEN.url, w - 40, 48);
      g.textAlign = 'left';
      g.fillStyle = '#1d1b19';
      g.font = "600 76px 'JetBrains Mono', monospace";
      g.fillText(STUDIO_SCREEN.greeting, 60, 200);
      g.fillStyle = '#f6e3d3';
      rr(g, 60, 236, 410, 46, 23);
      g.fill();
      g.fillStyle = '#b05a26';
      g.font = '700 22px Manrope, sans-serif';
      g.fillText(STUDIO_SCREEN.role, 84, 267);
      g.fillStyle = '#e7e1d6';
      rr(g, 60, 330, 780, 18, 9);
      g.fill();
      rr(g, 60, 366, 600, 18, 9);
      g.fill();
      ['#efe6d8', '#e1ece2', '#e4e8f2'].forEach((c, i) => {
        g.fillStyle = c;
        rr(g, 60 + i * 306, 420, 286, 110, 14);
        g.fill();
      });
    });
    add(new THREE.PlaneGeometry(1.12, 0.63), new THREE.MeshBasicMaterial({ map: monTex, toneMapped: false }), mon, 0, 0.62, 0.004, false);

    const lap = mkHot('stack', 0.84, 1.0, 0.06, -0.45);
    const alu = () => hm('stack', '#cfd2d7', { metalness: 0.55, roughness: 0.32 });
    add(B(0.62, 0.022, 0.42), alu(), lap, 0, 0.011, 0);
    add(new THREE.PlaneGeometry(0.5, 0.2), hm('stack', '#b4b7bd', { roughness: 0.6 }), lap, 0, 0.0225, 0.05, false).rotation.x = -Math.PI / 2;
    const lid = group(0, 0.022, -0.205, lap);
    lid.rotation.x = -0.24;
    add(B(0.62, 0.4, 0.014), alu(), lid, 0, 0.2, 0);
    this.codeTex = ctex(512, 512, (g, w, h) => {
      g.fillStyle = '#15171c';
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#101216';
      g.fillRect(0, 0, 44, h);
      const C = ['#c792ea', '#82aaff', '#c3e88d', '#f78c6c', '#89ddff', '#7a8193'];
      for (let i = 0, y = 22; y < h - 10; i++, y += 28) {
        const ind = [0, 1, 1, 2, 2, 1, 0, 1][i % 8];
        const wd = [260, 330, 200, 300, 170, 240, 140, 310][i % 8];
        g.fillStyle = '#3a3f4b';
        g.fillRect(14, y, 18, 8);
        g.fillStyle = C[i % 6];
        rr(g, 60 + ind * 26, y, wd, 10, 5);
        g.fill();
        if (i % 3 === 0) {
          g.fillStyle = C[(i + 2) % 6];
          rr(g, 60 + ind * 26 + wd + 12, y, 80, 10, 5);
          g.fill();
        }
      }
    });
    this.codeTex.wrapT = THREE.RepeatWrapping;
    add(new THREE.PlaneGeometry(0.57, 0.36), new THREE.MeshBasicMaterial({ map: this.codeTex, toneMapped: false }), lid, 0, 0.2, 0.0075, false);

    const mug = mkHot('about', 0.36, 1.0, 0.32);
    add(new THREE.CylinderGeometry(0.062, 0.056, 0.13, 28), hm('about', '#ffffff', { roughness: 0.35 }), mug, 0, 0.065, 0);
    add(new THREE.TorusGeometry(0.036, 0.011, 10, 20, Math.PI), hm('about', '#ffffff', { roughness: 0.35 }), mug, 0.06, 0.068, 0).rotation.z = -Math.PI / 2;
    add(new THREE.CircleGeometry(0.056, 28), M('#5d3a21', { roughness: 0.3 }), mug, 0, 0.124, 0, false).rotation.x = -Math.PI / 2;
    this.steam = [0, 1, 2].map((i) =>
      add(
        new THREE.SphereGeometry(0.018, 10, 10),
        new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }),
        mug,
        (i - 1) * 0.02,
        0.15,
        0,
        false,
      ),
    );

    const ph = mkHot('contact', -0.9, 1.0, 0.26, 0.35);
    add(B(0.1, 0.012, 0.2), hm('contact', '#1c1d21', { roughness: 0.3, metalness: 0.3 }), ph, 0, 0.006, 0);
    const phTex = ctex(128, 256, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, '#e59a6b');
      gr.addColorStop(1, '#9a5a2c');
      g.fillStyle = gr;
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#ffffff';
      g.textAlign = 'center';
      g.font = '700 26px Manrope, sans-serif';
      g.fillText('say hi', w / 2, h / 2);
      g.font = '500 14px Manrope, sans-serif';
      g.fillText('tap me', w / 2, h / 2 + 26);
    });
    add(new THREE.PlaneGeometry(0.088, 0.185), new THREE.MeshBasicMaterial({ map: phTex, toneMapped: false }), ph, 0, 0.0125, 0, false).rotation.x = -Math.PI / 2;

    const lamp = mkHot('lamp', -1.08, 1.0, -0.32, -0.3);
    const lampM = hm('lamp', '#2b2a28', { roughness: 0.45, metalness: 0.3, side: THREE.DoubleSide });
    add(new THREE.CylinderGeometry(0.09, 0.1, 0.03, 24), lampM, lamp, 0, 0.015, 0);
    add(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 12), lampM, lamp, 0, 0.27, 0);
    add(new THREE.CylinderGeometry(0.01, 0.01, 0.32, 12), lampM, lamp, 0.15, 0.52, 0).rotation.z = Math.PI / 2;
    add(new THREE.ConeGeometry(0.085, 0.13, 24, 1, true), lampM, lamp, 0.3, 0.47, 0);
    this.bulbM = new THREE.MeshBasicMaterial({ color: BULB_DAY.clone(), toneMapped: false });
    const bulb = add(new THREE.SphereGeometry(0.03, 14, 14), this.bulbM, lamp, 0.3, 0.43, 0, false);

    // decor
    const plant = group(1.12, 1.0, -0.4);
    add(new THREE.CylinderGeometry(0.08, 0.065, 0.14, 20), M('#d98c6a', { roughness: 0.7 }), plant, 0, 0.07, 0);
    const leaves = (this.leaves = group(0, 0.14, 0, plant));
    const lc = ['#6f9b6a', '#86b07d', '#7aa673', '#5e8a5c'];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const l = add(new THREE.SphereGeometry(1, 12, 10), M(lc[i % 4], { roughness: 0.7 }), leaves, Math.cos(a) * 0.035, 0.11, Math.sin(a) * 0.035);
      l.scale.set(0.028, 0.14, 0.012);
      l.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5);
    }
    add(B(0.66, 0.018, 0.2), M('#f3f3f5', { roughness: 0.5 }), scene, -0.15, 1.009, 0.14);
    add(new THREE.SphereGeometry(1, 16, 12), M('#f3f3f5', { roughness: 0.4 }), scene, 0.3, 1.012, 0.16).scale.set(0.03, 0.014, 0.05);
    add(B(0.26, 0.016, 0.34), M('#e8a581', { roughness: 0.8 }), scene, -0.62, 1.008, 0.08).rotation.y = 0.25;

    // markers
    const markTex = ctex(128, 128, (g) => {
      g.fillStyle = 'rgba(255,170,100,.35)';
      g.beginPath();
      g.arc(64, 64, 52, 0, 7);
      g.fill();
      g.strokeStyle = '#ffffff';
      g.lineWidth = 7;
      g.beginPath();
      g.arc(64, 64, 34, 0, 7);
      g.stroke();
      g.fillStyle = '#ff8f3d';
      g.beginPath();
      g.arc(64, 64, 16, 0, 7);
      g.fill();
    });
    this.markers = MARKERS.map(([id, x, y, z], i) => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: markTex, depthTest: false, transparent: true }));
      s.position.set(x, y, z);
      s.scale.setScalar(0.13);
      s.renderOrder = 10;
      s.userData = { hot: id, base: y, ph: i * 1.3 };
      scene.add(s);
      return s;
    });

    // lights
    this.hemi = new THREE.HemisphereLight('#fff8ee', '#cdb795', 1.0);
    scene.add(this.hemi);
    const sun = (this.sun = new THREE.DirectionalLight('#fff0d8', 1.8));
    sun.position.set(-3.5, 6.5, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 20 });
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);
    this.fill = new THREE.DirectionalLight('#dfe8ff', 0.35);
    this.fill.position.set(4, 3, 2);
    scene.add(this.fill);
    lamp.updateMatrixWorld(true);
    const bp = new THREE.Vector3();
    bulb.getWorldPosition(bp);
    const spot = (this.spot = new THREE.SpotLight('#ffd59a', 0, 3.2, 0.75, 0.6, 1.2));
    spot.position.copy(bp);
    spot.target.position.set(bp.x + 0.15, 1.0, bp.z + 0.1);
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    spot.shadow.bias = -0.0005;
    scene.add(spot, spot.target);
    this.lampGlow = new THREE.PointLight('#ffd59a', 0, 2.6, 2);
    this.lampGlow.position.copy(bp);
    scene.add(this.lampGlow);
    this.monGlow = new THREE.PointLight('#cfe0ff', 0, 2.2, 2);
    this.monGlow.position.set(-0.15, 1.6, 0.1);
    scene.add(this.monGlow);

    // pick targets: every mesh in a hot group, plus the markers
    for (const id of Object.keys(this.hot) as HotId[]) {
      this.hot[id].group.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.userData['hot'] = id;
          this.targets.push(o);
        }
      });
    }
    this.targets.push(...this.markers);
  }

  // ---------------------------------------------------------------- input

  private bindInput(): void {
    const cv = this.canvas;
    cv.addEventListener('pointerdown', this.onDown);
    cv.addEventListener('pointermove', this.onMove);
    cv.addEventListener('pointerup', this.onUp);
    cv.addEventListener('pointerleave', this.onLeave);
    cv.addEventListener('wheel', this.onWheel, { passive: false });
  }

  private pick(cx: number, cy: number): HotId | null {
    const r = this.canvas.getBoundingClientRect();
    this.ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.camera);
    const hit = this.ray.intersectObjects(this.targets, false)[0];
    return hit ? (hit.object.userData['hot'] as HotId) : null;
  }

  private setHover(id: HotId | null): void {
    if (id === this.hov) return;
    if (this.hov) {
      for (const m of this.hot[this.hov].mats) {
        m.emissive.set(0x000000);
        m.emissiveIntensity = 0;
      }
    }
    this.hov = id;
    if (id) {
      for (const m of this.hot[id].mats) {
        m.emissive.set(HOVER_GLOW);
        m.emissiveIntensity = 0.22;
      }
    }
    this.canvas.style.cursor = id ? 'pointer' : this.down ? 'grabbing' : 'grab';
    this.hoverCb?.(id);
  }

  private readonly onDown = (e: PointerEvent) => {
    this.down = { x: e.clientX, y: e.clientY, yaw: this.goal.yaw, pitch: this.goal.pitch };
    this.moved = false;
    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch {}
  };

  private readonly onMove = (e: PointerEvent) => {
    const down = this.down;
    if (down) {
      const dx = e.clientX - down.x;
      const dy = e.clientY - down.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) this.moved = true;
      if (this.moved) {
        this.goal.yaw = clamp(down.yaw - dx * 0.005, -1.1, 1.1);
        this.goal.pitch = clamp(down.pitch + dy * 0.004, 0.06, 1.05);
        if (!this.focused) {
          this.userView.yaw = this.goal.yaw;
          this.userView.pitch = this.goal.pitch;
        }
        this.setHover(null);
        this.canvas.style.cursor = 'grabbing';
        return;
      }
    }
    this.setHover(this.pick(e.clientX, e.clientY));
  };

  private readonly onUp = (e: PointerEvent) => {
    if (this.down && !this.moved) this.pickCb?.(this.pick(e.clientX, e.clientY));
    this.down = null;
    this.canvas.style.cursor = this.hov ? 'pointer' : 'grab';
  };

  private readonly onWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (this.focused) return;
    this.userView.dist = this.goal.dist = clamp(this.goal.dist * (1 + Math.sign(e.deltaY) * 0.08), 2.6, 8);
  };

  private readonly onLeave = () => this.setHover(null);

  // ---------------------------------------------------------------- loop

  private readonly loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    this.timer.update();
    const dt = Math.min(this.timer.getDelta(), 0.05);
    const t = this.timer.getElapsed();
    const k = 1 - Math.pow(0.0016, dt);
    const kl = 1 - Math.pow(0.02, dt);
    const { cur, goal, camera } = this;

    // camera rig
    if (!this.focused && !this.down) goal.yaw = this.userView.yaw + Math.sin(t * 0.25) * 0.03;
    for (const key of Object.keys(cur) as (keyof Pose)[]) cur[key] += (goal[key] - cur[key]) * k;
    const cp = Math.cos(cur.pitch);
    camera.position.set(
      cur.tx + cur.dist * Math.sin(cur.yaw) * cp,
      cur.ty + cur.dist * Math.sin(cur.pitch),
      cur.tz + cur.dist * Math.cos(cur.yaw) * cp,
    );
    camera.lookAt(cur.tx, cur.ty, cur.tz);
    const W = this.W();
    const H = this.H();
    const wantOff = this.focused && W > PANEL_OFFSET_MIN_WIDTH ? Math.min(230, W * 0.17) : 0;
    this.offX += (wantOff - this.offX) * k;
    camera.setViewOffset(W, H, this.offX, 0, W, H);

    // ambient animation
    this.codeTex.offset.y = (t * 0.06) % 1;
    this.leaves.rotation.z = Math.sin(t * 1.2) * 0.05;
    this.steam.forEach((s, i) => {
      const p = (t * 0.45 + i / 3) % 1;
      s.position.y = 0.14 + p * 0.22;
      s.material.opacity = Math.sin(p * Math.PI) * 0.45;
      s.scale.setScalar(1 + p * 1.6);
    });
    for (const m of this.markers) {
      m.position.y = m.userData['base'] + Math.sin(t * 2 + m.userData['ph']) * 0.025;
      const want = this.focused ? 0.15 : 1;
      m.material.opacity += (want - m.material.opacity) * kl;
      m.scale.setScalar(0.12 + Math.sin(t * 3 + m.userData['ph']) * 0.015);
    }

    // day / night
    const L = this.night ? LIGHTS_NIGHT : LIGHTS_DAY;
    this.hemi.intensity += (L.h - this.hemi.intensity) * kl;
    this.sun.intensity += (L.s - this.sun.intensity) * kl;
    this.fill.intensity += (L.f - this.fill.intensity) * kl;
    this.spot.intensity += (L.sp - this.spot.intensity) * kl;
    this.lampGlow.intensity += (L.lg - this.lampGlow.intensity) * kl;
    this.monGlow.intensity += (L.mg - this.monGlow.intensity) * kl;
    const bg = this.scene.background as THREE.Color;
    bg.lerp(this.night ? NIGHT : DAY, kl);
    this.fog.color.copy(bg);
    this.glassM.color.lerp(this.night ? GLASS_NIGHT : GLASS_DAY, kl);
    this.bulbM.color.lerp(this.night ? BULB_NIGHT : BULB_DAY, kl);

    this.renderer.render(this.scene, camera);
    if (!this.rendered) {
      this.rendered = true;
      this.readyCb?.();
    }
  };
}
