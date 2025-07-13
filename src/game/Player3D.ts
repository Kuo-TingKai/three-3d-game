import * as THREE from 'three';
import { InputState3D } from './InputManager3D';

export class Player3D {
    private mesh: THREE.Group;
    private velocity: THREE.Vector3;
    private speed: number = 10;
    private jumpForce: number = 15;
    private gravity: number = 30;
    private isOnGround: boolean = false;
    private health: number = 100;
    private score: number = 0;
    private body: THREE.Mesh;
    private head: THREE.Mesh;

    constructor() {
        this.velocity = new THREE.Vector3();
        this.createPlayerMesh();
    }

    private createPlayerMesh(): void {
        this.mesh = new THREE.Group();

        // 创建身体（立方体）
        const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.5);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4CAF50 });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.y = 0.75;
        this.body.castShadow = true;
        this.body.receiveShadow = true;
        this.mesh.add(this.body);

        // 创建头部（球体）
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFB6C1 });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.y = 1.8;
        this.head.castShadow = true;
        this.head.receiveShadow = true;
        this.mesh.add(this.head);

        // 创建眼睛
        const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 1.85, 0.3);
        this.mesh.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 1.85, 0.3);
        this.mesh.add(rightEye);

        // 创建手臂
        const armGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0xFFB6C1 });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.8, 0.5, 0);
        leftArm.castShadow = true;
        this.mesh.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.8, 0.5, 0);
        rightArm.castShadow = true;
        this.mesh.add(rightArm);

        // 创建腿部
        const legGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x2196F3 });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.3, -0.5, 0);
        leftLeg.castShadow = true;
        this.mesh.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.3, -0.5, 0);
        rightLeg.castShadow = true;
        this.mesh.add(rightLeg);

        // 设置初始位置
        this.mesh.position.set(0, 1, 0);
    }

    public addToScene(scene: THREE.Scene): void {
        scene.add(this.mesh);
    }

    public update(deltaTime: number, input: InputState3D): void {
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
        } else {
            // 应用摩擦力
            this.velocity.x *= 0.8;
            this.velocity.z *= 0.8;
        }

        // 跳跃
        if (input.jump && this.isOnGround) {
            this.velocity.y = this.jumpForce;
            this.isOnGround = false;
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

        // 添加一些动画效果
        this.animateMovement(input);
    }

    private animateMovement(input: InputState3D): void {
        // 简单的行走动画
        if (input.forward || input.backward || input.left || input.right) {
            this.body.rotation.z = Math.sin(Date.now() * 0.01) * 0.1;
        } else {
            this.body.rotation.z *= 0.9;
        }
    }

    public getPosition(): THREE.Vector3 {
        return this.mesh.position.clone();
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
        // 清理几何体和材质
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