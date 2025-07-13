import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class CyberpunkWorld {
    private scene: THREE.Scene;
    private ground: THREE.Mesh;
    private buildings: THREE.Mesh[] = [];
    private collectibles: THREE.Mesh[] = [];
    private time: number = 0;
    private cityLights: THREE.PointLight[] = [];

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.createGround();
        this.loadCityModels();
        this.createCollectibles();
        this.setupCityLights();
    }

    private createGround(): void {
        // 创建赛博朋克地面
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x0a0a0a,
            emissive: 0x1a1a1a,
            emissiveIntensity: 0.1,
            side: THREE.DoubleSide
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = 0;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);

        // 添加地面纹理
        this.addGroundTexture();
    }

    private addGroundTexture(): void {
        // 创建地面网格纹理
        const gridHelper = new THREE.GridHelper(200, 100, 0x00ffff, 0x1a1a1a);
        gridHelper.position.y = 0.01;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.3;
        this.scene.add(gridHelper);
    }

    private async loadCityModels(): Promise<void> {
        const loader = new GLTFLoader();
        
        try {
            // 尝试加载现成的城市模型
            await this.loadCityGLTF(loader);
        } catch (error) {
            console.log('城市模型加载失败，使用程序化生成');
            this.createProceduralCity();
        }
    }

    private async loadCityGLTF(loader: GLTFLoader): Promise<void> {
        // 这里可以加载现成的城市模型
        // 由于没有现成的模型URL，我们使用程序化生成
        this.createProceduralCity();
    }

    private createProceduralCity(): void {
        // 创建程序化赛博朋克城市
        this.createSkyscrapers();
        this.createNeonSigns();
        this.createFlyingCars();
        this.createHolograms();
    }

    private createSkyscrapers(): void {
        // 创建摩天大楼
        const buildingPositions = [
            { x: 20, y: 15, z: 10, width: 8, height: 30, depth: 8 },
            { x: -15, y: 12, z: -8, width: 6, height: 24, depth: 6 },
            { x: 30, y: 18, z: -20, width: 10, height: 36, depth: 10 },
            { x: -25, y: 10, z: 15, width: 5, height: 20, depth: 5 },
            { x: 10, y: 20, z: -30, width: 12, height: 40, depth: 12 },
            { x: -35, y: 14, z: -10, width: 7, height: 28, depth: 7 },
            { x: 40, y: 16, z: 25, width: 9, height: 32, depth: 9 },
            { x: -10, y: 22, z: 35, width: 11, height: 44, depth: 11 }
        ];

        buildingPositions.forEach((pos, index) => {
            this.createSkyscraper(pos.x, pos.y, pos.z, pos.width, pos.height, pos.depth, index);
        });
    }

    private createSkyscraper(x: number, y: number, z: number, width: number, height: number, depth: number, index: number): void {
        const group = new THREE.Group();

        // 主建筑
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0.6, 0.3, 0.1 + Math.random() * 0.2),
            emissive: new THREE.Color().setHSL(0.6, 0.2, 0.05),
            emissiveIntensity: 0.1
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.y = height / 2;
        building.castShadow = true;
        building.receiveShadow = true;
        group.add(building);

        // 添加窗户
        this.addWindows(group, width, height, depth);

        // 添加霓虹灯
        this.addNeonLights(group, width, height, depth);

        // 添加天线
        if (Math.random() > 0.5) {
            this.addAntenna(group, width, height);
        }

        group.position.set(x, 0, z);
        this.scene.add(group);
        this.buildings.push(building);
    }

    private addWindows(group: THREE.Group, width: number, height: number, depth: number): void {
        const windowGeometry = new THREE.PlaneGeometry(0.5, 1);
        const windowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.7
        });

        // 添加窗户网格
        const windowRows = Math.floor(height / 2);
        const windowCols = Math.floor(width / 1.5);

        for (let row = 0; row < windowRows; row++) {
            for (let col = 0; col < windowCols; col++) {
                if (Math.random() > 0.3) { // 随机开启窗户
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    window.position.set(
                        (col - windowCols / 2) * 1.5,
                        row * 2 + 1,
                        depth / 2 + 0.01
                    );
                    group.add(window);

                    // 背面窗户
                    const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
                    backWindow.position.set(
                        (col - windowCols / 2) * 1.5,
                        row * 2 + 1,
                        -depth / 2 - 0.01
                    );
                    backWindow.rotation.y = Math.PI;
                    group.add(backWindow);
                }
            }
        }
    }

    private addNeonLights(group: THREE.Group, width: number, height: number, depth: number): void {
        // 添加霓虹灯条
        const neonGeometry = new THREE.BoxGeometry(0.1, height, 0.1);
        const neonMaterial = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(Math.random(), 1, 0.5)
        });

        // 四个角落的霓虹灯
        const positions = [
            { x: width / 2 + 0.1, z: depth / 2 + 0.1 },
            { x: -width / 2 - 0.1, z: depth / 2 + 0.1 },
            { x: width / 2 + 0.1, z: -depth / 2 - 0.1 },
            { x: -width / 2 - 0.1, z: -depth / 2 - 0.1 }
        ];

        positions.forEach(pos => {
            const neon = new THREE.Mesh(neonGeometry, neonMaterial);
            neon.position.set(pos.x, height / 2, pos.z);
            group.add(neon);
        });
    }

    private addAntenna(group: THREE.Group, width: number, height: number): void {
        const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
        const antennaMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(0, height + 2.5, 0);
        group.add(antenna);

        // 天线顶部发光
        const topGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const topMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.set(0, height + 5, 0);
        group.add(top);
    }

    private createNeonSigns(): void {
        // 创建霓虹招牌
        const signPositions = [
            { x: 15, y: 8, z: 5, text: 'CYBER' },
            { x: -12, y: 6, z: -3, text: 'PUNK' },
            { x: 25, y: 10, z: -15, text: 'FUTURE' },
            { x: -20, y: 7, z: 12, text: 'TECH' }
        ];

        signPositions.forEach(pos => {
            this.createNeonSign(pos.x, pos.y, pos.z, pos.text);
        });
    }

    private createNeonSign(x: number, y: number, z: number, text: string): void {
        // 创建霓虹招牌（简化版）
        const signGeometry = new THREE.PlaneGeometry(4, 1);
        const signMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0080,
            transparent: true,
            opacity: 0.8
        });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(x, y, z);
        sign.rotation.y = Math.PI / 4;
        this.scene.add(sign);
    }

    private createFlyingCars(): void {
        // 创建飞行汽车
        for (let i = 0; i < 5; i++) {
            this.createFlyingCar();
        }
    }

    private createFlyingCar(): void {
        const carGeometry = new THREE.BoxGeometry(2, 0.5, 4);
        const carMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
            emissive: new THREE.Color().setHSL(Math.random(), 0.8, 0.3),
            emissiveIntensity: 0.3
        });
        const car = new THREE.Mesh(carGeometry, carMaterial);
        
        car.position.set(
            (Math.random() - 0.5) * 100,
            20 + Math.random() * 30,
            (Math.random() - 0.5) * 100
        );
        
        this.scene.add(car);
    }

    private createHolograms(): void {
        // 创建全息投影
        for (let i = 0; i < 3; i++) {
            this.createHologram();
        }
    }

    private createHologram(): void {
        const hologramGeometry = new THREE.CylinderGeometry(2, 2, 8, 8);
        const hologramMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const hologram = new THREE.Mesh(hologramGeometry, hologramMaterial);
        
        hologram.position.set(
            (Math.random() - 0.5) * 80,
            4,
            (Math.random() - 0.5) * 80
        );
        
        this.scene.add(hologram);
    }

    private createCollectibles(): void {
        // 创建赛博朋克能量球
        const collectiblePositions = [
            { x: 10, y: 3, z: 10 },
            { x: -8, y: 3, z: -8 },
            { x: 15, y: 3, z: -15 },
            { x: -12, y: 3, z: 12 },
            { x: 0, y: 3, z: 20 }
        ];

        collectiblePositions.forEach(pos => {
            this.createEnergyOrb(pos.x, pos.y, pos.z);
        });
    }

    private createEnergyOrb(x: number, y: number, z: number): void {
        // 创建赛博朋克能量球
        const orbGeometry = new THREE.SphereGeometry(0.5, 16, 16);
        const orbMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.8
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(x, y, z);
        orb.castShadow = true;
        this.collectibles.push(orb);
        this.scene.add(orb);

        // 添加能量球光晕
        const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(x, y, z);
        this.scene.add(glow);
    }

    private setupCityLights(): void {
        // 创建城市灯光
        for (let i = 0; i < 20; i++) {
            const light = new THREE.PointLight(
                new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
                1,
                50
            );
            light.position.set(
                (Math.random() - 0.5) * 100,
                10 + Math.random() * 20,
                (Math.random() - 0.5) * 100
            );
            this.cityLights.push(light);
            this.scene.add(light);
        }
    }

    public update(deltaTime: number): void {
        this.time += deltaTime;
        
        // 让可收集物品旋转和浮动
        this.collectibles.forEach((collectible, index) => {
            collectible.rotation.y += deltaTime * 2;
            collectible.position.y = 3 + Math.sin(this.time * 2 + index) * 0.5;
        });

        // 让城市灯光闪烁
        this.cityLights.forEach((light, index) => {
            light.intensity = 0.5 + Math.sin(this.time * 3 + index) * 0.3;
        });
    }

    public getCollectibles(): THREE.Mesh[] {
        return this.collectibles;
    }

    public removeCollectible(collectible: THREE.Mesh): void {
        const index = this.collectibles.indexOf(collectible);
        if (index > -1) {
            this.collectibles.splice(index, 1);
        }
    }

    public dispose(): void {
        // 清理资源
        this.cityLights.forEach(light => {
            this.scene.remove(light);
        });
        
        this.collectibles.forEach(collectible => {
            this.scene.remove(collectible);
            collectible.geometry.dispose();
            if (Array.isArray(collectible.material)) {
                collectible.material.forEach(material => material.dispose());
            } else {
                collectible.material.dispose();
            }
        });
    }
} 