import { Game3D } from './game/Game3D';

// 3D游戏启动
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('gameContainer');
    const loadingElement = document.getElementById('loading');
    
    if (!gameContainer) {
        console.error('找不到游戏容器！');
        return;
    }
    
    const game = new Game3D(gameContainer);
    
    // 隐藏加载提示
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    game.start();
}); 