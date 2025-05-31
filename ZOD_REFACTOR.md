# Zod 重构说明

## 重构目标
使用 Zod 添加类型安全的数据验证，让代码更加简洁和安全。

## 新增依赖
```bash
pnpm add zod react-hook-form @hookform/resolvers
```

## 重构内容

### 1. 创建 Zod Schema (`lib/schemas/store.ts`)

#### 定义的 Schema:
- `storeSchema`: 基础店面数据结构
- `createStoreSchema`: 创建店面时的数据结构
- `updateStoreSchema`: 更新店面时的数据结构 
- `storeFormSchema`: 表单数据的结构（字符串类型）

#### 类型推断:
```typescript
export type Store = z.infer<typeof storeSchema>
export type CreateStoreInput = z.infer<typeof createStoreSchema>
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>
export type StoreFormData = z.infer<typeof storeFormSchema>
```

#### 验证规则:
- **店面名称**: 必填，1-100字符
- **地址**: 必填，1-200字符
- **城市**: 必填，1-50字符
- **电话**: 必填，符合电话号码格式
- **邮箱**: 可选，有效邮箱格式
- **图片URL**: 可选，有效URL格式
- **纬度**: -90到90之间
- **经度**: -180到180之间
- **营业时间**: 有效JSON格式

### 2. Server Actions 重构 (`app/admin/stores/actions.ts`)

#### 改进:
- 使用 `storeFormSchema.parse()` 进行服务端验证
- 统一的数据提取和验证流程
- 更好的错误信息处理
- 类型安全的数据转换

#### 验证流程:
```typescript
const rawData = extractFormData(formData)
const validatedData = storeFormSchema.parse(rawData)
const storeData = transformFormDataToStore(validatedData)
```

### 3. 表单组件重构 (`components/admin/StoreForm.tsx`)

#### 新特性:
- **React Hook Form**: 更好的表单状态管理
- **客户端验证**: 实时验证反馈
- **错误显示**: 每个字段的错误信息
- **类型安全**: 完整的 TypeScript 支持

#### 验证配置:
```typescript
const form = useForm<StoreFormData>({
  resolver: zodResolver(storeFormSchema.extend({
    // 自定义验证规则
    openingHours: storeFormSchema.shape.openingHours.refine(
      (value) => !value || validateJsonString(value),
      { message: '营业时间必须是有效的JSON格式' }
    ),
    // ... 其他自定义规则
  })),
  defaultValues,
  mode: 'onChange', // 实时验证
})
```

#### UI 改进:
- 错误状态高亮（红色边框）
- 实时错误信息显示
- 图片预览功能
- 表单重置功能

### 4. 新增功能

#### 实时图片预览:
```typescript
{(store?.image || watch('image')) && (
  <img
    src={store?.image || watch('image') || ''}
    alt={store?.name || watch('name') || '店面图片'}
    className="w-full h-64 object-cover rounded-lg border"
    onError={(e) => {
      e.currentTarget.style.display = 'none'
    }}
  />
)}
```

#### 智能表单重置:
```typescript
const toggleEditMode = () => {
  setIsEditing(!isEditing)
  if (!isEditing) {
    reset(defaultValues) // 重置到原始值
  }
}
```

#### 详细错误信息:
```typescript
{errors.name && (
  <p className="text-sm text-red-600">{errors.name.message}</p>
)}
```

## 优势

### 1. 类型安全
- 编译时类型检查
- 自动类型推断
- 减少运行时错误

### 2. 数据验证
- 客户端实时验证
- 服务端安全验证
- 统一的验证规则

### 3. 用户体验
- 实时错误反馈
- 清晰的错误信息
- 智能表单重置

### 4. 代码简洁
- 去除重复的验证逻辑
- 统一的数据结构定义
- 自动化的类型转换

### 5. 维护性
- 集中的 Schema 定义
- 一处修改，处处生效
- 更容易扩展新字段

## 使用示例

### 添加新的验证规则:
```typescript
// 在 store.ts 中添加新规则
export const storeFormSchema = z.object({
  // ... 现有字段
  newField: z.string().min(1, '新字段不能为空').max(50, '不能超过50字符'),
})
```

### 自定义验证:
```typescript
const customSchema = storeFormSchema.extend({
  customField: z.string().refine(
    (value) => customValidationLogic(value),
    { message: '自定义错误信息' }
  ),
})
```

## 注意事项

1. **Prisma 兼容性**: `openingHours` 字段使用 `z.any()` 以兼容 Prisma JSON 类型
2. **表单数据转换**: FormData 只包含字符串，需要转换为正确的数据类型
3. **错误处理**: 客户端和服务端都需要处理验证错误
4. **性能**: `mode: 'onChange'` 会在每次输入时验证，可根据需要调整

## 下一步建议

1. 为其他模块（如车辆、订单）添加 Zod Schema
2. 创建通用的表单组件
3. 添加更复杂的业务规则验证
4. 集成国际化的错误信息 