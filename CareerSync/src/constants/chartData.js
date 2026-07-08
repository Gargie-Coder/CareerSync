
const chartData = () => {
  const applications=useApplications();
   STATUS_LABELS.map((statuses)=>{
    const count= applications.filter((app)=>
      statuses===app.status).length//this will return the small array after filter and using its length property we will extract the matching applications count for each status and return an array of objects with status and count properties.
    return { status: status, count: count}
   })
}

export default chartData