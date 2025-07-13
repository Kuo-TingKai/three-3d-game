import * as THREE from 'three';
import { Player3D } from './Player3D';
import { InputManager3D } from './InputManager3D';
import { World3D } from './World3D';
import { UIManager } from './UIManager';

export class Game3D {
    private container: HTMLElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private player: Player3D;
    private inputManager: InputManager3D;
    private world: World3D;
    private uiManager: UIManager;
    private clock: THREE.Clock;
    private isRunning: boolean = false;

    constructor(container: HTMLElement) {
        this.container = container;
        this.clock = new THREE.Clock();
        
        // 初始化Three.js
        this.initThreeJS();
        
        // 初始化游戏组件
        this.player = new Player3D();
        this.inputManager = new InputManager3D();
        this.world = new World3D();
        this.uiManager = new UIManager();
        
        // 设置场景
        this.setupScene();
        
        // 设置事件监听
        this.setupEventListeners();
    }

    private initThreeJS(): void {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // 天空蓝
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75, // 视野角度
            window.innerWidth / window.innerHeight, // 宽高比
            0.1, // 近平面
            1000 // 远平面
        );
        this.camera.position.set(0, 5, 10);
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // 添加到容器
        this.container.appendChild(this.renderer.domElement);
    }

    private setupScene(): void {
        // 添加世界
        this.world.addToScene(this.scene);
        
        // 添加玩家
        this.player.addToScene(this.scene);
        
        // 设置相机跟随玩家
        this.camera.position.copy(this.player.getPosition());
        this.camera.position.y += 5;
        this.camera.position.z += 10;
        this.camera.lookAt(this.player.getPosition());
        
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // 添加方向光（太阳光）
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
    }

    private setupEventListeners(): void {
        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // 鼠标锁定
        this.renderer.domElement.addEventListener('click', () => {
            this.renderer.domElement.requestPointerLock();
        });
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
        
        // 更新游戏状态
        this.update(deltaTime);
        
        // 渲染场景
        this.render();
        
        // 继续动画循环
        requestAnimationFrame(() => this.animate());
    }

    private update(deltaTime: number): void {
        // 处理输入
        const input = this.inputManager.getInput();
        
        // 更新玩家
        this.player.update(deltaTime, input);
        
        // 更新相机位置（跟随玩家）
        this.updateCamera();
        
        // 更新UI
        this.uiManager.updateUI(this.player);
        
        // 更新世界
        this.world.update(deltaTime);
    }

    private updateCamera(): void {
        const playerPos = this.player.getPosition();
        const targetPos = new THREE.Vector3(
            playerPos.x,
            playerPos.y + 5,
            playerPos.z + 10
        );
        
        // 平滑相机移动
        this.camera.position.lerp(targetPos, 0.1);
        this.camera.lookAt(playerPos);
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    public dispose(): void {
        this.renderer.dispose();
        this.world.dispose();
        this.player.dispose();
    }
} 