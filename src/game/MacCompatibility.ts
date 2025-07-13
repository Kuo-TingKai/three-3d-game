export class MacCompatibility {
    private static instance: MacCompatibility;
    private isMac: boolean = false;
    private isChrome: boolean = false;

    private constructor() {
        this.detectEnvironment();
        this.setupMacSpecificFixes();
    }

    public static getInstance(): MacCompatibility {
        if (!MacCompatibility.instance) {
            MacCompatibility.instance = new MacCompatibility();
        }
        return MacCompatibility.instance;
    }

    private detectEnvironment(): void {
        // 检测平台
        this.isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        
        // 检测浏览器
        this.isChrome = navigator.userAgent.indexOf('Chrome') > -1 && 
                       navigator.userAgent.indexOf('Safari') > -1 &&
                       navigator.userAgent.indexOf('Edge') === -1;

        console.log('环境检测:', {
            platform: this.isMac ? 'Mac' : '其他',
            browser: this.isChrome ? 'Chrome' : '其他',
            userAgent: navigator.userAgent
        });
    }

    private setupMacSpecificFixes(): void {
        if (this.isMac) {
            this.fixMacKeyboardEvents();
            this.fixMacTouchpadEvents();
            this.fixMacPointerLock();
        }
    }

    private fixMacKeyboardEvents(): void {
        // Mac上的键盘事件可能需要特殊处理
        document.addEventListener('keydown', (e) => {
            // 防止Mac上的系统快捷键干扰
            if (e.metaKey) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    private fixMacTouchpadEvents(): void {
        // 修复Mac触控板事件
        document.addEventListener('touchstart', (e) => {
            if (this.isMac) {
                e.preventDefault();
                // 模拟鼠标点击事件
                const mouseEvent = new MouseEvent('mousedown', {
                    button: 0,
                    bubbles: true,
                    cancelable: true
                });
                e.target?.dispatchEvent(mouseEvent);
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (this.isMac) {
                e.preventDefault();
                // 模拟鼠标释放事件
                const mouseEvent = new MouseEvent('mouseup', {
                    button: 0,
                    bubbles: true,
                    cancelable: true
                });
                e.target?.dispatchEvent(mouseEvent);
            }
        }, { passive: false });
    }

    private fixMacPointerLock(): void {
        // Mac上的指针锁定可能需要特殊处理
        if (this.isMac && this.isChrome) {
            // 添加Chrome特定的指针锁定处理
            document.addEventListener('pointerlockchange', () => {
                console.log('Mac Chrome 指针锁定状态:', document.pointerLockElement !== null);
            });
        }
    }

    public requestPointerLock(element: HTMLElement): void {
        if (this.isMac) {
            // Mac上的指针锁定策略
            try {
                if (element.requestPointerLock) {
                    element.requestPointerLock();
                } else if ((element as any).webkitRequestPointerLock) {
                    (element as any).webkitRequestPointerLock();
                } else if ((element as any).mozRequestPointerLock) {
                    (element as any).mozRequestPointerLock();
                }
            } catch (error) {
                console.warn('Mac指针锁定失败:', error);
            }
        } else {
            // 其他平台的正常处理
            if (element.requestPointerLock) {
                element.requestPointerLock();
            }
        }
    }

    public isMacPlatform(): boolean {
        return this.isMac;
    }

    public isChromeBrowser(): boolean {
        return this.isChrome;
    }

    public getCompatibilityInfo(): object {
        return {
            isMac: this.isMac,
            isChrome: this.isChrome,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            supportsPointerLock: 'requestPointerLock' in document.body,
            supportsWebkitPointerLock: 'webkitRequestPointerLock' in document.body
        };
    }
} 