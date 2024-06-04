const dateChange = (date:string)=>{
  const dateObject = new Date(date);
  const month = ("0" + (dateObject.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1，并且补0
  const year = dateObject.getFullYear();
  const day = ("0" + dateObject.getDate()).slice(-2); // 补0
  date = `${year}-${month}-${day}`;
  
  return date
}

export default dateChange