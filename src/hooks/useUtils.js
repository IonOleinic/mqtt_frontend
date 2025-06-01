function useUtils() {
  const getDateFromStr = (date) => {
    const addZero = (i) => {
      if (i <= 9) {
        return '0' + i
      } else {
        return i
      }
    }
    let temp_date = new Date(date)
    return (
      addZero(temp_date.getDate()) +
      '-' +
      addZero(temp_date.getMonth() + 1) +
      '-' +
      temp_date.getFullYear()
    )
  }
  return {
    getDateFromStr,
  }
}

export default useUtils
