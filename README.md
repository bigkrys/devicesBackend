# 设备管理服务设计文档

## 1. 技术栈选择
- 核心框架：Node.js + Koa2
- 数据库：MongoDB（适合存储设备数据的文档型数据库）
- ORM工具：Mongoose（操作MongoDB的优秀ODM工具）
- 接口文档：Swagger/OpenAPI
- 身份认证：JWT (JSON Web Token)
- 日志管理：Winston
- 参数校验：Joi

## 2. 项目结构
```
aPaaSBackend/
├── src/                      # 源代码目录
│   ├── api/                 # API 接口层
│   │   └── v1/             # API 版本控制
│   │       └── devices/    # 设备相关接口
│   │           ├── controller.ts  # 控制器
│   │           ├── service.ts     # 服务层
│   │           ├── model.ts       # 数据模型
│   │           ├── validation.ts  # 参数验证
│   │           └── types.ts       # 类型定义
│   ├── common/             # 通用代码
│   │   ├── constants/     # 常量定义
│   │   ├── enums/        # 枚举定义
│   │   └── types/        # 通用类型定义
│   ├── config/            # 配置文件
│   │   ├── database.ts   # 数据库配置
│   │   ├── logger.ts     # 日志配置
│   │   └── server.ts     # 服务器配置
│   ├── core/             # 核心模块
│   │   ├── base/        # 基础类
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   └── model.ts
│   │   └── decorators/  # 装饰器
│   ├── middlewares/      # 中间件
│   │   ├── auth.ts      # 认证中间件
│   │   ├── error.ts     # 错误处理
│   │   ├── logger.ts    # 日志中间件
│   │   └── validator.ts # 参数验证中间件
│   ├── utils/            # 工具函数
│   │   ├── database/    # 数据库工具
│   │   ├── logger/      # 日志工具
│   │   └── helpers/     # 辅助函数
│   ├── scripts/         # 脚本文件
│   │   ├── seeds/      # 数据库种子
│   │   └── migrations/ # 数据库迁移
│   └── app.ts          # 应用入口文件
├── tests/               # 测试目录
│   ├── unit/           # 单元测试
│   ├── integration/    # 集成测试
│   └── e2e/           # 端到端测试
├── docs/               # 文档目录
│   ├── api/           # API文档
│   └── database/      # 数据库文档
├── logs/              # 日志文件
├── .env.example       # 环境变量示例
├── .eslintrc.js      # ESLint配置
├── .prettierrc       # Prettier配置
├── tsconfig.json     # TypeScript配置
├── jest.config.js    # Jest测试配置
├── nodemon.json      # Nodemon配置
├── package.json      # 项目依赖
└── README.md         # 项目说明文档
```

## 3. 数据模型设计

### 设备模型(Device)
```javascript
{
  deviceId: String,        // 设备唯一标识
  name: String,           // 设备名称
  type: String,          // 设备类型
  status: String,        // 设备状态（在线/离线/故障）
  location: {           // 设备位置
    longitude: Number,
    latitude: Number,
    address: String
  },
  specifications: {     // 设备规格
    model: String,      // 型号
    manufacturer: String, // 制造商
    productionDate: Date // 生产日期
  },
  lastOnlineTime: Date,  // 最后在线时间
  lastMaintenanceTime: Date, // 最后维护时间
  createdAt: Date,      // 创建时间
  updatedAt: Date       // 更新时间
}
```

## 4. API接口设计

### 基础路径
```
/api/devices
```

### 接口列表

1. 创建设备
- 路径: POST /api/devices
- 功能：新增设备信息
- 权限：需要管理员权限

2. 获取设备列表
- 路径: GET /api/devices
- 功能：获取设备列表，支持分页、筛选和排序
- 查询参数：
  - page: 页码
  - limit: 每页数量
  - type: 设备类型
  - status: 设备状态
  - keyword: 搜索关键词

