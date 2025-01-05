# 快速上手指南：让AI模型为你所用

想要开始使用这些超值的折扣模型？让我带你轻松上手！

## 三种体验方式

### 1. 在线聊天室
最简单的开始方式是访问 [chat.rifx.online](https://chat.rifx.online)：
- 无需编程基础
- 支持多个模型随意切换
- 实时流式对话响应
- 自动保存历史记录

### 2. 模型浏览器
访问 [rifx.online/zh/models](https://rifx.online/zh/models) 可以：
- 查看所有模型实时状态
- 了解详细价格和参数
- 获取场景化推荐
- 阅读完整技术文档

### 3. API 开发接入
如果你是开发者，可以通过API快速接入：

```bash
# 1. 安装SDK
pip install openai

# 2. 设置环境变量
export RIFX_API_KEY='your-api-key'
```

## 典型应用示例

### 1. 智能客服系统
```python
async def customer_service(query: str):
    """智能客服路由示例"""
    # 1. 意图识别
    intent = await client.chat.completions.create(
        model="rifx/gpt-4o-mini",  # 使用经济型模型
        messages=[{
            "role": "system",
            "content": "识别用户意图：咨询、投诉、购买、技术支持",
            "role": "user",
            "content": query
        }]
    )
    
    # 2. 智能回复
    models = {
        "咨询": "rifx/o1-mini",     # 日常咨询用经济型
        "投诉": "rifx/gpt-4o",      # 投诉处理用高性能版
        "购买": "rifx/o1-mini",     # 购买咨询用经济型
        "技术支持": "rifx/o1-preview" # 技术问题用专业版
    }
    
    return await client.chat.completions.create(
        model=models.get(intent.choices[0].message.content, "rifx/o1-mini"),
        messages=[{"role": "user", "content": query}]
    )
```

### 2. 内容创作助手
```python
async def create_content(topic: str, lang: str = "中文"):
    """多语言内容创作示例"""
    # 1. 创建文案
    content = await client.chat.completions.create(
        model="rifx/gpt-4o",
        messages=[{
            "role": "user",
            "content": f"为{topic}创作{lang}营销文案"
        }]
    )
    
    # 2. 生成配图
    image = await client.images.generate(
        model="rifx/gpt-4o",
        prompt=f"{topic} promotional image",
        n=1,
        size="1024x1024"
    )
    
    return {
        "content": content.choices[0].message.content,
        "image_url": image.data[0].url
    }
```

## 性能优化技巧

### 1. 模型选择优化
```python
# 根据任务复杂度选择合适的模型
models = {
    "简单对话": "rifx/o1-mini",      # 6折优惠，日常对话
    "专业分析": "rifx/o1-preview",   # 7折优惠，专业任务
    "图文处理": "rifx/gpt-4o",       # 6折优惠，多模态
    "通用任务": "rifx/gpt-4o-mini"   # 6折优惠，性价比高
}

async def smart_completion(task: str, content: str):
    model = models.get(task, "rifx/o1-mini")
    return await client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": content}]
    )
```

### 2. 成本控制方案
```python
class CostManager:
    def __init__(self):
        self.daily_limit = 100000  # 设置每日token限制
        self.used_tokens = 0
        
    async def check_and_call(self, content: str):
        # 1. 预估token
        estimated_tokens = len(content.split()) * 1.5
        
        # 2. 检查限额
        if self.used_tokens + estimated_tokens > self.daily_limit:
            return "已达到每日限额"
            
        # 3. 使用经济型模型
        response = await client.chat.completions.create(
            model="rifx/o1-mini",  # 使用最经济的模型
            messages=[{"role": "user", "content": content}]
        )
        
        # 4. 更新用量
        self.used_tokens += response.usage.total_tokens
        return response
```

### 3. 缓存优化方案
```python
import redis
from hashlib import md5

class CacheManager:
    def __init__(self):
        self.redis = redis.Redis(host='localhost', port=6379)
        
    async def get_response(self, prompt: str):
        # 1. 生成缓存键
        cache_key = f"rifx:{md5(prompt.encode()).hexdigest()}"
        
        # 2. 检查缓存
        if cached := self.redis.get(cache_key):
            return cached
            
        # 3. 调用API
        response = await client.chat.completions.create(
            model="rifx/o1-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        
        # 4. 存储缓存
        self.redis.setex(cache_key, 3600, response.choices[0].message.content)
        return response
```

## 开发者资源

1. **技术文档**
   - 完整API文档：[docs.rifx.online](https://docs.rifx.online)
   - 开发者博客：[rifx.online/zh/blog](https://rifx.online/zh/blog)
   - GitHub仓库：[github.com/rifx-online](https://github.com/rifx-online)

2. **支持渠道**
   - 技术邮箱：[support@rifx.online](mailto:support@rifx.online)
   - 官方微信：RifxAI
   - 在线社区：[rifx.online/community](https://rifx.online/community)

记住，选择合适的模型和优化方案，可以让你在控制成本的同时获得最佳的使用体验。如果遇到问题，随时通过以上渠道寻求帮助！ 