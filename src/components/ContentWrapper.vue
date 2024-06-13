<script setup>
import { ref, computed, provide } from 'vue';
import { StoreData } from '@/Data/StoringData';

//import table
import TableByIpk from './wrapperContent/TableByIpk.vue';
import TableByTime from './wrapperContent/TableByTime.vue';

//import chart
import ChartsByIpk from './wrapperContent/ChartsByIpk.vue';
import ChartsByTime from './wrapperContent/ChartsByTime.vue';

// Konfigurasi
const store = StoreData();
const theme = ref(store.theme);

const fak = computed(() => {
    return store.fakultas
});
provide ("fak", fak)//providing variabel

// For xaxis
const dataCountsKeys = computed(() => {
  return Object.keys(store.data);
});


// Option for Bar
//Jika f = semua
const barOptions = {
  chart: {
    foreColor: "#fff",
    fontFamily: "Roboto",
    height: 362,
    stackOnlyBar: true,
    toolbar: {
        show: false
    },
    type: "bar",
    width: 584
  },
  plotOptions: {
    bar: {
      columnWidth: "82%",
      borderRadius: 2,
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
      hideZeroBarsWhenGrouped: false,
      isDumbbell: false,
      isFunnel: false,
      isFunnel3d: true,
      dataLabels: {
        total: {
          enabled: false,
          style: {
            color: "#373d3f",
            fontSize: "12px",
            fontWeight: 600
          }
        }
      }
    },
    bubble: {
      zScaling: true
    },
    treemap: {
      borderRadius: 4,
      dataLabels: {
        format: "scale"
        }
    },
    radialBar: {
      hollow: {
        background: "#fff"
      },
      barLabels: {
        enabled: false,
        margin: 5,
        useSeriesColors: true,
        fontWeight: 600,
        fontSize: "16px"
      }
    },
  },
  legend: {
    position: 'bottom',
    fontSize: 14,
    offsetY: 0,
    markers: {
      width: 10,
      height: 11,
      strokeColor: theme.value,
      radius: 3,
      shape: "square",
      size: 8
    },
    itemMargin: {
      vertical: 0
    },
    labels:{
      colors: theme.value
    },
  },
  stroke: {
    fill: {
      type: "solid",
      opacity: 0.85,
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [
          0,
          50,
          100
        ],
      }
    }
  },
  tooltip: {
    shared: false,
    hideEmptySeries: false,
    intersect: true,
  },
  grid: {
    borderColor: "#6e7eaa",
    padding: {
      top: 13,
      right: 25,
      left: 15
    }
  },
  dataLabels: {
    offsetX: -1,
    offsetY: 1,
    style: {
      fontSize: 12,
      fontWeight: 400,
      colors : [ theme.value ]
    },
  },
  theme: {
    palette: "palette2"
  },
  radialBar: {
    hollow: {
      background: "#fff"
    },
    barLabels: {
      enabled: false,
      margin: 1,
      useSeriesColors: true,
      fontWeight: 600,
      fontSize: "16px"
    }
  },
  xaxis: {
    categories: dataCountsKeys.value,
    labels:{
      trim: true,
      style:{
        colors: theme.value,
      },
    },
  },
  yaxis: {
    labels:{
      trim: true,
      style:{
        colors:theme.value,
      },
    },
  },
}
provide ("barOptions", barOptions) //providing variabel