3. 获取设备详情
- 路径: GET /api/devices/:deviceId
- 功能：获取单个设备的详细信息

4. 更新设备信息
- 路径: PUT /api/devices/:deviceId
- 功能：更新设备信息

5. 删除设备
- 路径: DELETE /api/devices/:deviceId
- 功能：删除设备信息
- 权限：需要管理员权限

6. 更新设备状态
- 路径: PATCH /api/devices/:deviceId/status
- 功能：更新设备在线状态

7. 设备维护记录
- 路径: POST /api/devices/:deviceId/maintenance
- 功能：添加设备维护记录

## 5. 错误处理
统一的错误响应格式：
```javascript
{
  code: number,       // 错误码
  message: string,    // 错误信息
  data: any          // 额外的错误数据（可选）
}
```

## 6. 安全性考虑
1. 实现JWT认证机制
2. 接口访问频率限制
3. 参数校验
4. 敏感数据加密
5. CORS配置
6. 日志记录

## 7. 性能优化
1. 数据库索引优化
2. 接口缓存策略
3. 大数据量分页处理
4. 聚合查询优化

## 8. 可扩展性考虑
1. 支持设备类型的动态扩展
2. 预留设备监控指标的扩展接口
3. 支持自定义设备属性
4. 预留设备数据导入导出接口

## 9. 开发和部署

### 开发环境配置
1. Node.js >= 14.0.0
2. MongoDB >= 4.4
3. npm >= 6.0.0

### 安装和运行
```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 生产环境构建
npm run build

# 生产环境运行
npm start
```

### 环境变量配置
创建 `.env` 文件在项目根目录：
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/device_management
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## 10. 部署方案

### 10.1 环境区分
```
开发环境（Development）：
- 域名：dev-api.example.com
- 特点：开启详细日志、错误堆栈、接口调试工具

测试环境（Testing）：
- 域名：test-api.example.com
- 特点：模拟生产环境配置，用于QA测试

预生产环境（Staging）：
- 域名：staging-api.example.com
- 特点：与生产环境配置完全一致，用于最终验证

生产环境（Production）：
- 域名：api.example.com
- 特点：优化性能配置，关闭调试功能
```

### 10.2 部署架构
```
                                    [负载均衡器 Nginx]
                                           │
                    ┌──────────────┬──────┴───────┬──────────────┐
                    │              │              │              │
              [Node实例1]    [Node实例2]    [Node实例3]    [Node实例4]
                    │              │              │              │
                    └──────────────┴──────────────┴──────────────┘
                                           │
                                    [MongoDB集群]
                                           │
                    ┌──────────────┬──────┴───────┬──────────────┐
                    │              │              │              │
              [主节点]      [从节点1]      [从节点2]        [仲裁节点]
```

### 10.3 部署步骤

#### 10.3.1 环境准备
```bash
# 1. 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装 PM2
npm install -g pm2

# 3. 安装 MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# 4. 安装 Nginx
sudo apt-get install nginx
```

#### 10.3.2 应用部署配置

1. **PM2 配置文件** (`ecosystem.config.js`)
```javascript
module.exports = {
  apps: [{
    name: 'device-management-api',
    script: 'dist/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    env_staging: {
      NODE_ENV: 'staging'
    }
  }]
}
```

2. **Nginx 配置** (`/etc/nginx/conf.d/api.conf`)
```nginx
upstream api_nodes {
    least_conn;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://api_nodes;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### 10.3.3 自动化部署脚本

1. **部署脚本** (`deploy.sh`)
```bash
#!/bin/bash

# 更新代码
git pull origin main

# 安装依赖
npm install

# 构建项目
npm run build

# 更新数据库
npm run migrate

