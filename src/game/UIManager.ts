import { Player3D } from './Player3D';

export class UIManager {
    private scoreElement: HTMLElement | null = null;
    private healthElement: HTMLElement | null = null;
    private healthFillElement: HTMLElement | null = null;

    constructor() {
        this.initializeUI();
    }

    private initializeUI(): void {
        this.scoreElement = document.getElementById('score');
        this.healthElement = document.getElementById('health');
        this.healthFillElement = document.getElementById('healthFill');
    }

    public updateUI(player: Player3D): void {
        // 更新分数
        if (this.scoreElement) {
            this.scoreElement.textContent = player.getScore().toString();
        }

        // 更新生命值
        if (this.healthElement) {
            this.healthElement.textContent = player.getHealth().toString();
        }

        // 更新血条
        if (this.healthFillElement) {
            const healthPercent = player.getHealth() / 100;
            this.healthFillElement.style.width = `${healthPercent * 100}%`;
            
            // 根据生命值改变颜色
            if (healthPercent > 0.6) {
                this.healthFillElement.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
            } else if (healthPercent > 0.3) {
                this.healthFillElement.style.background = 'linear-gradient(90deg, #FF9800, #FFC107)';
            } else {
                this.healthFillElement.style.background = 'linear-gradient(90deg, #F44336, #E91E63)';
            }
        }
    }

    public showMessage(message: string, duration: number = 3000): void {
        const messageElement = document.createElement('div');
        messageElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 18px;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
        `;
        messageElement.textContent = message;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(messageElement);

        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, duration);
    }

    public updateScore(score: number): void {
        if (this.scoreElement) {
            this.scoreElement.textContent = score.toString();
        }
    }

    public updateHealth(health: number): void {
        if (this.healthElement) {
            this.healthElement.textContent = health.toString();
        }
        
        if (this.healthFillElement) {
            const healthPercent = health / 100;
            this.healthFillElement.style.width = `${healthPercent * 100}%`;
        }
    }
} 