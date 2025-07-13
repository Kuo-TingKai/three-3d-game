export interface InputState3D {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
    shoot: boolean;
    mouseX: number;
    mouseY: number;
    mouseDeltaX: number;
    mouseDeltaY: number;
}

export class InputManager3D {
    private keys: { [key: string]: boolean } = {};
    private mouseX: number = 0;
    private mouseY: number = 0;
    private mouseDeltaX: number = 0;
    private mouseDeltaY: number = 0;
    private mousePressed: boolean = false;
    private isPointerLocked: boolean = false;

    constructor() {
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // 鼠标事件
        document.addEventListener('mousemove', (e) => {
            if (this.isPointerLocked) {
                this.mouseDeltaX = e.movementX || 0;
                this.mouseDeltaY = e.movementY || 0;
            } else {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            }
        });

        document.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // 左键
                this.mousePressed = true;
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (e.button === 0) { // 左键
                this.mousePressed = false;
            }
        });

        // 指针锁定事件
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement !== null;
        });

        // 防止默认行为
        document.addEventListener('keydown', (e) => {
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });

        // 防止右键菜单
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    public getInput(): InputState3D {
        const input: InputState3D = {
            forward: this.keys['KeyW'],
            backward: this.keys['KeyS'],
            left: this.keys['KeyA'],
            right: this.keys['KeyD'],
            jump: this.keys['Space'],
            shoot: this.mousePressed,
            mouseX: this.mouseX,
            mouseY: this.mouseY,
            mouseDeltaX: this.mouseDeltaX,
            mouseDeltaY: this.mouseDeltaY
        };

        // 重置鼠标增量
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;

        return input;
    }

    public isKeyPressed(keyCode: string): boolean {
        return this.keys[keyCode] || false;
    }

    public getMousePosition(): { x: number; y: number } {
        return { x: this.mouseX, y: this.mouseY };
    }

    public getMouseDelta(): { x: number; y: number } {
        return { x: this.mouseDeltaX, y: this.mouseDeltaY };
    }

    public getPointerLocked(): boolean {
        return this.isPointerLocked;
    }

    public requestPointerLock(): void {
        document.body.requestPointerLock();
    }
} 