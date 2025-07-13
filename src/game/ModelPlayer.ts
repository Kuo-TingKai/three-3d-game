import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { InputState3D } from './InputManager3D';

export class ModelPlayer {
    private mesh: THREE.Group;
    private velocity: THREE.Vector3;
    private speed: number = 20;
    private jumpForce: number = 20;
    private gravity: number = 35;
    private isOnGround: boolean = false;
    private health: number = 100;
    private score: number = 0;
    private mixer: THREE.AnimationMixer | null = null;
    private animations: THREE.AnimationAction[] = [];
    private currentAnimation: string = 'idle';

    constructor() {
        this.velocity = new THREE.Vector3();
        this.mesh = new THREE.Group();
        this.loadModel();
    }

    private async loadModel(): Promise<void> {
        const loader = new GLTFLoader();
        
        try {
            // 尝试加载太空人模型
            const gltf = await this.loadGLTF(loader, 'https://threejs.org/examples/models/gltf/Astronaut.glb');
            this.setupModel(gltf);
        } catch (error) {
            console.log('太空人模型加载失败，使用备用机器人模型');
            try {
                // 备用：使用简单的机器人几何体
                this.createRobotModel();
            } catch (fallbackError) {
                console.error('所有模型加载失败，使用基础几何体');
                this.createBasicModel();
            }
        }
    }

    private loadGLTF(loader: GLTFLoader, url: string): Promise<THREE.GLTF> {
        return new Promise((resolve, reject) => {
            loader.load(
                url,
                (gltf) => resolve(gltf),
                (progress) => console.log('Loading progress:', progress),
                (error) => reject(error)
            );
        });
    }

    private setupModel(gltf: THREE.GLTF): void {
        this.mesh = gltf.scene;
        this.mesh.scale.set(0.5, 0.5, 0.5);
        this.mesh.position.set(0, 1, 0);
        
        // 设置阴影
        this.mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // 设置动画
        if (gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.mesh);
            gltf.animations.forEach((clip) => {
                const action = this.mixer.clipAction(clip);
                this.animations.push(action);
                if (clip.name.toLowerCase().includes('idle')) {
                    action.play();
                }
            });
        }

        console.log('模型加载成功:', gltf);
    }

    private createRobotModel(): void {
        // 创建酷炫的机器人模型
        const group = new THREE.Group();

        // 身体
        const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d3748,
            emissive: 0x1a202c,
            emissiveIntensity: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);

        // 头部
        const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a5568,
            emissive: 0x2d3748,
            emissiveIntensity: 0.2
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.5;
        head.castShadow = true;
        group.add(head);

        // 眼睛
        const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const eyeMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 1.0
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 1.55, 0.2);
        group.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 1.55, 0.2);
        group.add(rightEye);

        // 手臂
        const armGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 4, 8);
        const armMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a5568,
            emissive: 0x2d3748,
            emissiveIntensity: 0.2
        });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.6, 0.5, 0);
        leftArm.castShadow = true;
        group.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.6, 0.5, 0);
        rightArm.castShadow = true;
        group.add(rightArm);

        // 腿部
        const legGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 4, 8);
        const legMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a5568,
            emissive: 0x2d3748,
            emissiveIntensity: 0.2
        });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.2, -0.4, 0);
        leftLeg.castShadow = true;
        group.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.2, -0.4, 0);
        rightLeg.castShadow = true;
        group.add(rightLeg);

        // 发光装饰
        const glowGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.8
        });

        // 身体发光点
        for (let i = 0; i < 6; i++) {
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.set(
                (Math.random() - 0.5) * 0.6,
                Math.random() * 1.2,
                (Math.random() - 0.5) * 0.3
            );
            group.add(glow);
        }

        this.mesh = group;
        this.mesh.position.set(0, 1, 0);
    }

    private createBasicModel(): void {
        // 创建基础几何体模型
        const group = new THREE.Group();

        // 身体
        const bodyGeometry = new THREE.BoxGeometry(0.8, 1.4, 0.4);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d3748,
            emissive: 0x1a202c,
            emissiveIntensity: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.7;
        body.castShadow = true;
        group.add(body);

        // 头部
        const headGeometry = new THREE.SphereGeometry(0.35, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a5568,
            emissive: 0x2d3748,
            emissiveIntensity: 0.2
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.6;
        head.castShadow = true;
        group.add(head);

        this.mesh = group;
        this.mesh.position.set(0, 1, 0);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.mesh);
    }

    public update(deltaTime: number, input: InputState3D): void {
        // 更新动画混合器
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }

        // 水平移动
        const moveVector = new THREE.Vector3();
        
        if (input.forward) moveVector.z -= 1;
        if (input.backward) moveVector.z += 1;
        if (input.left) moveVector.x -= 1;
        if (input.right) moveVector.x += 1;
        
        if (moveVector.length() > 0) {
            moveVector.normalize();
            moveVector.multiplyScalar(this.speed * deltaTime);
            this.velocity.x = moveVector.x;
            this.velocity.z = moveVector.z;
            
            // 播放移动动画
            this.playAnimation('walk');
        } else {
            // 应用摩擦力
            this.velocity.x *= 0.8;
            this.velocity.z *= 0.8;
            
            // 播放待机动画
            this.playAnimation('idle');
        }

        // 跳跃
        if (input.jump && this.isOnGround) {
            this.velocity.y = this.jumpForce;
            this.isOnGround = false;
            this.playAnimation('jump');
        }

        // 应用重力
        if (!this.isOnGround) {
            this.velocity.y -= this.gravity * deltaTime;
        }

        // 更新位置
        this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));

        // 地面检测
        if (this.mesh.position.y <= 1) {
            this.mesh.position.y = 1;
            this.velocity.y = 0;
            this.isOnGround = true;
        }

        // 角色朝向
        if (moveVector.length() > 0) {
            const angle = Math.atan2(moveVector.x, moveVector.z);
            this.mesh.rotation.y = angle;
        }
    }

    private playAnimation(name: string): void {
        if (this.currentAnimation === name) return;
        
        // 停止当前动画
        this.animations.forEach(action => action.stop());
        
        // 播放新动画
        const targetAction = this.animations.find(action => 
            action.getClip().name.toLowerCase().includes(name)
        );
        
        if (targetAction) {
            targetAction.play();
            this.currentAnimation = name;
        }
    }

    public getPosition(): THREE.Vector3 {
        return this.mesh.position.clone();
    }

    public getVelocity(): THREE.Vector3 {
        return this.velocity.clone();
    }

    public getHealth(): number {
        return this.health;
    }

    public getScore(): number {
        return this.score;
    }

    public takeDamage(amount: number): void {
        this.health = Math.max(0, this.health - amount);
    }

    public heal(amount: number): void {
        this.health = Math.min(100, this.health + amount);
    }

    public addScore(points: number): void {
        this.score += points;
    }

    public dispose(): void {
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
        
        this.mesh.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }
} 