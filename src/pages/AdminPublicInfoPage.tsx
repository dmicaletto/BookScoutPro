import { useAdminPublicInfo } from '../hooks/useAdminPublicInfo'
import AdminPublicInfoList from '../features/public-info/AdminPublicInfoList'

const AdminPublicInfoPage = () => {
  const { items, loading, addItem, updateItem, deleteItem } = useAdminPublicInfo()

  return (
    <AdminPublicInfoList
      items={items}
      loading={loading}
      onAdd={addItem}
      onUpdate={updateItem}
      onDelete={deleteItem}
    />
  )
}

export default AdminPublicInfoPage
