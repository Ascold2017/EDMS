const toDateString = (date) => {
  const stringDate = new Date(date)
  const resultString = `${stringDate.getDate() < 10 ? '0' + stringDate.getDate() : stringDate.getDate()}.${stringDate.getMonth() + 1 < 10 ? '0' + (stringDate.getMonth() + 1) : stringDate.getMonth() + 1}.${stringDate.getFullYear()} - ${stringDate.getHours() < 10 ? '0' + stringDate.getHours() : stringDate.getHours()}:${stringDate.getMinutes() < 10 ? '0' + stringDate.getMinutes() : stringDate.getMinutes()}`
  return resultString
}
export default toDateString
