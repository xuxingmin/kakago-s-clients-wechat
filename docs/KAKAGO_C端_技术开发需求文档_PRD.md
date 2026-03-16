# KAKAGO C端 技术开发需求文档（PRD / Technical Specs）

> **版本**: v1.0  
> **日期**: 2026-03-16  
> **项目**: KAKAGO 消费者端（C-End）  
> **技术栈**: React 18 + TypeScript + Vite + Tailwind CSS + Supabase  
> **设计分辨率**: 393px（iPhone 15 Pro 基准）  
> **国际化**: 中英双语（`LanguageContext` 运行时切换）

---

## 目录

1. [功能清单 (Feature List)](#1-功能清单-feature-list)
2. [页面结构 (Page Architecture)](#2-页面结构-page-architecture)
3. [核心业务逻辑 (Business Logic)](#3-核心业务逻辑-business-logic)
4. [数据模型 (Data Schema)](#4-数据模型-data-schema)
5. [外部接口定义 (API Requirements)](#5-外部接口定义-api-requirements)
6. [小程序兼容性建议](#6-小程序兼容性建议)

---

## 1. 功能清单 (Feature List)

### 1.1 用户端核心功能

| 模块 | 功能 | 状态 | 说明 |
|------|------|------|------|
| **认证登录** | 手机号 OTP 登录 | ✅ 已实现 | 模拟微信一键登录 + 短信验证码，Supabase 邮箱映射 (`phone@kakago.app`) |
| **认证登录** | 隐私协议弹窗 | ✅ 已实现 | 三步式 Cotti 风格登录流：隐私→选择方式→验证 |
| **商品浏览** | 产品目录展示 | ✅ 已实现 | 双栏瀑布流，分"意式基石"和"先锋实验"两个系列 |
| **商品浏览** | 分类筛选 | ✅ 已实现 | 全部 / 意式基石 / 先锋实验 三级 Tab |
| **购物车** | 加购/减购/清空 | ✅ 已实现 | 底部 MiniCartBar 实时显示数量和预估价 |
| **优惠券** | 自动匹配最优券 | ✅ 已实现 | 支持通用券和品类券，到手价实时计算 |
| **KAKA 豆** | 积分抵扣支付 | ✅ 已实现 | 100豆 = ¥1，Checkout 页滑块/步进器调节 |
| **下单结算** | 确认订单页 | ✅ 已实现 | 地址选择、ETA 预估、商品规格展示、备注、价格明细 |
| **支付** | 收银台 | ✅ 已实现 | 5分钟倒计时、微信/支付宝选择、模拟支付网关 |
| **支付** | 支付结果页 | ✅ 已实现 | 成功/失败状态、订单号、2秒倒计时自动跳转 |
| **订单管理** | 订单列表 | ✅ 已实现 | 当前订单/历史订单 Tab 切换、实时订阅数据库 |
| **订单追踪** | 全链路追踪 | ✅ 已实现 | Pending→Accepted→Rider Assigned→Picked Up→Delivered→Rated |
| **订单追踪** | 宇宙雷达扫描动画 | ✅ 已实现 | Canvas 星空 + 品牌扫描匹配效果（Pending 状态） |
| **订单追踪** | 配送地图 | ✅ 已实现 | SVG 模拟骑手位置 + ETA 显示 |
| **订单追踪** | 咖啡制作参数 | ✅ 已实现 | 展示设备型号、豆种、SCA 风味描述 |
| **订单评价** | 多维度评分 | ✅ 已实现 | 口味/包装/时效 三维星级评分 + 文字评论 |
| **订单评价** | KAKA 豆奖励 | ✅ 已实现 | 评价后随机奖励豆子 + 庆祝动画 |
| **地址管理** | CRUD 地址簿 | ✅ 已实现 | 增删改查、设置默认地址、支持经纬度 |
| **发票管理** | 发票抬头管理 | ✅ 已实现 | 个人/企业发票信息管理 |
| **发票管理** | 开票申请 | ✅ 已实现 | 关联订单号和金额申请开票 |
| **钱包** | 咖啡钱包 | ✅ 已实现 | 优惠券集合展示 |
| **KAKA 豆** | 豆子详情页 | ✅ 已实现 | 余额展示、获取/消耗记录 |
| **社交** | 咖啡搭子（拼单） | ✅ 已实现 | 邀请海报、成员列表 |
| **帮助** | 帮助与支持 | ✅ 已实现 | FAQ 常见问题 |
| **国际化** | 中英文切换 | ✅ 已实现 | 运行时切换，所有文本双语 |
| **服务可达** | 地理围栏校验 | ✅ 已实现 | PostGIS 查询最近门店 + 配送半径检测 |

### 1.2 商家端功能（集成在同一项目）

| 模块 | 功能 | 状态 |
|------|------|------|
| **商家入驻** | 多步骤申请表单 | ✅ 已实现 |
| **商家仪表盘** | 在线/离线切换、今日统计 | ✅ 已实现 |
| **订单管理** | 查看/接单/更新状态 | ✅ 已实现（Edge Function） |

---

## 2. 页面结构 (Page Architecture)

### 2.1 路由表

| 路由 | 页面组件 | 设计意图 |
|------|----------|----------|
| `/` | `Index` | 首页 - 品牌 Banner + 商品目录（双栏 Tile） + 底部购物车栏 |
| `/orders` | `Orders` | 订单中心 - 当前/历史订单 Tab + 实时数据 + 评价入口 |
| `/profile` | `Profile` | 个人中心 - 登录/账号信息 + 资产（券/豆） + 功能菜单 |
| `/checkout` | `Checkout` | 确认订单 - 地址、ETA、商品规格、KAKA 豆抵扣、备注 |
| `/payment` | `Payment` | 收银台 - 5分钟倒计时 + 支付方式选择 + 结果展示 |
| `/order-tracking` | `OrderTracking` | 订单追踪 - 全链路进度 + 宇宙扫描 + 配送地图 + 评价 |
| `/order-confirm` | `OrderConfirm` | 订单确认（旧版，保留兼容） |
| `/wallet` | `CoffeeWallet` | 咖啡钱包 - 优惠券集合 |
| `/kaka-beans` | `KakaBeans` | KAKA 豆 - 余额与交易记录 |
| `/coupons` | `Coupons` | 优惠券列表 |
| `/address` | `AddressManagement` | 地址管理 - 地址列表 |
| `/address/new` | `AddressFormPage` | 新增地址 |
| `/address/edit/:id` | `AddressFormPage` | 编辑地址 |
| `/address/select` | `AddressSelectPage` | 下单选地址（底部弹出） |
| `/invoice` | `InvoiceManagement` | 发票管理 |
| `/invoice-request` | `InvoiceRequest` | 开票申请 |
| `/my-squad` | `MySquad` | 咖啡搭子 - 社交拼单 |
| `/merchant-auth` | `MerchantAuth` | 商家入驻申请 |
| `/merchant` | `MerchantDashboard` | 商家管理后台 |
| `/help` | `HelpSupport` | 帮助与支持 |
| `*` | `NotFound` | 404 页面 |

### 2.2 全局布局

```
App (393px 居中容器)
├── LanguageProvider  ← 中英文切换
│   └── AuthProvider  ← 用户认证 + 商家身份
│       └── AddressProvider  ← 地址管理
│           └── CartProvider  ← 购物车状态
│               └── BrowserRouter
│                   └── Routes
```

### 2.3 核心组件清单

| 组件 | 用途 |
|------|------|
| `Header` | 全局顶栏，品牌标识 + 语言切换 |
| `BottomNav` | 底部导航栏（首页/订单/我的） |
| `BrandBanner` | 品牌展示横幅 |
| `ProductTile` | 商品卡片（双栏瀑布流） |
| `MiniCartBar` | 底部悬浮购物车栏 |
| `PhoneAuthModal` | 三步式登录弹窗 |
| `OrderCard` | 订单卡片（支持多种操作） |
| `RatingModal` | 评分弹窗 |
| `KakaBeanCelebration` | 豆子奖励庆祝动画 |
| `CheckoutModal` | 快速结算弹窗 |
| `FloatingCart` | 悬浮购物车（备用方案） |
| `CouponCard` / `CouponFlags` | 优惠券展示组件 |
| `AddressForm` / `AddressPicker` | 地址表单/选择器 |
| `InvoiceForm` / `InvoiceRequestModal` | 发票相关 |
| `ServiceStatusBadge` | 服务可达状态 |
| `MultiDimensionRatingModal` | 多维度评分弹窗 |

---

## 3. 核心业务逻辑 (Business Logic)

### 3.1 认证登录流程

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  隐私协议    │ →  │  选择方式     │ →  │  手机验证     │ →  │  登录成功    │
│  Privacy     │    │  WeChat/SMS  │    │  6位OTP      │    │  Profile刷新 │
└─────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

**技术细节**:
- 手机号映射为 Supabase 邮箱：`{phone}@kakago.app`
- 配置 `auto_confirm_email: true`（模拟无感登录）
- OTP 固定为 6 位数字（当前模拟验证）
- 登录成功后自动创建/更新 `profiles` 表记录
- `AuthContext` 管理全局 user/session/profile/merchantInfo 状态

### 3.2 商品浏览与加购

**产品数据结构**:
```typescript
interface ProductTileData {
  id: string;           // 唯一标识如 "hot-americano"
  nameZh: string;       // 中文名
  nameEn: string;       // 英文名
  price: number;        // 原价（元）
  image: string;        // 产品图 URL
  icon: LucideIcon;     // 分类图标
  tagZh/tagEn: string;  // 风味描述
  specZh/specEn: string; // 规格（容量/温度/烘焙度）
  specTags?: SpecTag[]; // 创意系列的特殊规格标签
  isCreative?: boolean; // 是否为先锋实验系列
}
```

**当前产品目录**（硬编码前端）:

| ID | 中文名 | 价格 | 系列 |
|----|--------|------|------|
| hot-americano | 热美式 | ¥12 | 意式基石 |
| iced-americano | 冰美式 | ¥12 | 意式基石 |
| hot-latte | 热拿铁 | ¥15 | 意式基石 |
| iced-latte | 冰拿铁 | ¥15 | 意式基石 |
| cappuccino | 卡布奇诺 | ¥15 | 意式基石 |
| flat-white | 澳白 | ¥15 | 意式基石 |
| palo-santo-latte | 圣木拿铁 | ¥22 | 先锋实验 |
| koji-latte | 米曲鲜咖 | ¥20 | 先锋实验 |
| rock-salt-fermented | 岩盐酵咖 | ¥20 | 先锋实验 |
| glass-latte | 玻璃拿铁 | ¥22 | 先锋实验 |

### 3.3 优惠券匹配逻辑

```typescript
// 当前硬编码的优惠券
const userCoupons = [
  { id: "c1", type: "universal", value: 3 },                    // 通用 ¥3
  { id: "c2", type: "latte", value: 2, applicableProducts: [...] }, // 拿铁专用 ¥2
  { id: "c3", type: "americano", value: 2, applicableProducts: [...] }, // 美式专用 ¥2
];

// 匹配规则：取所有适用券中最大面额
getBestCouponDiscount(productId) → max(applicable.value)

// 到手价 = max(0, 原价 - 最优券面额) + 配送费(¥2)
getEstimatedPrice(price, id) → Math.max(0, price - discount) + 2
```

### 3.4 购物车数据流

```
CartContext (React Context)
├── items: CartItem[]      ← 商品列表
├── addItem(product)       ← 加购（已存在则 qty+1，最大99）
├── removeItem(id)         ← 移除
├── updateQuantity(id, n)  ← 修改数量（≤0 则删除）
├── clearCart()             ← 清空
├── totalItems              ← 总数量
└── totalPrice              ← 总金额
```

**CartItem 结构**:
```typescript
interface CartItem {
  id: string;
  nameZh: string;
  nameEn: string;
  price: number;
  image: string;
  quantity: number;  // 1-99
}
```

### 3.5 下单支付完整流程

```
首页加购 → MiniCartBar → /checkout
                              │
                    ┌─────────┴─────────┐
                    │  确认订单页         │
                    │  ├ 选择地址         │
                    │  ├ ETA 预估(模拟)   │
                    │  ├ 商品规格确认     │
                    │  ├ KAKA 豆抵扣      │
                    │  ├ 价格明细         │
                    │  └ 订单备注(200字)  │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │  收银台 /payment    │
                    │  ├ 5分钟倒计时     │
                    │  ├ 微信/支付宝选择  │
                    │  └ 确认支付按钮     │
                    └─────────┬─────────┘
                              │
                   ┌──────────┼──────────┐
                   ▼                     ▼
            支付成功                支付失败
            ├ 写入 orders 表       ├ 显示错误
            ├ 清空购物车           └ 可重试/换方式
            ├ 显示订单号
            ├ 2s 倒计时
            └ 自动跳转 /order-tracking
```

**价格计算公式**:
```
商品金额 = Σ(item.price × item.quantity)
优惠券    = max(applicable_coupons.value) → 固定 ¥3
配送费    = ¥2 (固定)
KAKA 豆抵扣 = beansToUse / 100  (100豆 = ¥1)
实付金额  = max(0, 商品金额 - 优惠券 + 配送费 - KAKA豆抵扣)
```

### 3.6 订单生命周期

```
pending ──→ accepted ──→ rider_assigned ──→ picked_up ──→ delivered ──→ rated
  0%          35%           50%              70%           100%
  │                                                         │
  └── cancelled (可从 pending 状态取消)                      └── 30分钟后自动归档
```

**状态显示映射**:
| DB Status | 显示状态 | 中文 | 英文 |
|-----------|---------|------|------|
| pending | pending | 待接单 | Pending |
| accepted | preparing | 制作中 | Brewing |
| rider_assigned | delivering | 配送中 | On Way |
| picked_up | delivering | 配送中 | On Way |
| delivered | delivered | 已送达 | Done |
| delivered (>30min) | completed | 已完成 | Completed |
| rated | completed | 已完成 | Completed |
| cancelled | completed | 已取消 | Cancelled |

### 3.7 订单追踪页状态机

| 状态 | UI 展示 |
|------|---------|
| `pending` | 宇宙雷达扫描 Canvas 动画 + 合肥独立咖啡品牌匹配 |
| `accepted` | 门店揭示卡片 + 咖啡制作参数（设备/豆种/SCA风味） |
| `rider_assigned` / `picked_up` | 配送地图（SVG骑手路线） + 骑手信息 + 导航/拨号操作 |
| `delivered` | 签收确认 + 三维评分入口 |
| `rating` | 口味/包装/时效 星级评分 + 文字评论 + 提交 |

### 3.8 评价与评分逻辑

```typescript
submitOrderRating(orderId, tasteRating, packagingRating, timelinessRating, comment?)
  → INSERT order_ratings
  → UPDATE orders.status = 'rated'
  → 前端触发 KAKA 豆随机奖励 (1-10 豆) + 庆祝动画
```

### 3.9 地址管理

- **存储**: 前端 `AddressContext`（当前为本地状态，未持久化到数据库）
- **数据结构**: 含中英文、经纬度、标签、默认标记
- **操作**: CRUD + 设为默认
- **与 Checkout 联动**: 选地址后触发 ETA 重新计算

### 3.10 服务可达性检测

```sql
-- PostGIS 函数：检测用户坐标 5km 半径内是否有在线门店
check_service_availability(user_lat, user_lng, radius_meters DEFAULT 5000)
  → { is_available, nearby_merchant_count, nearest_distance_meters, nearest_merchant_id, nearest_merchant_name }
```

---

## 4. 数据模型 (Data Schema)

### 4.1 核心实体关系图

```
auth.users (Supabase 管理)
    │
    ├──1:1──→ profiles (用户画像)
    │
    ├──1:N──→ orders (订单)
    │              │
    │              ├──1:1──→ order_ratings (评分)
    │              └──1:N──→ order_status_history (状态历史)
    │
    └──1:N──→ merchant_staff (商家员工关联)
                   │
                   └──N:1──→ merchants (门店)
                                  │
                                  └──1:1──→ merchant_rating_stats (评分统计)

merchant_applications (入驻申请，独立表)
```

### 4.2 表结构详情

#### `profiles` - 用户画像
| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | uuid | ✅ | gen_random_uuid() | 主键 |
| user_id | uuid | ✅ | - | 关联 auth.users |
| display_name | text | ❌ | NULL | 显示名称 |
| avatar_url | text | ❌ | NULL | 头像 URL |
| phone | text | ❌ | NULL | 手机号 |
| is_merchant | boolean | ✅ | false | 是否为商家 |
| created_at | timestamptz | ✅ | now() | - |
| updated_at | timestamptz | ✅ | now() | - |

**RLS**: 用户可查看所有 profile，可增/改自己的 profile，不可删除。

#### `merchants` - 门店
| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | uuid | ✅ | gen_random_uuid() | 主键 |
| user_id | uuid | ❌ | NULL | 店主 auth.users ID |
| name | text | ✅ | - | 中文店名 |
| name_en | text | ❌ | NULL | 英文店名 |
| address | text | ✅ | - | 中文地址 |
| address_en | text | ❌ | NULL | 英文地址 |
| phone | text | ❌ | NULL | 联系电话 |
| description | text | ❌ | NULL | 门店简介 |
| description_en | text | ❌ | NULL | 英文简介 |
| greeting_message | text | ❌ | NULL | 店家寄语 |
| logo_url | text | ❌ | NULL | Logo |
| latitude | float8 | ✅ | - | 纬度 |
| longitude | float8 | ✅ | - | 经度 |
| location | geography | ✅ | - | PostGIS 地理点 |
| is_online | boolean | ✅ | false | 是否营业 |
| business_hours | jsonb | ❌ | NULL | `{"open":"09:00","close":"22:00"}` |
| rating | numeric | ❌ | 5.0 | 综合评分 |
| created_at | timestamptz | ✅ | now() | - |
| updated_at | timestamptz | ✅ | now() | - |

**RLS**: 公开可读，店主可更新自己的门店。

#### `orders` - 订单
| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | uuid | ✅ | gen_random_uuid() | 主键 |
| user_id | uuid | ✅ | - | 下单用户 |
| merchant_id | uuid | ✅ | - | FK → merchants |
| product_name | text | ✅ | - | 商品名（逗号分隔多商品） |
| product_image | text | ❌ | NULL | 首商品图 |
| price | numeric | ✅ | - | 单价 |
| quantity | int | ✅ | 1 | 数量 |
| total_amount | numeric | ✅ | - | 实付总额 |
| status | order_status | ✅ | 'pending' | 订单状态 |
| delivery_address | text | ✅ | - | 配送地址 |
| delivery_contact_name | text | ✅ | - | 收货人 |
| delivery_contact_phone | text | ✅ | - | 收货电话 |
| delivery_lat/lng | float8 | ❌ | NULL | 配送坐标 |
| rider_name/phone/avatar | text | ❌ | NULL | 骑手信息 |
| rider_lat/lng | float8 | ❌ | NULL | 骑手实时坐标 |
| delivery_platform | text | ❌ | NULL | 配送平台（如 UU跑腿） |
| delivery_order_id | text | ❌ | NULL | 第三方配送单号 |
| accepted_at | timestamptz | ❌ | NULL | 接单时间 |
| rider_assigned_at | timestamptz | ❌ | NULL | 骑手指派时间 |
| picked_up_at | timestamptz | ❌ | NULL | 取货时间 |
| delivered_at | timestamptz | ❌ | NULL | 送达时间 |
| created_at | timestamptz | ✅ | now() | - |
| updated_at | timestamptz | ✅ | now() | - |

**RLS**: 用户可创建/查看自己的订单，商家可查看/更新关联订单，不可删除。

**状态枚举** `order_status`:
```
pending | accepted | rider_assigned | picked_up | delivered | rated | cancelled
```

#### `order_ratings` - 订单评分
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | uuid | ✅ | 主键 |
| order_id | uuid | ✅ | FK → orders (1:1 唯一) |
| user_id | uuid | ✅ | 评价人 |
| merchant_id | uuid | ✅ | FK → merchants |
| taste_rating | int | ✅ | 口味评分 1-5 |
| packaging_rating | int | ✅ | 包装评分 1-5 |
| timeliness_rating | int | ✅ | 时效评分 1-5 |
| overall_rating | numeric | ❌ | 综合评分（自动计算） |
| comment | text | ❌ | 文字评论 |
| created_at | timestamptz | ✅ | - |

#### `order_status_history` - 状态变更记录
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | uuid | ✅ | 主键 |
| order_id | uuid | ✅ | FK → orders |
| status | order_status | ✅ | 变更后状态 |
| message | text | ❌ | 变更备注 |
| created_at | timestamptz | ✅ | - |

#### `merchant_staff` - 商家员工
| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| id | uuid | ✅ | gen_random_uuid() | 主键 |
| user_id | uuid | ✅ | - | 员工用户 ID |
| merchant_id | uuid | ✅ | - | FK → merchants |
| role | merchant_role | ✅ | 'staff' | owner/manager/staff |
| is_active | boolean | ✅ | true | 是否激活 |

**角色枚举** `merchant_role`: `owner | manager | staff`

#### `merchant_applications` - 入驻申请
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | uuid | ✅ | 主键 |
| owner_name | text | ✅ | 负责人姓名 |
| phone | text | ✅ | 联系电话 |
| store_name/store_name_en | text | ❌ | 店名 |
| store_address | text | ❌ | 地址 |
| store_description | text | ❌ | 简介 |
| greeting_message | text | ❌ | 寄语 |
| store_features | text | ✅ | 门店特色 |
| coffee_machine_model | text | ✅ | 咖啡机型号 |
| grinder_model | text | ❌ | 磨豆机型号 |
| daily_peak_cups | int | ✅ | 日峰值杯数 |
| business_hours | jsonb | ✅ | 营业时间 |
| business_license_url | text | ✅ | 营业执照 URL |
| food_permit_url | text | ✅ | 食品许可证 URL |
| storefront_photo_url | text | ❌ | 门面照 |
| logo_url | text | ❌ | Logo |
| latitude/longitude | float8 | ❌ | 坐标 |
| status | merchant_application_status | ✅ | pending/approved/rejected |
| reviewer_notes | text | ❌ | 审核备注 |
| reviewed_at | timestamptz | ❌ | 审核时间 |

#### `merchant_rating_stats` - 商家评分统计
| 字段 | 类型 | 说明 |
|------|------|------|
| merchant_id | uuid | PK, FK → merchants |
| total_orders | int | 总订单数 |
| total_ratings | int | 总评价数 |
| avg_taste_rating | numeric | 平均口味分 |
| avg_packaging_rating | numeric | 平均包装分 |
| avg_timeliness_rating | numeric | 平均时效分 |
| avg_overall_rating | numeric | 综合平均分 |
| dispatch_score | numeric | 调度得分 |

### 4.3 数据库函数

| 函数名 | 参数 | 返回 | 说明 |
|--------|------|------|------|
| `check_service_availability` | user_lat, user_lng, radius_meters | 服务可达信息 | PostGIS 就近门店查询 |
| `get_user_merchant` | (无，使用 auth.uid()) | 商家身份信息 | 当前用户的商家角色 |
| `get_my_merchant` | (无) | 商家详情 | 商家自己的门店信息 |
| `toggle_my_merchant_status` | new_status | 操作结果 | 切换营业状态 |
| `update_merchant_status` | merchant_id, new_status | boolean | 更新门店状态 |
| `register_merchant` | p_name, p_address, p_lat, p_lng, ... | JSON | 注册新商家 |

---

## 5. 外部接口定义 (API Requirements)

### 5.1 Supabase Edge Functions（已实现）

| 函数路径 | JWT验证 | 方法 | 说明 |
|----------|---------|------|------|
| `/functions/v1/check-service` | ❌ | POST | 服务可达性检测 |
| `/functions/v1/merchant-status` | ❌ | POST | 商家状态管理 |
| `/functions/v1/order-management` | ❌ | POST | 订单状态更新（B端调用） |

### 5.2 前端直调 Supabase SDK

| 操作 | 表/RPC | 方法 | 调用场景 |
|------|--------|------|---------|
| 登录 | `auth.signInWithPassword` | POST | PhoneAuthModal |
| 注册 | `auth.signUp` | POST | PhoneAuthModal |
| 创建订单 | `orders.insert` | POST | Payment 成功后 |
| 查询订单列表 | `orders.select` (join merchants, ratings) | GET | Orders 页 |
| 查询单个订单 | `orders.select` (join all) | GET | OrderTracking 页 |
| 取消订单 | `orders.update({status:'cancelled'})` | PATCH | Orders 页 |
| 提交评分 | `order_ratings.insert` + `orders.update` | POST+PATCH | OrderTracking |
| 查询 Profile | `profiles.select` | GET | AuthContext |
| 查询商家信息 | `rpc('get_user_merchant')` | POST | AuthContext |
| 商家入驻申请 | `merchant_applications.insert` | POST | MerchantAuth |
| 切换营业状态 | `rpc('toggle_my_merchant_status')` | POST | MerchantDashboard |
| 实时订阅 | `channel.on('postgres_changes')` | WS | Orders 页 |

### 5.3 待接入的外部接口（TODO）

| 接口 | 用途 | 调用时机 | 建议实现方式 |
|------|------|---------|-------------|
| **UU跑腿 / 顺丰同城** | 配送下单 + ETA 查询 + 骑手位置 | 订单 accepted 后 | Edge Function 代理 |
| **微信支付 JSAPI** | 真实支付 | /payment 确认支付 | Edge Function 签名 |
| **支付宝 H5** | 真实支付 | /payment 确认支付 | Edge Function 签名 |
| **高德/腾讯地图** | 地址搜索 + 逆地理编码 | 地址管理 | 前端 SDK |
| **短信网关（阿里云/腾讯云）** | 真实 OTP 发送 | 登录页 | Edge Function |
| **微信开放平台** | 微信授权登录 | 小程序/公众号 | 服务端接口 |
| **发票服务（航信/百望）** | 电子发票开具 | 发票申请 | Edge Function |

---

## 6. 小程序兼容性建议

### 6.1 需要原生适配的功能

| 功能 | Web 方案 | 小程序适配 | 优先级 |
|------|----------|-----------|--------|
| **登录认证** | Supabase Email/Password 模拟 | `wx.login()` + 后端 `code2session` 获取 openid | 🔴 P0 |
| **支付** | 模拟 + 前端状态机 | `wx.requestPayment()` 调用微信支付 JSAPI | 🔴 P0 |
| **地理定位** | `navigator.geolocation` | `wx.getLocation()` + 需申请权限 | 🔴 P0 |
| **地址选择** | 自建地址管理 | 可保留自建 或 使用 `wx.chooseAddress()` | 🟡 P1 |
| **分享** | 邀请海报图片 | `wx.onShareAppMessage()` + 转发卡片 | 🟡 P1 |
| **手机号获取** | 手动输入 | `<button open-type="getPhoneNumber">` 一键获取 | 🟡 P1 |
| **扫码** | 无 | `wx.scanCode()` 扫描店铺二维码 | 🟢 P2 |
| **推送通知** | 无 | 订阅消息模板（订单状态变更） | 🟡 P1 |
| **Canvas 动画** | HTML5 Canvas（宇宙雷达） | 小程序 Canvas 2D API（语法差异较大） | 🟢 P2 |
| **路由** | React Router (BrowserRouter) | 小程序 `wx.navigateTo` / `wx.switchTab` | 🔴 P0 |
| **状态管理** | React Context | 小程序全局状态 (getApp / mobx-miniprogram) | 🔴 P0 |
| **国际化** | LanguageContext 运行时切换 | 自建 i18n 工具函数（逻辑可复用） | 🟢 P2 |
| **实时订阅** | Supabase Realtime (WebSocket) | 小程序 WebSocket 或 轮询 | 🟡 P1 |

### 6.2 架构建议

#### 6.2.1 数据层复用
- **后端完全共用**：三端（C/B/Admin）共享同一个 Supabase 项目和数据库
- 小程序直接通过 HTTP 调用 Supabase REST API 或 Edge Functions
- 推荐使用 [supabase-wechat-miniapp](https://github.com/nichenqin/supabase-wechat-miniapp) SDK

#### 6.2.2 认证流差异
```
Web 端:  手机号 → email映射 → Supabase Auth signUp/signIn
小程序:  wx.login() → code → Edge Function → code2session → 
         获取 openid → Supabase Auth (custom token / admin API)
```

#### 6.2.3 支付流差异
```
Web 端:  模拟支付 → 前端写入 orders 表
小程序:  Checkout → Edge Function 创建预付订单 → 
         wx.requestPayment() → 微信回调 Edge Function → 
         写入 orders 表 + 更新状态
```

#### 6.2.4 需要 Edge Function 新增的接口

| 接口 | 用途 |
|------|------|
| `POST /wechat-login` | 接收 wx code，换取 session_key，返回自定义 token |
| `POST /create-payment` | 创建微信支付预付单，返回支付参数 |
| `POST /payment-callback` | 微信支付回调通知，更新订单状态 |
| `POST /get-phone-number` | 解密微信手机号 |
| `POST /subscribe-message` | 发送订阅消息通知 |

### 6.3 UI/UX 差异注意

| 项目 | Web 现状 | 小程序建议 |
|------|----------|-----------|
| 固定宽度 393px | `div.w-[393px]` 居中 | 小程序自适应 `rpx` 单位 |
| glass 毛玻璃效果 | `backdrop-filter: blur()` | 部分低端安卓不支持，需降级方案 |
| Sonner Toast | 第三方库 | `wx.showToast()` |
| framer-motion 动画 | CSS + framer-motion | 小程序 animation API 或 CSS transition |
| Lucide 图标 | React 组件 | 替换为小程序 icon 组件或 iconfont |
| Sheet/Drawer | Radix UI | 小程序 popup 组件 |

### 6.4 文件/资源处理
- 商家入驻的证照上传：Web 用 `<input type="file">`，小程序用 `wx.chooseImage()` + `wx.uploadFile()`
- 产品图片：建议统一使用 CDN URL，两端共用

---

## 附录 A：环境变量

| 变量 | 用途 | 存储位置 |
|------|------|---------|
| `VITE_SUPABASE_URL` | Supabase API 地址 | .env (自动生成) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | .env (自动生成) |
| `VITE_SUPABASE_PROJECT_ID` | 项目 ID | .env (自动生成) |

## 附录 B：技术栈版本

| 技术 | 用途 |
|------|------|
| React 18 | UI 框架 |
| TypeScript | 类型安全 |
| Vite | 构建工具 |
| Tailwind CSS 4 | 样式系统 |
| shadcn/ui | UI 组件库 |
| @tanstack/react-query | 数据获取 |
| react-router-dom | 路由 |
| lucide-react | 图标 |
| sonner | Toast 通知 |
| Supabase JS SDK | 后端交互 |
| PostGIS | 地理空间查询 |

---

> **文档用途**: 本文档供小程序原生开发工程师参考，涵盖 C 端所有已实现功能的业务逻辑、数据结构和接口需求。B 端和 Admin 端为独立 Lovable 项目，需另行整理。
