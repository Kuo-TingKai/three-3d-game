# Cursor IDE 3D 游戏开发环境

这是一个专为在Cursor IDE中直接开发3D游戏而设计的项目模板。使用Three.js和TypeScript，你可以快速开始3D游戏开发。

## 🎮 功能特性

- **完整的3D游戏循环**：使用Three.js进行3D渲染
- **3D角色控制**：支持WASD移动和跳跃
- **鼠标视角控制**：支持鼠标锁定和视角旋转
- **物理系统**：重力、碰撞检测
- **3D世界**：包含地形、障碍物和可收集物品
- **实时UI更新**：生命值、分数显示
- **TypeScript支持**：完整的类型安全
- **热重载开发**：使用Vite进行快速开发

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 在浏览器中打开
开发服务器会自动在 `http://localhost:3000` 启动

## 🎯 游戏控制

- **WASD 或 方向键**：移动角色
- **鼠标/触控板**：视角控制（点击游戏窗口锁定鼠标）
- **空格键**：跳跃
- **点击/触控板点击**：射击（待实现）

### Mac兼容性说明

如果你在Mac上的Chrome浏览器遇到控制问题：

1. **键盘控制**：确保没有启用系统快捷键冲突
2. **触控板控制**：游戏已优化支持Mac触控板
3. **指针锁定**：点击游戏窗口后按ESC键退出锁定
4. **调试模式**：按D键查看调试信息，按P键查看按键状态

如果仍有问题，可以访问 `test-controls.html` 进行控制测试。

## 📁 项目结构

```
src/
├── main.ts              # 游戏入口点
└── game/
    ├── Game3D.ts        # 3D游戏主类
    ├── Player3D.ts      # 3D玩家类
    ├── InputManager3D.ts # 3D输入管理器
    ├── World3D.ts       # 3D世界类
    └── UIManager.ts     # UI管理器
```

## 🛠️ 开发指南

### 添加新功能

1. **添加新的3D对象**：
   ```typescript
   // 在 src/game/ 目录下创建新类
   export class Enemy3D {
       private mesh: THREE.Mesh;
       
       constructor() {
           // 创建3D几何体
           const geometry = new THREE.BoxGeometry(1, 1, 1);
           const material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
           this.mesh = new THREE.Mesh(geometry, material);
       }
   }
   ```

2. **扩展输入系统**：
   ```typescript
   // 在 InputState3D 接口中添加新输入
   export interface InputState3D {
       // 现有输入...
       newAction: boolean;
   }
   ```

3. **添加新的世界元素**：
   ```typescript
   // 在 World3D 类中添加新方法
   public addNewElement(): void {
       // 创建新的3D元素
   }
   ```

### 3D游戏开发最佳实践

1. **性能优化**：使用几何体实例化和LOD（细节层次）
2. **内存管理**：及时清理几何体和材质
3. **光照设置**：合理配置环境光和方向光
4. **阴影优化**：使用PCF软阴影提高质量

## 🎨 自定义3D游戏

### 修改玩家外观
编辑 `Player3D.ts` 中的 `createPlayerMesh` 方法

### 添加新游戏机制
在 `Game3D.ts` 的 `update` 方法中添加新逻辑

### 创建新3D环境
扩展 `World3D.ts` 添加新的地形和对象

### 添加粒子效果
```typescript
// 使用Three.js粒子系统
const particleSystem = new THREE.Points(geometry, material);
scene.add(particleSystem);
```

## 🔧 构建生产版本

```bash
npm run build
```

构建后的文件将输出到 `dist/` 目录

## 📚 进阶开发

### 添加音效
使用Web Audio API：

```typescript
// 在游戏类中添加音效管理
private audioContext: AudioContext;
private loadSound(url: string): Promise<AudioBuffer> {
    // 加载音效
}
```

### 多人游戏
使用WebSocket添加多人功能：

```bash
npm install socket.io-client
```

### 物理引擎
集成Cannon.js物理引擎：

```bash
npm install cannon
```

### 3D模型加载
加载外部3D模型：

```typescript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('model.gltf', (gltf) => {
    scene.add(gltf.scene);
});
```

## 🐛 调试技巧

1. **Three.js Inspector**：使用浏览器扩展调试3D场景
2. **性能监控**：使用Stats.js监控帧率
3. **控制台调试**：在浏览器控制台查看Three.js对象
4. **使用断点**：在Cursor IDE中设置断点调试

## 📖 学习资源

- [Three.js 官方文档](https://threejs.org/docs/)
- [Three.js 示例](https://threejs.org/examples/)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [WebGL 基础](https://webglfundamentals.org/)
- [3D游戏开发模式](https://gameprogrammingpatterns.com/)

## 🎮 游戏特色

- **3D角色**：可爱的方块人角色
- **动态世界**：旋转的金币和障碍物
- **实时阴影**：高质量的光影效果
- **平滑动画**：流畅的角色移动和相机跟随
- **响应式UI**：实时更新的游戏状态显示

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个3D游戏开发环境！

---

**享受在Cursor IDE中开发3D游戏的乐趣！** 🎮✨ 