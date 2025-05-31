# ImageUpload 组件

一个通用的图像上传组件，支持拖拽上传、预览、文件验证等功能。

## 功能特性

- ✅ 支持点击上传和拖拽上传
- ✅ 图片预览功能
- ✅ 文件类型验证（JPEG, PNG, GIF, WEBP）
- ✅ 文件大小限制
- ✅ 加载状态显示
- ✅ 错误处理和提示
- ✅ 可自定义样式
- ✅ 使用 Vercel Blob 存储

## 使用方法

### 基本用法

```tsx
import { ImageUpload } from '@/components/ui/image-upload'
import { useState } from 'react'

function MyForm() {
  const [imageUrl, setImageUrl] = useState('')

  return (
    <div>
      <label>上传图片</label>
      <ImageUpload
        value={imageUrl}
        onChange={setImageUrl}
      />
    </div>
  )
}
```

### 与 react-hook-form 集成

```tsx
import { useForm } from 'react-hook-form'
import { ImageUpload } from '@/components/ui/image-upload'

function FormWithImage() {
  const { watch, setValue } = useForm()

  return (
    <ImageUpload
      value={watch('image')}
      onChange={(url) => setValue('image', url)}
    />
  )
}
```

### 自定义配置

```tsx
<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  maxSize={10} // 10MB 大小限制
  placeholder="拖拽或点击上传产品图片"
  disabled={isLoading}
  className="my-custom-class"
  onRemove={() => console.log('图片已删除')}
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | - | 当前图片URL |
| `onChange` | `(url: string) => void` | - | 图片URL变化回调 |
| `onRemove` | `() => void` | - | 删除图片回调 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `className` | `string` | - | 自定义CSS类名 |
| `placeholder` | `string` | "点击上传图片..." | 占位符文本 |
| `maxSize` | `number` | `5` | 最大文件大小（MB） |

## 支持的文件格式

- JPEG (.jpg, .jpeg)
- PNG (.png)  
- GIF (.gif)
- WebP (.webp)

## 文件大小限制

默认最大文件大小为 5MB，可通过 `maxSize` 属性自定义。

## 样式自定义

组件使用 Tailwind CSS 构建，可通过 `className` 属性添加自定义样式：

```tsx
<ImageUpload
  className="max-w-md mx-auto"
  // ... 其他属性
/>
```

## 错误处理

组件会自动处理以下错误情况：
- 不支持的文件类型
- 文件大小超出限制
- 网络上传失败
- 图片加载失败

所有错误都会显示在组件下方的红色文本中。 