# 使用PM2重启服务
pm2 reload ecosystem.config.js --env production
```

#### 10.3.4 监控和日志

1. **应用监控**
- 使用 PM2 监控
```bash
pm2 monit
```

2. **日志收集**
- 应用日志：`/logs/`
- Nginx 访问日志：`/var/log/nginx/access.log`
- Nginx 错误日志：`/var/log/nginx/error.log`
- MongoDB 日志：`/var/log/mongodb/mongod.log`

3. **监控指标**
- CPU 使用率
- 内存使用
- 请求响应时间
- 错误率
- 并发连接数

### 10.4 备份策略

#### 10.4.1 数据库备份
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backup/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="device_management"

# 创建备份
mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE

# 保留最近7天的备份
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

#### 10.4.2 自动备份配置
```
# crontab -e
0 2 * * * /path/to/backup.sh  # 每天凌晨2点执行备份
```

### 10.5 回滚策略

1. **代码回滚**
```bash
# 回退到指定版本
git reset --hard <commit_id>
npm install
npm run build
pm2 reload ecosystem.config.js --env production
```

2. **数据库回滚**
```bash
# 恢复到指定备份
mongorestore --db device_management /backup/mongodb/[backup_date]
```

### 10.6 性能优化

1. **Node.js 优化**
```javascript
// 配置示例
{
  "max_old_space_size": "4096",  // 增加内存限制
  "gc_interval": "100000"        // 垃圾回收间隔
}
```

2. **Nginx 优化**
```nginx
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 65535;
    use epoll;
    multi_accept on;
}

http {
    keepalive_timeout 65;
    keepalive_requests 100000;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    # 开启gzip
    gzip on;
    gzip_min_length 1k;
    gzip_comp_level 2;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
}
```

3. **MongoDB 优化**
```yaml
# mongod.conf
operationProfiling:
  mode: slowOp
  slowOpThresholdMs: 100

# 索引优化
db.devices.createIndex({ "deviceId": 1 })
db.devices.createIndex({ "status": 1 })
db.devices.createIndex({ "type": 1 })
```

### 10.7 安全措施

1. **服务器安全**
- 启用防火墙
- 禁用root远程登录
- 使用SSH密钥认证
- 定期更新系统补丁

2. **应用安全**
- 启用HTTPS
- 实施速率限制
- 配置CORS
- 使用安全的会话管理

3. **数据安全**
- 数据加密存储
- 定期备份
- 访问权限控制
- 审计日志

### 10.8 灾难恢复

1. **准备工作**
- 保持最新的备份
- 文档化恢复流程
- 定期演练恢复流程

2. **恢复步骤**
- 启动备用服务器
- 恢复最新备份
- 更新DNS记录
- 验证系统功能

### 10.9 持续集成/持续部署 (CI/CD)

使用 GitHub Actions 配置 CI/CD 流程：

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/project
            git pull
            npm install
            npm run build
            pm2 reload ecosystem.config.js --env production
``` 

## 11. 容器化部署方案

### 11.1 容器化架构
```
                                    [Kubernetes集群]
                                           │
                    ┌──────────────┬──────┴───────┬──────────────┐
                    │              │              │              │
              [Ingress控制器]  [服务网格]    [配置中心]     [监控系统]
                    │              │              │              │
            ┌───────┴──────┐      │         ┌────┴────┐    ┌────┴────┐
            │              │      │         │         │    │         │
    [API服务Pod集群]  [MongoDB集群] [Redis集群] [日志系统] [监控告警] [链路追踪]
```

### 11.2 Docker配置

#### 11.2.1 Dockerfile
```dockerfile
# 构建阶段
FROM node:16-alpine as builder

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 运行阶段
FROM node:16-alpine

WORKDIR /app

# 复制构建产物和依赖
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# 仅安装生产依赖
RUN npm ci --only=production

# 设置环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "dist/app.js"]
```

#### 11.2.2 .dockerignore
```
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.gitignore
README.md
.env
.env.*
logs
*.log
```

### 11.3 Kubernetes配置

