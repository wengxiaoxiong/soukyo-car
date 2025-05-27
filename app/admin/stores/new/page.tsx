import { StoreForm } from '@/components/admin/StoreForm'

export default function NewStorePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">添加店面</h1>
        <p className="text-gray-600 mt-2">创建一个新的店面</p>
      </div>

      <StoreForm />
    </div>
  )
} 