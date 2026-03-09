import { useInventory } from '../hooks/useInventory'
import InventoryList from '../features/inventory/InventoryList'

const InventoryPage = () => {
  const { items, loading, deleteItem } = useInventory()

  return (
    <InventoryList items={items} loading={loading} onDelete={deleteItem} />
  )
}

export default InventoryPage