#### 11.3.1 部署配置 (deployment.yaml)
```yaml
apiVersion: apps
kind: Deployment
metadata:
  name: device-management-api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: device-management-api
  template:
    metadata:
      labels:
        app: device-management-api
    spec:
      containers:
      - name: device-management-api
        image: your-registry.com/device-management-api:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: uri
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### 11.3.2 服务配置 (service.yaml)
```yaml
apiVersion: v1
kind: Service
metadata:
  name: device-management-api
  namespace: production
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: device-management-api
```

#### 11.3.3 Ingress配置 (ingress.yaml)
```yaml
apiVersion: networking.k8s.io
kind: Ingress
metadata:
  name: device-management-api
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - api.example.com
    secretName: api-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: device-management-api
            port:
              number: 80
```

#### 11.3.4 配置映射 (configmap.yaml)
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: device-management-config
  namespace: production
data:
  NODE_ENV: production
  LOG_LEVEL: info
  API_VERSION: v1
```

#### 11.3.5 密钥配置 (secret.yaml)
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: device-management-secrets
  namespace: production
type: Opaque
data:
  MONGODB_URI: base64_encoded_uri
  JWT_SECRET: base64_encoded_secret
```

### 11.4 持续集成/持续部署 (CI/CD)

#### 11.4.1 GitHub Actions工作流 (.github/workflows/deploy.yml)
```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Log in to the Container registry
        uses: docker/login-action@v1
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Configure kubectl
        uses: azure/k8s-set-context@v1
        with:
          kubeconfig: ${{ secrets.KUBE_CONFIG }}

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/device-management-api \
            device-management-api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n production
```

### 11.5 监控配置

#### 11.5.1 Prometheus配置 (prometheus.yaml)
```yaml
apiVersion: monitoring.coreos.com
kind: ServiceMonitor
metadata:
  name: device-management-api
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: device-management-api
  endpoints:
  - port: http
    path: /metrics
    interval: 15s
```

#### 11.5.2 Grafana仪表板配置
```json
{
  "dashboard": {
    "id": null,
    "title": "Device Management API",
    "panels": [
      {
        "title": "请求率",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "rate(http_requests_total{service=\"device-management-api\"}[5m])"
          }
        ]
      },
      {
        "title": "错误率",
        "type": "graph",
        "datasource": "Prometheus",
        "targets": [
          {
            "expr": "rate(http_requests_errors_total{service=\"device-management-api\"}[5m])"
          }
        ]
      }
    ]
  }
}
```

### 11.6 容器化部署步骤

1. **准备工作**
```bash
# 构建Docker镜像
docker build -t device-management-api .

# 测试运行容器
docker run -p 3000:3000 device-management-api
```

2. **Kubernetes部署**
```bash
# 创建命名空间
kubectl create namespace production

# 应用配置
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# 验证部署
kubectl get pods -n production
kubectl get services -n production
kubectl get ingress -n production
```

3. **设置自动扩展**
```yaml
apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: device-management-api
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps
    kind: Deployment
    name: device-management-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageUtilization: 70
  - type: Resource
    resource:
      name: memory
      targetAverageUtilization: 80
```

### 11.7 容器化部署优势

1. **可移植性**
   - 一致的运行环境
   - 简化部署流程
   - 环境隔离

2. **可扩展性**
   - 自动水平扩展
   - 负载均衡
   - 资源弹性

3. **可维护性**
   - 版本控制
   - 快速回滚
   - 配置管理

4. **监控和日志**
   - 集中式日志收集
   - 实时监控
   - 性能分析

5. **安全性**
   - 容器隔离
   - 镜像扫描
   - 访问控制

### 11.8 注意事项

1. **资源管理**
   - 合理设置资源限制
   - 监控资源使用
   - 优化资源分配

2. **安全配置**
   - 使用非root用户
   - 配置网络策略
   - 实施最小权限原则

3. **高可用配置**
   - 多副本部署
   - 跨区域部署
   - 故障转移策略

4. **备份策略**
   - 定期备份
   - 数据持久化
   - 灾难恢复计划 