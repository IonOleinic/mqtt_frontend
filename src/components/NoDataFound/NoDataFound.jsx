import NoDataFoundIcon from './NoDataFoundIcons/NoDataFoundIcon'

const NoDataFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <NoDataFoundIcon size={150} color='#ccc' />
      <p style={{ fontSize: 20, color: '#ccc', fontWeight: '600' }}>
        No Data Found
      </p>
    </div>
  )
}

export default NoDataFound
