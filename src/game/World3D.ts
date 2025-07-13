import * as THREE from 'three';

export class World3D {
    private ground: THREE.Mesh;
    private obstacles: THREE.Mesh[] = [];
    private collectibles: THREE.Mesh[] = [];
    private time: number = 0;

    constructor() {
        this.createGround();
        this.createObstacles();
        this.createCollectibles();
    }

    private createGround(): void {
        // 创建赛博朋克地面
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a1a1a,
            emissive: 0x2d3748,
            emissiveIntensity: 0.2,
            side: THREE.DoubleSide
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = 0;
        this.ground.receiveShadow = true;

        // 移除网格线以避免奇怪的线条
    }

    private createObstacles(): void {
        // 创建赛博朋克建筑和障碍物
        const obstaclePositions = [
            { x: 10, y: 2, z: 5, type: 'building' },
            { x: -8, y: 1.5, z: -3, type: 'container' },
            { x: 15, y: 3, z: -10, type: 'tower' },
            { x: -12, y: 2.5, z: 8, type: 'building' },
            { x: 5, y: 1, z: -15, type: 'container' }
        ];

        obstaclePositions.forEach(pos => {
            if (pos.type === 'building') {
                this.createCyberpunkBuilding(pos.x, pos.y, pos.z);
            } else if (pos.type === 'tower') {
                this.createCyberpunkTower(pos.x, pos.y, pos.z);
            } else {
                this.createCyberpunkContainer(pos.x, pos.y, pos.z);
            }
        });
    }

    private createCyberpunkBuilding(x: number, y: number, z: number): void {
        // 创建赛博朋克建筑
        const buildingGeometry = new THREE.BoxGeometry(3, y * 2, 3);
        const buildingMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a1a2e,
            emissive: 0x0a0a1a,
            emissiveIntensity: 0.1
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(x, y, z);
        building.castShadow = true;
        building.receiveShadow = true;
        this.obstacles.push(building);

        // 添加建筑上的发光线条
        const lineGeometry = new THREE.BoxGeometry(0.1, y * 2, 0.1);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.set(x + 1.5, y, z);
        this.obstacles.push(line);
    }

    private createCyberpunkTower(x: number, y: number, z: number): void {
        // 创建赛博朋克高塔
        const towerGeometry = new THREE.CylinderGeometry(1, 1, y * 2, 8);
        const towerMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d3748,
            emissive: 0x1a202c,
            emissiveIntensity: 0.2
        });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.set(x, y, z);
        tower.castShadow = true;
        tower.receiveShadow = true;
        this.obstacles.push(tower);

        // 添加塔顶发光
        const topGeometry = new THREE.SphereGeometry(1.2, 8, 8);
        const topMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0080,
            transparent: true,
            opacity: 0.7
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.set(x, y * 2, z);
        this.obstacles.push(top);
    }

    private createCyberpunkContainer(x: number, y: number, z: number): void {
        // 创建赛博朋克集装箱
        const containerGeometry = new THREE.BoxGeometry(2, y * 2, 2);
        const containerMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a5568,
            emissive: 0x2d3748,
            emissiveIntensity: 0.1
        });
        const container = new THREE.Mesh(containerGeometry, containerMaterial);
        container.position.set(x, y, z);
        container.castShadow = true;
        container.receiveShadow = true;
        this.obstacles.push(container);
    }

    private createCollectibles(): void {
        // 创建赛博朋克能量球
        const collectiblePositions = [
            { x: 5, y: 3, z: 5 },
            { x: -5, y: 3, z: -5 },
            { x: 10, y: 3, z: -10 },
            { x: -10, y: 3, z: 10 },
            { x: 0, y: 3, z: 15 }
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
            emissiveIntensity: 0.5
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.set(x, y, z);
        orb.castShadow = true;
        this.collectibles.push(orb);

        // 添加能量球光晕
        const glowGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(x, y, z);
        this.collectibles.push(glow);
    }

    public addToScene(scene: THREE.Scene): void {
        // 添加地面
        scene.add(this.ground);
        
        // 添加障碍物
        this.obstacles.forEach(obstacle => {
            scene.add(obstacle);
        });
        
        // 添加可收集物品
        this.collectibles.forEach(collectible => {
            scene.add(collectible);
        });
    }

    public update(deltaTime: number): void {
        this.time += deltaTime;
        
        // 让可收集物品旋转和浮动
        this.collectibles.forEach((collectible, index) => {
            collectible.rotation.y += deltaTime * 2;
            collectible.position.y = 2 + Math.sin(this.time * 2 + index) * 0.5;
        });
    }

    public getObstacles(): THREE.Mesh[] {
        return this.obstacles;
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
        // 清理几何体和材质
        this.ground.geometry.dispose();
        if (Array.isArray(this.ground.material)) {
            this.ground.material.forEach(material => material.dispose());
        } else {
            this.ground.material.dispose();
        }

        this.obstacles.forEach(obstacle => {
            obstacle.geometry.dispose();
            if (Array.isArray(obstacle.material)) {
                obstacle.material.forEach(material => material.dispose());
            } else {
                obstacle.material.dispose();
            }
        });

        this.collectibles.forEach(collectible => {
            collectible.geometry.dispose();
            if (Array.isArray(collectible.material)) {
                collectible.material.forEach(material => material.dispose());
            } else {
                collectible.material.dispose();
            }
        });
    }
} 