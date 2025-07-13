import { Game3D } from './game/Game3D';

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    console.log('Starting Cyberpunk 3D Game...');
    
    // 创建游戏实例
    const game = new Game3D();
    
    // 启动游戏
    game.start();
    
    // 添加全局错误处理
    window.addEventListener('error', (event) => {
        console.error('Game Error:', event.error);
    });
    
    // 添加页面卸载时的清理
    window.addEventListener('beforeunload', () => {
        game.dispose();
    });
    
    console.log('Game initialized successfully!');
}); 