## TRIVA 全局改造 · 执行计划

按 P0 → P1 优先级推进，只做前端设计/文案迁移，不改业务逻辑、不写死价格。

---

### P0 · 必须先改（本轮交付）

**1. 全局资产命名替换**
- 全局搜索 `TRIVA豆 / TRIVA 豆 / KAKA豆 / kaka bean UI 文案` → 改为 `VAVA豆 / VAVA Bean`
- DB 字段 `kaka_beans` 保持不变（仅 UI 层）
- 涉及：`Header`, `Profile`, `KakaBeans`(页面标题), `CoffeeWallet`, `Checkout`, `Payment`, `MiniCartBar`, `CheckoutModal`, `KakaBeanCelebration`, `Coupons` 等
- 补充说明文案："VAVA豆来自评价奖励和咖啡搭子邀请返利，可在支付时抵扣现金"

**2. 顶部服务状态组件（`ServiceStatusBadge`）**
- 三态：绿点`服务中 / 18个节点在线` · 黄点`定位中` · 红点`当前商圈暂未开放`
- 默认态改为绿色，不再默认"暂停"
- 颜色 token：Matcha `#0F6C5C` / Citrus `#E2B84B` / Berry `#A8453D`

**3. 新增色彩 Token**
- `index.css` + `tailwind.config.ts` 新增：`--matcha` `--berry` `--citrus` `--fig` `--paper-grain`
- 现有 grape/copper/oat/paper/espresso/mist 保持

**4. 首页 `BrandBanner` 文案**
- 主文案 → `附近好咖啡，已被组织起来`
- 副文案 → `统一菜单 · 认证节点 · 稳定送达`
- 保留现有 Deep Grape 头图与 Logo

**5. 首页服务状态条（新组件 `ServiceNodeBar`）**
- 位置：BrandBanner 下、菜单上
- 内容：`HF-017 · 2.4km · 预计26min · 今日履约正常`（无数据时 `正在匹配附近认证节点`）
- Milk Foam 底 + Paper Grain 描边 + 等宽小字 + Matcha 状态点

**6. 订单卡 · 认证节点表达**
- `OrderCard` 商家名替换为 `由 HF-{code} 认证节点制作`
- 原门店名下沉为二级信息 `{店名} · 评分 {rating}`

**7. 非首页紧凑头**
- Orders/Profile/Address/Invoice/Payment 等页面已使用 `Header` 组件的走查一遍，确保未插入大 BrandBanner
- 若有大海报，替换为紧凑 Header

**8. 全局品牌名扫描**
- `rg -i "kakago|卡卡购|咖咖购"` 全局清除

---

### P1 · 第二轮（若 P0 完成后继续）

- 商品详情页节点条 + ETA
- 下单确认页新增"认证节点"模块
- 订单状态机补 `30s出票` / `扫码确认完成`
- VAVA豆页来源说明补齐
- 咖啡搭子页 2% 返利文案

---

### 不做的事

- 不改支付/订单/购物车业务逻辑
- 不写死价格
- 不动 DB schema / RLS
- 不新增大品牌海报到内页
- 不引入咖啡豆/杯/蒸汽主视觉

---

### 交付方式

P0 完成后截图首页 + 订单页验收；P1/P2 待你确认后再启动。

**是否按此计划开始 P0？**
