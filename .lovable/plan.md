

# WeChat 风格自动授权登录

## 概述
模拟微信小程序的"一键授权登录"体验。未登录时，个人页显示授权登录卡片；点击后弹出微信风格的授权弹窗，用户确认后自动完成登录。实际使用邮箱+密码认证，但 UI 完全模拟微信授权流程。

## 用户体验流程

**未登录状态（个人页）：**
- 头像区域显示灰色默认头像 + "点击登录"
- 资产栏（优惠券、KAKA豆）显示为"--"
- 点击头像区域触发登录流程

**登录流程：**
1. 弹出微信风格授权弹窗（深色毛玻璃底板）
2. 显示 KAKAGO logo + "申请获取以下权限"
3. 列出：头像、昵称、手机号
4. 底部两个按钮："拒绝" / "允许"（紫色）
5. 点击"允许"后，显示加载动画 "授权中..."
6. 自动用预设邮箱注册/登录，完成后刷新页面

**已登录状态：**
- 显示用户昵称（从 profiles 表读取，默认生成微信风格随机名）
- 显示真实资产数据
- 菜单底部增加"退出登录"选项

## 技术实现

### 1. 新建组件：WeChatAuthModal
- 路径：`src/components/WeChatAuthModal.tsx`
- 微信授权弹窗 UI，包含 logo、权限列表、允许/拒绝按钮
- 点击"允许"调用 `supabase.auth.signUp` 或 `supabase.auth.signInWithPassword`
- 使用自动确认邮箱（需启用 auto-confirm）

### 2. 修改 Profile 页面
- 引入 `useAuth()` 获取登录状态
- 未登录：显示登录引导卡片，点击打开 WeChatAuthModal
- 已登录：显示真实用户信息 + 退出登录按钮
- 退出登录调用 `signOut()`

### 3. 数据库配置
- 启用邮箱自动确认（auto-confirm），跳过邮箱验证
- 利用已有 profiles 表存储 display_name、avatar_url
- 注册成功后自动创建 profile 记录，生成微信风格随机昵称（如"微信用户_X7kP2"）

### 4. 修改 AuthContext
- 新增 `signIn` 和 `signUp` 方法暴露给组件使用
- 登录成功后自动拉取/创建 profile 数据

### 涉及文件
- 新建 `src/components/WeChatAuthModal.tsx`
- 修改 `src/pages/Profile.tsx`
- 修改 `src/contexts/AuthContext.tsx`
- 数据库：启用 auto-confirm email
- 数据库：添加 trigger 自动创建 profile（如尚未存在）

