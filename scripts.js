document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('dataChart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Data Points',
                data: [],
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

fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        myChart.data.labels = data.map(item => new Date(item[3]).toLocaleString());
        myChart.data.datasets[0].data = data.map(item => parseFloat(item[2]));
        myChart.update();
    });

document.getElementById('data-filter')
    .addEventListener('change', function() {
        fetch('/api/data')
            .then(response => response.json())
            .then(data => {
                let filter = this.value;
                let filteredData = data;
                if (filter === 'last-week') {
                    filteredData = data.filter(item => new Date(item[3]) > new Date(Date.now() - 7*24*60*60*1000));
                } else if (filter === 'last-month') {
                    filteredData = data.filter(item => new Date(item[3]) > new Date(Date.now() - 30*24*60*60*1000));
                }
                // Update chart with filtered data
                myChart.data.labels = filteredData.map(item => new Date(item[3]).toLocaleString());
                myChart.data.datasets[0].data = filteredData.map(item => parseFloat(item[2]));
                myChart.update();
            });
    });
});

setInterval(function() {
    fetch('/api/data')
        .then(response => response.json())
        .then(newData => { 
            // Update chart with new data
            myChart.data.labels = newData.map(item => item.timestamp); 
            myChart.data.datasets[0].data = newData.map(item => item.value);
            myChart.update();
        }); 
}, 60000); // Fetch new data every 60 seconds