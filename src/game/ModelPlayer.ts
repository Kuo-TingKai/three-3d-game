import * as THREE from 'three';
import { InputState3D } from './InputManager3D';

export class ModelPlayer {
    private mesh: THREE.Group;
    private velocity: THREE.Vector3;
    private speed: number = 24;
    private jumpForce: number = 24;
    private gravity: number = 35;
    private isOnGround: boolean = false;
    private health: number = 100;
    private score: number = 0;
    private addedToScene: boolean = false;
    private sceneRef: THREE.Scene | null = null;
    private leftLeg: THREE.Group | null = null;
    private rightLeg: THREE.Group | null = null;
    private leftArm: THREE.Group | null = null;
    private rightArm: THREE.Group | null = null;
    private time: number = 0;

    constructor() {
        this.velocity = new THREE.Vector3();
        this.mesh = new THREE.Group();
        this.createEvaMechaModel();
    }

    // EVA/使徒风格机甲建模
    private createEvaMechaModel(): void {
        if (this.sceneRef) this.sceneRef.remove(this.mesh);
        const group = new THREE.Group();
        // EVA主色
        const mainColor = 0x2a1a40; // 深紫
        const accentGreen = 0x39ff14; // 荧光绿
        const accentOrange = 0xffa500; // 橙
        const accentRed = 0xff0033; // 红
        const accentBlue = 0x00eaff; // 蓝
        const black = 0x181818;
        // 躯干（细长椭圆+发光核心）
        const torsoGeo = new THREE.CapsuleGeometry(0.32, 1.2, 8, 16);
        const torsoMat = new THREE.MeshPhysicalMaterial({
            color: mainColor, metalness: 0.85, roughness: 0.18, clearcoat: 0.7,
            emissive: accentGreen, emissiveIntensity: 0.08
        });
        const torso = new THREE.Mesh(torsoGeo, torsoMat);
        torso.position.y = 2.1;
        group.add(torso);
        // 胸口发光核心
        const coreGeo = new THREE.SphereGeometry(0.16, 16, 16);
        const coreMat = new THREE.MeshPhysicalMaterial({
            color: accentRed, emissive: accentRed, emissiveIntensity: 1.3, metalness: 0.7, roughness: 0.1
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.set(0, 2.25, 0.28);
        group.add(core);
        // 头部（异形头+发光眼）
        const headGeo = new THREE.SphereGeometry(0.23, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.8);
        const headMat = new THREE.MeshPhysicalMaterial({
            color: mainColor, metalness: 0.95, roughness: 0.12, clearcoat: 0.8,
            emissive: accentGreen, emissiveIntensity: 0.12
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(0, 3.0, 0);
        group.add(head);
        // EVA下颚
        const jawGeo = new THREE.ConeGeometry(0.13, 0.22, 12);
        const jawMat = new THREE.MeshPhysicalMaterial({
            color: black, metalness: 0.7, roughness: 0.2
        });
        const jaw = new THREE.Mesh(jawGeo, jawMat);
        jaw.position.set(0, 2.85, 0.08);
        jaw.rotation.x = Math.PI;
        group.add(jaw);
        // 发光眼
        const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const eyeMat = new THREE.MeshPhysicalMaterial({
            color: accentGreen, emissive: accentGreen, emissiveIntensity: 2.2, metalness: 0.5, roughness: 0.1
        });
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.07, 3.05, 0.19);
        group.add(leftEye);
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(0.07, 3.05, 0.19);
        group.add(rightEye);
        // 头部天线
        const antennaGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.38, 8);
        const antennaMat = new THREE.MeshPhysicalMaterial({
            color: accentBlue, emissive: accentBlue, emissiveIntensity: 1.1
        });
        const antenna = new THREE.Mesh(antennaGeo, antennaMat);
        antenna.position.set(0, 3.32, 0);
        group.add(antenna);
        // 背部脊柱（发光管线）
        for (let i = 0; i < 5; i++) {
            const spineGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.22, 8);
            const spineMat = new THREE.MeshPhysicalMaterial({
                color: accentBlue, emissive: accentBlue, emissiveIntensity: 0.7, transparent: true, opacity: 0.7
            });
            const spine = new THREE.Mesh(spineGeo, spineMat);
            spine.position.set(0, 2.7 - i * 0.22, -0.18 - i * 0.06);
            group.add(spine);
        }
        // 手臂（细长+发光条+爪）
        this.leftArm = new THREE.Group();
        const upperArmGeo = new THREE.CylinderGeometry(0.08, 0.10, 0.7, 16);
        const upperArmMat = new THREE.MeshPhysicalMaterial({
            color: mainColor, metalness: 0.9, roughness: 0.18, clearcoat: 0.7,
            emissive: accentGreen, emissiveIntensity: 0.18
        });
        const upperArm = new THREE.Mesh(upperArmGeo, upperArmMat);
        upperArm.position.y = -0.35;
        this.leftArm.add(upperArm);
        // 发光条
        const armTubeGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.7, 12);
        const armTubeMat = new THREE.MeshPhysicalMaterial({
            color: accentGreen, emissive: accentGreen, emissiveIntensity: 1.2, transparent: true, opacity: 0.7
        });
        const armTube = new THREE.Mesh(armTubeGeo, armTubeMat);
        armTube.position.y = -0.35;
        this.leftArm.add(armTube);
        // 爪型手
        for (let i = 0; i < 3; i++) {
            const clawGeo = new THREE.CylinderGeometry(0.012, 0.018, 0.18, 8);
            const clawMat = new THREE.MeshPhysicalMaterial({
                color: accentOrange, emissive: accentOrange, emissiveIntensity: 1.1
            });
            const claw = new THREE.Mesh(clawGeo, clawMat);
            const angle = Math.PI * (i / 3 - 0.5);
            claw.position.set(Math.sin(angle) * 0.06, -0.75, 0.09 + Math.cos(angle) * 0.04);
            claw.rotation.x = Math.PI / 2 + angle;
            this.leftArm.add(claw);
        }
        this.leftArm.position.set(-0.28, 2.1, 0);
        group.add(this.leftArm);
        this.rightArm = this.leftArm.clone();
        this.rightArm.position.set(0.28, 2.1, 0);
        group.add(this.rightArm);
        // 腿部（细长+发光能量管+爪型脚）
        this.leftLeg = new THREE.Group();
        const upperLegGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.8, 16);
        const upperLegMat = new THREE.MeshPhysicalMaterial({
            color: mainColor, metalness: 0.9, roughness: 0.18, clearcoat: 0.7,
            emissive: accentGreen, emissiveIntensity: 0.13
        });
        const upperLeg = new THREE.Mesh(upperLegGeo, upperLegMat);
        upperLeg.position.y = -0.4;
        this.leftLeg.add(upperLeg);
        // 发光能量管
        const legTubeGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.8, 12);
        const legTubeMat = new THREE.MeshPhysicalMaterial({
            color: accentBlue, emissive: accentBlue, emissiveIntensity: 1.1, transparent: true, opacity: 0.7
        });
        const legTube = new THREE.Mesh(legTubeGeo, legTubeMat);
        legTube.position.y = -0.4;
        this.leftLeg.add(legTube);
        // 爪型脚
        for (let i = 0; i < 3; i++) {
            const toeGeo = new THREE.CylinderGeometry(0.012, 0.018, 0.16, 8);
            const toeMat = new THREE.MeshPhysicalMaterial({
                color: accentOrange, emissive: accentOrange, emissiveIntensity: 1.1
            });
            const toe = new THREE.Mesh(toeGeo, toeMat);
            const angle = Math.PI * (i / 3 - 0.5);
            toe.position.set(Math.sin(angle) * 0.05, -0.85, 0.07 + Math.cos(angle) * 0.04);
            toe.rotation.x = Math.PI / 2 + angle;
            this.leftLeg.add(toe);
        }
        this.leftLeg.position.set(-0.13, 1.1, 0);
        group.add(this.leftLeg);
        this.rightLeg = this.leftLeg.clone();
        this.rightLeg.position.set(0.13, 1.1, 0);
        group.add(this.rightLeg);
        // 整体位置
        group.position.set(0, 0.7, 0);
        this.mesh = group;
        if (this.sceneRef) this.sceneRef.add(this.mesh);
    }

    public addToScene(scene: THREE.Scene): void {
        if (!this.addedToScene) {
            scene.add(this.mesh);
            this.sceneRef = scene;
            this.addedToScene = true;
        }
    }

    public update(deltaTime: number, input: InputState3D): void {
        this.time += deltaTime;
        // EVA步态动画（大步幅、机械感）
        const moveVector = new THREE.Vector3();
        if (input.forward) moveVector.z -= 1;
        if (input.backward) moveVector.z += 1;
        if (input.left) moveVector.x -= 1;
        if (input.right) moveVector.x += 1;
        const isMoving = moveVector.length() > 0;
        if (isMoving) {
            const walkSpeed = 8.5;
            const swing = Math.sin(this.time * walkSpeed) * 1.25;
            if (this.leftLeg && this.rightLeg && this.leftArm && this.rightArm) {
                this.leftLeg.rotation.x = swing;
                this.rightLeg.rotation.x = -swing;
                this.leftArm.rotation.x = -swing * 0.9;
                this.rightArm.rotation.x = swing * 0.9;
            }
        } else {
            if (this.leftLeg && this.rightLeg && this.leftArm && this.rightArm) {
                this.leftLeg.rotation.x = 0;
                this.rightLeg.rotation.x = 0;
                this.leftArm.rotation.x = 0;
                this.rightArm.rotation.x = 0;
            }
        }
        // 移动逻辑
        if (isMoving) {
            moveVector.normalize();
            moveVector.multiplyScalar(this.speed * deltaTime);
            this.velocity.x = moveVector.x;
            this.velocity.z = moveVector.z;
        } else {
            this.velocity.x *= 0.8;
            this.velocity.z *= 0.8;
        }
        // 跳跃
        if (input.jump && this.isOnGround) {
            this.velocity.y = this.jumpForce;
            this.isOnGround = false;
        }
        if (!this.isOnGround) {
            this.velocity.y -= this.gravity * deltaTime;
        }
        this.mesh.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        if (this.mesh.position.y <= 0.7) {
            this.mesh.position.y = 0.7;
            this.velocity.y = 0;
            this.isOnGround = true;
        }
        // 朝向
        if (isMoving) {
            const angle = Math.atan2(moveVector.x, moveVector.z);
            this.mesh.rotation.y = angle;
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