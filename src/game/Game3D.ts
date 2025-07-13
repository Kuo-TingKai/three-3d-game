import * as THREE from 'three';
import { ModelPlayer } from './ModelPlayer';
import { InputManager3D } from './InputManager3D';
import { CyberpunkWorld } from './CyberpunkWorld';
import { UIManager } from './UIManager';
import { MacCompatibility } from './MacCompatibility';

export class Game3D {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private player: ModelPlayer;
    private world: CyberpunkWorld;
    private inputManager: InputManager3D;
    private uiManager: UIManager;
    private macCompatibility: MacCompatibility;
    private clock: THREE.Clock;
    private isRunning: boolean = false;

    constructor() {
        this.clock = new THREE.Clock();
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupPlayer();
        this.setupWorld();
        this.setupInput();
        this.setupUI();
        this.setupMacCompatibility();
        this.setupEventListeners();
    }

    private setupScene(): void {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000011, 50, 200);
        this.scene.background = new THREE.Color(0x000011);
    }

    private setupCamera(): void {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
    }

    private setupRenderer(): void {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        document.body.appendChild(this.renderer.domElement);
    }

    private setupLights(): void {
        // 主光源
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(10, 20, 10);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -25;
        mainLight.shadow.camera.right = 25;
        mainLight.shadow.camera.top = 25;
        mainLight.shadow.camera.bottom = -25;
        this.scene.add(mainLight);

        // 环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        this.scene.add(ambientLight);

        // 赛博朋克彩色点光源
        const colors = [0xff0080, 0x00ffff, 0xffff00, 0xff8000];
        colors.forEach((color, index) => {
            const light = new THREE.PointLight(color, 0.5, 30);
            light.position.set(
                (index - 1.5) * 20,
                10,
                (index - 1.5) * 20
            );
            this.scene.add(light);
        });
    }

    private setupPlayer(): void {
        this.player = new ModelPlayer();
        this.player.addToScene(this.scene);
    }

    private setupWorld(): void {
        this.world = new CyberpunkWorld(this.scene);
    }

    private setupInput(): void {
        this.inputManager = new InputManager3D();
    }

    private setupUI(): void {
        this.uiManager = new UIManager();
    }

    private setupMacCompatibility(): void {
        this.macCompatibility = MacCompatibility.getInstance();
    }

    private setupEventListeners(): void {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private onKeyDown(event: KeyboardEvent): void {
        // 调试快捷键
        if (event.key === 'F1') {
            this.toggleDebugMode();
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        // 输入管理器已经通过事件监听器处理
    }

    private onMouseDown(event: MouseEvent): void {
        if (event.button === 0) { // 左键射击
            this.shoot();
        }
    }

    private onMouseUp(event: MouseEvent): void {
        // 输入管理器已经通过事件监听器处理
    }

    private onMouseMove(event: MouseEvent): void {
        // 输入管理器已经通过事件监听器处理
    }

    private shoot(): void {
        // 射击逻辑
        console.log('射击！');
        this.player.addScore(10);
    }

    private toggleDebugMode(): void {
        // 切换调试模式
        console.log('调试模式切换');
    }

    public start(): void {
        this.isRunning = true;
        this.animate();
    }

    public stop(): void {
        this.isRunning = false;
    }

    private animate(): void {
        if (!this.isRunning) return;

        const deltaTime = this.clock.getDelta();
        
        // 更新输入
        const input = this.inputManager.getInput();
        
        // 更新玩家
        this.player.update(deltaTime, input);
        
        // 更新世界
        this.world.update(deltaTime);
        
        // 更新相机跟随
        this.updateCamera();
        
        // 检查收集物品
        this.checkCollectibles();
        
        // 更新UI
        this.uiManager.updateScore(this.player.getScore());
        this.uiManager.updateHealth(this.player.getHealth());
        
        // 渲染
        this.renderer.render(this.scene, this.camera);
        
        requestAnimationFrame(this.animate.bind(this));
    }

    private updateCamera(): void {
        const playerPos = this.player.getPosition();
        const targetPos = new THREE.Vector3(
            playerPos.x,
            playerPos.y + 3,
            playerPos.z + 8
        );
        
        this.camera.position.lerp(targetPos, 0.1);
        this.camera.lookAt(playerPos);
    }

    private checkCollectibles(): void {
        const playerPos = this.player.getPosition();
        const collectibles = this.world.getCollectibles();
        
        collectibles.forEach((collectible, index) => {
            const distance = playerPos.distanceTo(collectible.position);
            if (distance < 2) {
                // 收集物品
                this.player.addScore(50);
                this.player.heal(10);
                this.world.removeCollectible(collectible);
                this.scene.remove(collectible);
                
                // 播放收集音效（如果有的话）
                console.log('收集到能量球！');
            }
        });
    }

    public dispose(): void {
        this.stop();
        this.player.dispose();
        this.world.dispose();
        this.renderer.dispose();
        
        // 移除事件监听器
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        window.removeEventListener('keydown', this.onKeyDown.bind(this));
        window.removeEventListener('keyup', this.onKeyUp.bind(this));
        window.removeEventListener('mousedown', this.onMouseDown.bind(this));
        window.removeEventListener('mouseup', this.onMouseUp.bind(this));
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }
} 