//Jika f = !semua
const barOptions_specific = {
    chart: {
    foreColor: "#fff",
    fontFamily: "Roboto",
    height: 362,
    stackOnlyBar: true,
    toolbar: {
        show: false
    },
    type: "line",
    width: 584
  },
  plotOptions: {
    bar: {
      columnWidth: "82%",
      borderRadius: 2,
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
      hideZeroBarsWhenGrouped: false,
      isDumbbell: false,
      isFunnel: false,
      isFunnel3d: true,
      dataLabels: {
        total: {
          enabled: false,
          style: {
            color: "#373d3f",
            fontSize: "12px",
            fontWeight: 600
          }
        }
      }
    },
    bubble: {
      zScaling: true
    },
    treemap: {
      borderRadius: 4,
      dataLabels: {
        format: "scale"
        }
    },
    radialBar: {
      hollow: {
        background: "#fff"
      },
      barLabels: {
        enabled: false,
        margin: 5,
        useSeriesColors: true,
        fontWeight: 600,
        fontSize: "16px"
      }
    },
  },
  legend: {
    position: 'bottom',
    fontSize: 14,
    offsetY: 0,
    markers: {
      width: [10,10,0],
      height: 11,
      strokeColor: theme.value,
      radius: 3,
      shape: "square",
      size: 8
    },
    itemMargin: {
      vertical: 0
    },
    labels:{
      colors: theme.value
    },
    formatter: function(seriesName, opts) {
      // Jika index seri sama dengan index seri 'Tren', jangan tampilkan namanya
      if (opts.seriesIndex === 2) {
        return '';
      }
      return seriesName;
    }
  },
  stroke: {
    fill: {
      type: "solid",
      opacity: 0.85,
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [
          0,
          50,
          100
        ],
      }
    }
  },
  tooltip: {
    enabled: true,
    shared: false,
    hideEmptySeries: false,
    intersect: true,
    y: {
      formatter: () => ''
    }
  },
  grid: {
    borderColor: "#6e7eaa",
    padding: {
      top: 13,
      right: 25,
      left: 15
    }
  },
  dataLabels: {
    offsetX: -1,
    offsetY: 1,
    style: {
      fontSize: 12,
      fontWeight: 400,
      colors : [ theme.value ]
    },
  },
  theme: {
    palette: "palette2"
  },
  radialBar: {
    hollow: {
      background: "#fff"
    },
    barLabels: {
      enabled: false,
      margin: 1,
      useSeriesColors: true,
      fontWeight: 600,
      fontSize: "16px"
    }
  },
  xaxis: {
    categories: dataCountsKeys.value,
    labels:{
      trim: true,
      style:{
        colors: theme.value,
      },
    },
  },
  yaxis: {
    labels: {
      formatter: function (value) {
        return Math.round(value); // Mengubah nilai menjadi bilangan bulat
      }
    }
  }
};

// Fungsi untuk mengganti formatter
const setFormatter = (newFormatter) => {
  barOptions_specific.tooltip.y.formatter = newFormatter;
};
provide("setFormatter", setFormatter) //Providing formatter
provide ("barOptions_specific", barOptions_specific)//providing variabel


// Option for pie
const pieOptions = {
  chart: {
    animations: {
      enabled: true
    },
    dropShadow: {
      enabled: true
    },
    foreColor: '#fff',
    fontFamily: "Roboto",
    height: 382,
    stackOnlyBar: true,
    toolbar: {
      show: false
    },
    type: "pie",
    width: 525
    },
    plotOptions: {
      line: {
        isSlopeChart: false
      },
      bar: {
        borderRadius: 10,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        hideZeroBarsWhenGrouped: false,
        isDumbbell: false,
        isFunnel: false,
        isFunnel3d: true,
        dataLabels: {
          total: {
            enabled: false,
            offsetX: 0,
            offsetY: 0,
            style: {
              color: "#373d3f",
              fontSize: "12px",
              fontWeight: 600
            }
          }
        }
      },
      bubble: {
        zScaling: true
      },
      treemap: {
        borderRadius: 4,
        dataLabels: {
          format: "scale"
        }
      },
      radialBar: {
        hollow: {
          background: "#fff"
        },
        barLabels: {
          enabled: false,
          margin: 5,
          useSeriesColors: true,
          fontWeight: 600,
          fontSize: "16px"
        }
      },
      pie: {
        donut: {
          size: '10%', // Ubah persentase sesuai kebutuhan
        }
      }
    },
    dataLabels: {
      style: {
        fontSize: 13,
        fontWeight: 700
      },
      background: {
        foreColor: theme.value,
        padding: 6
      }
    },
    fill: {
      opacity: 1
    },
    grid: {
      padding: {
        right: 80,
        bottom: 80,
        left: 80
      } 
    },
    legend: {
      position: "right",
      fontSize: 12,
      fontWeight: 300,
      offsetY: -4,
      markers: {
        width: 13,
        radius: 4
      },
      itemMargin: {
        vertical: 0
      },
      labels:{
      colors: theme.value
      }
    },
    stroke: {
      width: 1,
      colors: [theme.value],
      fill: {
        type: "solid",
        opacity: 0.85,
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [
                0,
                50,
                100
          ],
        }
      }
    },
    tooltip: {
      hideEmptySeries: false,
      fillSeriesColor: false
    },
    xaxis: {
      labels: {
        trim: true
      },
      group: {
        style: {
          fontSize: "12px",
          fontWeight: 400
        }
      },
      title: {
        style: {
          fontWeight: 700
        }
      }
    },
    yaxis: {
      title: {
        style: {
          fontWeight: 700
        }
      }
    },
    theme: {
      palette: "palette3"
    },
    labels: [],
}
const setLabels = (newLabels) => {
  pieOptions.labels = newLabels;
};
provide('setLabels', setLabels);
provide("pieOptions", pieOptions)




</script>

<template>
  <ChartsByIpk/>
  <TableByIpk/>
  <ChartsByTime/>
  <TableByTime/>
</template>