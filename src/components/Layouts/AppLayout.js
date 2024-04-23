import { Outlet } from 'react-router-dom'
import { ConfirmDialog } from 'primereact/confirmdialog'
function AppLayout() {
  return (
    <main className='page-container'>
      <ConfirmDialog />
      <Outlet />
    </main>
  )
}

export default AppLayout
