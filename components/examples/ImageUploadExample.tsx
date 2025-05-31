'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImageUpload } from '@/components/ui/image-upload'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

// 简单的状态示例
export function SimpleImageUploadExample() {
  const [imageUrl, setImageUrl] = useState('')

  return (
    <Card className="p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4">简单图片上传示例</h3>
      <div className="space-y-4">
        <div>
          <Label>上传图片</Label>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="点击或拖拽上传图片"
          />
        </div>
        
        {imageUrl && (
          <div className="p-3 bg-gray-50 rounded-md">
            <Label className="text-sm">图片URL:</Label>
            <p className="text-xs break-all mt-1">{imageUrl}</p>
          </div>
        )}
      </div>
    </Card>
  )
}

// 与表单集成的示例
interface FormData {
  title: string
  description: string
  image: string
}

export function FormImageUploadExample() {
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      image: ''
    }
  })

  const onSubmit = (data: FormData) => {
    console.log('提交的数据:', data)
    alert(`表单提交成功！\n标题: ${data.title}\n描述: ${data.description}\n图片: ${data.image}`)
  }

  return (
    <Card className="p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4">表单集成示例</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">标题</Label>
          <Input
            id="title"
            {...register('title', { required: '请输入标题' })}
            placeholder="请输入标题"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">描述</Label>
          <Input
            id="description"
            {...register('description')}
            placeholder="请输入描述"
          />
        </div>

        <div>
          <Label>封面图片</Label>
          <ImageUpload
            value={watch('image')}
            onChange={(url) => setValue('image', url)}
            placeholder="上传封面图片"
            maxSize={3}
          />
          <input type="hidden" {...register('image')} />
        </div>

        <Button type="submit" className="w-full">
          提交表单
        </Button>
      </form>
    </Card>
  )
}

// 完整的使用示例页面
export function ImageUploadExamples() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">ImageUpload 组件示例</h1>
        <p className="text-gray-600">演示不同场景下的图片上传组件使用方法</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SimpleImageUploadExample />
        <FormImageUploadExample />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">代码示例</h2>
        <Card className="p-4">
          <pre className="text-sm overflow-x-auto">
{`// 基本使用
import { ImageUpload } from '@/components/ui/image-upload'

function MyComponent() {
  const [imageUrl, setImageUrl] = useState('')
  
  return (
    <ImageUpload
      value={imageUrl}
      onChange={setImageUrl}
      placeholder="上传图片"
      maxSize={5}
    />
  )
}

// 与 react-hook-form 集成
const { watch, setValue, register } = useForm()

<ImageUpload
  value={watch('image')}
  onChange={(url) => setValue('image', url)}
/>
<input type="hidden" {...register('image')} />`}
          </pre>
        </Card>
      </div>
    </div>
  )
} 