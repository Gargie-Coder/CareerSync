const chartData = STATUS_LABELS.map((status) => {
  count=applications.filter((app) => app.status === status).length;
  return { status, count };
});