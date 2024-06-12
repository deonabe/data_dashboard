document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('dataChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => new Date(item[3]).toLocaleString()),
                    datasets: [{
                        label: 'Data Points',
                        data: data.map(item => parseFloat(item[2])),
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        tooltip: {
                            enabled: true,
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `Value: ${tooltipItem.parsed.y}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
           
        });
});

document.getElementById('data-filter')
	                .addEventListener('change', function() {
                        fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            let filter = this.value;
            let filteredData = data;
            if (filter === 'last-week') {
                filteredData = data.filter(item => new Date(item.timestamp) > new Date(Date.now() - 7*24*60*60*1000));
            } else if (filter === 'last-month') {
                filteredData = data.filter(item => new Date(item.timestamp) > new Date(Date.now() - 30*24*60*60*1000)); 
            }
            // Update chart with filtered data
            myChart.data.labels = filteredData.map(item => item.timestamp);
            myChart.data.datasets[0].data = filteredData.map(item => item.value);
            myChart.update(); 

        })
});