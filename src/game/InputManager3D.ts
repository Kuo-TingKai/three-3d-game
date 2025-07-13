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
    private isMac: boolean = false;

    constructor() {
        this.detectPlatform();
        this.setupEventListeners();
    }

    private detectPlatform(): void {
        // 检测是否为Mac平台
        this.isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        console.log('检测到平台:', this.isMac ? 'Mac' : '其他');
    }

    private setupEventListeners(): void {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            console.log('按键按下:', e.code);
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // 鼠标事件 - 支持多种触发方式
        document.addEventListener('mousedown', (e) => {
            console.log('鼠标按下:', e.button, '按钮');
            // 支持左键(0)和触控板点击
            if (e.button === 0 || e.button === 1) {
                this.mousePressed = true;
                console.log('射击触发');
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (e.button === 0 || e.button === 1) {
                this.mousePressed = false;
            }
        });

        // 触控板事件支持
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.mousePressed = true;
            console.log('触控板触摸开始');
        });

        document.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.mousePressed = false;
            console.log('触控板触摸结束');
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            if (this.isPointerLocked) {
                this.mouseDeltaX = e.movementX || 0;
                this.mouseDeltaY = e.movementY || 0;
            } else {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            }
        });

        // 指针锁定事件
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement !== null;
            console.log('指针锁定状态:', this.isPointerLocked);
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

        // 添加键盘事件监听器用于调试
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyP') {
                console.log('当前按键状态:', this.keys);
            }
        });
    }

    public getInput(): InputState3D {
        const input: InputState3D = {
            forward: this.keys['KeyW'] || this.keys['ArrowUp'],
            backward: this.keys['KeyS'] || this.keys['ArrowDown'],
            left: this.keys['KeyA'] || this.keys['ArrowLeft'],
            right: this.keys['KeyD'] || this.keys['ArrowRight'],
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
        // 这个方法现在由MacCompatibility类处理
        console.log('请求指针锁定 - 由MacCompatibility处理');
    }

    // 添加调试方法
    public debugInput(): void {
        console.log('当前输入状态:', {
            keys: this.keys,
            mousePressed: this.mousePressed,
            isPointerLocked: this.isPointerLocked,
            isMac: this.isMac
        });
    }
} 