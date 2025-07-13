import * as THREE from 'three';
import { InputState3D } from './InputManager3D';

export class Player3D {
    private mesh: THREE.Group;
    private velocity: THREE.Vector3;
    private speed: number = 20; // 增加移动速度
    private jumpForce: number = 20; // 增加跳跃力度
    private gravity: number = 35; // 调整重力
    private isOnGround: boolean = false;
    private health: number = 100;
    private score: number = 0;
    private body: THREE.Mesh;
    private head: THREE.Mesh;
    private leftLeg: THREE.Mesh;
    private rightLeg: THREE.Mesh;
    private leftArm: THREE.Mesh;
    private rightArm: THREE.Mesh;

    constructor() {
        this.velocity = new THREE.Vector3();
        this.createPlayerMesh();
    }

    private createPlayerMesh(): void {
        this.mesh = new THREE.Group();

        // 创建身体（更酷的赛博朋克风格）
        const bodyGeometry = new THREE.BoxGeometry(0.8, 1.4, 0.4);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d3748,
            emissive: 0x1a202c,
            emissiveIntensity: 0.3
        });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.y = 0.7;
        this.body.castShadow = true;
        this.body.receiveShadow = true;
        this.mesh.add(this.body);

        // 创建头部（更酷的设计）
        const headGeometry = new THREE.SphereGeometry(0.35, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a5568,
            emissive: 0x2d3748,
            emissiveIntensity: 0.2
        });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.y = 1.6;
        this.head.castShadow = true;
        this.head.receiveShadow = true;
        this.mesh.add(this.head);

        // 创建更酷的眼睛（发光）
        const eyeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const eyeMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 1.0
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.12, 1.65, 0.25);
        this.mesh.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.12, 1.65, 0.25);
        this.mesh.add(rightEye);

        // 添加眼部光晕效果
        const eyeGlowGeometry = new THREE.SphereGeometry(0.06, 8, 8);
        const eyeGlowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.4
        });
        
        const leftEyeGlow = new THREE.Mesh(eyeGlowGeometry, eyeGlowMaterial);
        leftEyeGlow.position.set(-0.12, 1.65, 0.25);
        this.mesh.add(leftEyeGlow);
        
        const rightEyeGlow = new THREE.Mesh(eyeGlowGeometry, eyeGlowMaterial);
        rightEyeGlow.position.set(0.12, 1.65, 0.25);
        this.mesh.add(rightEyeGlow);

        // 创建更酷的手臂
        const armGeometry = new THREE.BoxGeometry(0.25, 0.9, 0.25);
        const armMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a5568,
            emissive: 0x2d3748,
            emissiveIntensity: 0.2
        });
        
        this.leftArm = new THREE.Mesh(armGeometry, armMaterial);
        this.leftArm.position.set(-0.7, 0.45, 0);
        this.leftArm.castShadow = true;
        this.mesh.add(this.leftArm);
        
        this.rightArm = new THREE.Mesh(armGeometry, armMaterial);
        this.rightArm.position.set(0.7, 0.45, 0);
        this.rightArm.castShadow = true;
        this.mesh.add(this.rightArm);

        // 添加手臂发光线条
        const armLineGeometry = new THREE.BoxGeometry(0.03, 0.7, 0.03);
        const armLineMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff
        });
        
        const leftArmLine = new THREE.Mesh(armLineGeometry, armLineMaterial);
        leftArmLine.position.set(-0.7, 0.45, 0);
        this.mesh.add(leftArmLine);
        
        const rightArmLine = new THREE.Mesh(armLineGeometry, armLineMaterial);
        rightArmLine.position.set(0.7, 0.45, 0);
        this.mesh.add(rightArmLine);

        // 创建更酷的腿部
        const legGeometry = new THREE.BoxGeometry(0.25, 0.9, 0.25);
        const legMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4a5568,
            emissive: 0x2d3748,
            emissiveIntensity: 0.2
        });
        
        this.leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        this.leftLeg.position.set(-0.25, -0.45, 0);
        this.leftLeg.castShadow = true;
        this.mesh.add(this.leftLeg);
        
        this.rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        this.rightLeg.position.set(0.25, -0.45, 0);
        this.rightLeg.castShadow = true;
        this.mesh.add(this.rightLeg);

        // 添加腿部发光线条
        const legLineGeometry = new THREE.BoxGeometry(0.03, 0.7, 0.03);
        const legLineMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0080
        });
        
        const leftLegLine = new THREE.Mesh(legLineGeometry, legLineMaterial);
        leftLegLine.position.set(-0.25, -0.45, 0);
        this.mesh.add(leftLegLine);
        
        const rightLegLine = new THREE.Mesh(legLineGeometry, legLineMaterial);
        rightLegLine.position.set(0.25, -0.45, 0);
        this.mesh.add(rightLegLine);

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
        
        // 调试信息
        if (input.forward || input.backward || input.left || input.right) {
            console.log('移动输入:', {
                forward: input.forward,
                backward: input.backward,
                left: input.left,
                right: input.right,
                moveVector: moveVector
            });
        }
        
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
        const time = Date.now() * 0.015; // 增加动画速度
        const isMoving = input.forward || input.backward || input.left || input.right;
        
        if (isMoving) {
            // 身体摆动（赛博朋克风格）
            this.body.rotation.z = Math.sin(time) * 0.15;
            
            // 腿部行走动画（更大的步幅）
            this.leftLeg.rotation.x = Math.sin(time * 2) * 0.6;
            this.rightLeg.rotation.x = Math.sin(time * 2 + Math.PI) * 0.6;
            
            // 手臂摆动动画（配合腿部）
            this.leftArm.rotation.x = Math.sin(time * 2 + Math.PI) * 0.4;
            this.rightArm.rotation.x = Math.sin(time * 2) * 0.4;
            
            // 头部轻微摆动
            this.head.rotation.y = Math.sin(time * 0.5) * 0.1;
        } else {
            // 停止时恢复原位
            this.body.rotation.z *= 0.8;
            this.leftLeg.rotation.x *= 0.8;
            this.rightLeg.rotation.x *= 0.8;
            this.leftArm.rotation.x *= 0.8;
            this.rightArm.rotation.x *= 0.8;
            this.head.rotation.y *= 0.8;
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