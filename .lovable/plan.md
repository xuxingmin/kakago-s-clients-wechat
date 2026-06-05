## TRIVA 品牌重塑方案

### 一、设计令牌彻底替换 (`src/index.css` + `tailwind.config.ts`)

**色彩系统（HSL）**：
- `--background`: `#F3EBDD` 燕麦米 (oat)
- `--card` / surface: `#F8F0E6` 纸张 (paper)
- `--foreground`: `#181411` 浓缩黑 (espresso)
- `--primary`: `#3B255F` 葡萄紫 (grape) — 替代电紫
- `--accent`: `#B46A3C` 铜色 (copper) — 用于高亮/价格/CTA 强调
- `--muted` / fog: `#D6D2CA` 雾灰
- `--border`: `rgba(24,20,17,0.18)` 细线

**字体**：
- 标题（h1/h2/品牌名/价格）：`Georgia, "Times New Roman", "Noto Serif SC", serif` 衬线
- 正文/UI：保留 Inter / 苹方无衬线
- 新增 Tailwind `font-serif` 工具类

**阴影/质感**：
- 由"紫色辉光"改为"纸面浮起"——柔和 `0 28px 80px rgba(59,37,95,.12)`
- 移除所有 `pulse-glow`、`shadow-purple`、霓虹边

### 二、品牌文本与资源替换

全局搜索替换：
- `KAKAGO` → `TRIVA`
- `KAKA Beans` / `KAKA 豆` → `TRIVA Beans` / `TRIVA 豆`（保留 1元=100豆 逻辑）
- `kakago.app` 邮箱后缀 → `triva.app`
- slogan "不贵精品，即刻上瘾！" 保留（如需新 slogan 请告知）

### 三、组件视觉适配

按模块批量调整（语义令牌替换为主，无业务逻辑改动）：

1. **Header / BrandBanner / BrandHeader** — 衬线 TRIVA logo、葡萄紫色、铜色 EN 切换
2. **BottomNav** — 由玻璃拟态深色 → 纸张白底 + 葡萄紫激活态
3. **HeroBanner / BlindBoxHero** — 浅米色卡片，葡萄紫标题，铜色 CTA
4. **ProductCard / ProductTile / CompactProductCard / ProductGridCard** — 纸张卡 + 细灰边 + 衬线价格 + 铜色加购按钮
5. **CouponCard / CouponFlags / Tactical Boosters** — 葡萄紫底 + 燕麦米字
6. **OrderCard / Orders / OrderTracking** — Job Ticket 转为浅色"票据"风
7. **Checkout / Payment / Cashier** — 浅色票据感
8. **Profile / Wallet / KakaBeans / Coupons / Help / MySquad / Merchant\*** — 同步配色
9. **所有 Modal / Sheet** — paper 背景 + 细线分隔
10. **图标** — 由白/紫 → 浓缩黑/葡萄紫，保留 1.5px stroke

### 四、保留不变
- 393px 移动布局架构、flex + scrollbar-hide + pb-24
- 所有业务逻辑、路由、Context、Supabase、数据模型
- 单层交互原则、手机号身份原则、所有功能特性

### 五、记忆更新
更新 `mem://index.md` Core 段品牌+配色+字体；新增/重写：
- `mem://style/color-palette` → TRIVA 浅色配色
- `mem://style/typography-standard` → 衬线标题
- `mem://style/aesthetic-direction` → 编辑/纸张/精品店
- `mem://brand/messaging` → TRIVA 名称
新增：`mem://brand/identity` 记录改名历史。

### 六、执行顺序
1. 改 `index.css` + `tailwind.config.ts`（设计令牌）
2. 全局 sed 替换 KAKAGO → TRIVA
3. 适配 Header/BottomNav/BrandBanner/Banner 系列
4. 批量适配商品卡 / 订单卡 / 卡券卡
5. 各页面顶部 brand 元素及深色直写类清理
6. 浏览器预览 QA：Home / Orders / Checkout / Profile / OrderTracking 5 个关键页
7. 更新记忆

### 技术细节
- 仅替换语义令牌；不引入新依赖
- 个别硬编码 `text-white` / `bg-black` 需改为 `text-foreground` / `bg-background`
- 衬线字体通过 Tailwind `font-serif` + index.css `@layer base h1,h2 { font-family: serif }` 全局生效
- KAKA Beans 字段名（DB / context / hook）保持不变，仅 UI 文案改 TRIVA Beans，避免破坏后端契约

工作量预估：~30-40 文件触达，主要为令牌与类名替换，无业务逻辑风险。
