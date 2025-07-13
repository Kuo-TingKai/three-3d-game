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
        // 创建地面
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x90EE90,
            side: THREE.DoubleSide
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = 0;
        this.ground.receiveShadow = true;
    }

    private createObstacles(): void {
        // 创建一些障碍物
        const obstaclePositions = [
            { x: 10, y: 1, z: 5 },
            { x: -8, y: 1, z: -3 },
            { x: 15, y: 1, z: -10 },
            { x: -12, y: 1, z: 8 },
            { x: 5, y: 1, z: -15 }
        ];

        obstaclePositions.forEach(pos => {
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const obstacle = new THREE.Mesh(geometry, material);
            obstacle.position.set(pos.x, pos.y, pos.z);
            obstacle.castShadow = true;
            obstacle.receiveShadow = true;
            this.obstacles.push(obstacle);
        });
    }

    private createCollectibles(): void {
        // 创建可收集的物品
        const collectiblePositions = [
            { x: 5, y: 2, z: 5 },
            { x: -5, y: 2, z: -5 },
            { x: 10, y: 2, z: -10 },
            { x: -10, y: 2, z: 10 },
            { x: 0, y: 2, z: 15 }
        ];

        collectiblePositions.forEach(pos => {
            const geometry = new THREE.SphereGeometry(0.5, 16, 16);
            const material = new THREE.MeshLambertMaterial({ 
                color: 0xFFD700,
                emissive: 0x444444
            });
            const collectible = new THREE.Mesh(geometry, material);
            collectible.position.set(pos.x, pos.y, pos.z);
            collectible.castShadow = true;
            this.collectibles.push(collectible);
        });
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