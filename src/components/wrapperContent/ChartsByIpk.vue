<script setup>
import { ref, computed, inject } from 'vue';
import ApexCharts from 'vue3-apexcharts'
import { StoreData } from '@/Data/StoringData';
const store = StoreData();

const fak = inject("fak");

const barOption = inject("barOptions"); 

// Mendapatkan nilai totalData sebagai data untuk perhitungan dalam konfigurasi
const totalData = computed(() => {
  return Object.values(store.totalData)
})
const totalData_ipk = computed(() => {
  return totalData.value.map(item => item.ipk);
});

// Menghitung total IPK Sukses dan Gagal serta lama studi Sukses dan Gagal
const dataSiswa = computed(() => {
  return Object.values(store.datacounts);
});
const ipkSuksesData = computed(() => {
  return dataSiswa.value.map(item => item.ipkSukses);
});
const ipkGagalData = computed(() => {
  return dataSiswa.value.map(item => item.ipkGagal);
});

// Mencari nilai terbesar untuk penyesuaian data terhadap data sukses dan total
const nilaiTerbesar = Math.max(store.datacountstotal.ipkSukses, store.datacountstotal.ipkGagal);
const ipkSukses = computed(() => {
  return store.datacountstotal.ipkSukses
})

const ipkGagal = computed (() => {
  return store.datacountstotal.ipkGagal
})


// Konfigurasi tambahan untuk apexchart
const trenGraphs = ipkSuksesData.value.map((ipkSuksesData, index) => {
  const total = totalData_ipk.value[index];
  const hasil = Math.round(((ipkSuksesData/total)*100) * 100) / 100;
  const adapt = (hasil/100) * nilaiTerbesar
  return isNaN(adapt) ? 0 : adapt;
});


// Data untuk chart IPK
// Chart bila fakultas yang dipilih adalah semua fakultas
const ipk = ref([
  {
    name: 'IPK Sukses',
    type: 'column',
    data: ipkSuksesData.value
  },
  {
    name: 'IPK Gagal',
    type: 'column',
    data: ipkGagalData.value
  }
]);
// Chart bila fakultas yang dipilih adalah spesific fakultas
const ipkSpecific = ref([
  {
    name: 'IPK Sukses',
    type: 'column',
    data: ipkSuksesData.value,
    showInLegend: true
  },
  {
    name: 'IPK Gagal',
    type: 'column',
    data: ipkGagalData.value,
    showInLegend: true
  },
  {
    name: 'Tren',
    type: 'line',
    data: trenGraphs,
    showInLegend: false
  }
]);
const setFormatter = inject("setFormatter")

const ipkFormatter = (val) => {
  // Hilangkan angka nol setelah koma
  return val !== null ? val.toFixed(2) : '';
}
const barOption_specific = inject("barOptions_specific");
setFormatter(ipkFormatter)

//untuk pie
const newLabels = ['IPK Sukses', 'IPK Gagal'];
const setLabels = inject('setLabels');
setLabels(newLabels);
const pieOptions = inject("pieOptions");
const ipkSeries = ref([ipkSukses.value, ipkGagal.value]);


</script>

<template>
  <div class="container bg-lightContainer dark:bg-darkContainer mt-2">
    <div class=" text-center text-lightText dark:text-darkText text-2xl font-bold ">Berdasarkan IPK ≥ 3.00</div>
      <div class="container flex items-center justify-center">
        <div class="w-full md:w-1/2">
          <div v-if="fak === true">
            <ApexCharts type="bar" :options="barOption" :series="ipk"></ApexCharts>
          </div>
          <div v-else>
            <ApexCharts type="line" :options="barOption_specific" :series="ipkSpecific"></ApexCharts>
          </div>
        </div>
        <div class="w-1/2 hidden md:flex">
          <div class="items-center h-full w-[90%] ml-16 content-center">
            <ApexCharts type="pie" :options="pieOptions" :series="ipkSeries"></ApexCharts>
          </div>
        </div>
    </div>
  </div>
</template>