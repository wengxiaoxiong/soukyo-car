# Store表单重构说明

## 重构目标
将店面(Store)的添加、编辑和查看功能统一到一个组件中，避免重复代码，提高代码维护性。

## 重构内容

### 1. 统一表单组件 `StoreForm`
- **位置**: `components/admin/StoreForm.tsx`
- **支持三种模式**:
  - `add`: 添加模式
  - `edit`: 编辑模式  
  - `view`: 查看模式

### 2. 组件特性

#### 添加模式 (`mode="add"`)
- 显示空表单
- 提交时调用 `createStore` action
- 页面标题: "添加店面"

#### 编辑模式 (`mode="edit"`)
- 预填充店面数据
- 提交时调用 `updateStore` action
- 显示激活状态复选框
- 页面标题: "编辑店面"

#### 查看模式 (`mode="view"`)
- 只读显示店面信息
- 支持两种子模式:
  - **只读模式**: 所有字段以只读方式显示
  - **内联编辑模式**: 点击"内联编辑"按钮后可以直接编辑
- 显示店面状态徽章
- 显示创建/更新时间
- 提供跳转到编辑页面的按钮
- 页面标题: "店面详情"

### 3. 页面更新

#### `/admin/stores/new/page.tsx`
```tsx
<StoreForm mode="add" />
```

#### `/admin/stores/[id]/edit/page.tsx`
```tsx
<StoreForm store={storeForForm} mode="edit" />
```

#### `/admin/stores/[id]/page.tsx`
```tsx
<StoreForm store={storeForForm} mode="view" />
```

### 4. UI 优化

#### 只读模式样式
- 使用 `bg-gray-50` 背景的div显示只读内容
- Google Maps链接可点击
- 营业时间使用代码格式显示JSON

#### 响应式布局
- 标题和操作按钮的响应式布局
- 表单字段的响应式网格布局

#### 交互体验
- 查看模式下可以切换只读/编辑状态
- 编辑状态下保存按钮文本动态变化
- 加载状态提示

### 5. 代码优化

#### 类型安全
- 统一的 `Store` 接口定义
- `FormMode` 类型约束模式参数
- 正确的数据类型转换

#### 逻辑复用
- 统一的表单提交处理
- 统一的状态管理
- 统一的错误处理

## 使用方式

```tsx
// 添加新店面
<StoreForm mode="add" />

// 编辑现有店面  
<StoreForm store={store} mode="edit" />

// 查看店面详情
<StoreForm store={store} mode="view" />
```

## 优势

1. **代码复用**: 三个页面共用一个表单组件
2. **一致性**: 字段定义和验证逻辑统一
3. **维护性**: 修改表单字段只需要改一个地方
4. **用户体验**: 统一的界面风格和交互方式
5. **功能完整**: 支持查看、编辑、添加的完整场景 