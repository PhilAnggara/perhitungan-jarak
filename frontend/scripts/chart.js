var chartOptions = {
  chart: {
    type: 'bar',
    height: 300,
  },
  series: [{
    name: "Jarak",
    data: [0, 0, 0, 0]
  }],
  xaxis: {
    categories: ['Euclidean Distance','Spherical Law of Cosines','Spherical Law of Cosines', 'Leaflet Distance'],
    labels: {
      show: false
    }
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        val = val.toFixed(2);
        return val + " km";
      }
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 15,
      distributed: true,
    }
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    },
  },
  theme: {
    palette: 'palette3' // upto palette10
  },
  legend: {
    show: true,
    showForSingleSeries: false,
    showForNullSeries: true,
    showForZeroSeries: true,
    position: 'bottom',
    horizontalAlign: 'left', 
    floating: false,
    fontSize: '14px',
    fontFamily: 'Helvetica, Arial',
    fontWeight: 400,
    formatter: undefined,
    inverseOrder: false,
    width: undefined,
    height: undefined,
    tooltipHoverFormatter: undefined,
    customLegendItems: [],
    offsetX: 0,
    offsetY: 0,
    labels: {
        colors: undefined,
        useSeriesColors: false
    },
    markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        strokeColor: '#fff',
        fillColors: undefined,
        radius: 12,
        customHTML: undefined,
        onClick: undefined,
        offsetX: 0,
        offsetY: 0
    },
    itemMargin: {
        horizontal: 5,
        vertical: 0
    },
    onItemClick: {
        toggleDataSeries: true
    },
    onItemHover: {
        highlightDataSeries: true
    },
  }
};

var chart = new ApexCharts(document.querySelector("#chart"), chartOptions);
chart.render();