<script setup>
import { ref, computed, inject } from 'vue';
import ApexCharts from 'vue3-apexcharts'
import { StoreData } from '@/Data/StoringData';
const store = StoreData();
const fak = inject("fak");


// Mendapatkan nilai totalData sebagai data untuk perhitungan dalam konfigurasi
const totalData = computed(() => {
  return Object.values(store.totalData)
})
const totalData_time = computed(() => {
  return totalData.value.map(item => item.lama);
});

// Menghitung total IPK Sukses dan Gagal serta lama studi Sukses dan Gagal
const dataSiswa = computed(() => {
  return Object.values(store.datacounts);
});
const lamaSuksesData = computed(() => {
  return dataSiswa.value.map(item => item.lamaSukses);
});
const lamaGagalData = computed(() => {
  return dataSiswa.value.map(item => item.lamaGagal);
});

// Mencari nilai terbesar untuk penyesuaian data terhadap data sukses dan total
const nilaiTerbesar = Math.max(store.datacountstotal.lamaSukses, store.datacountstotal.lamaGagal);
const lamaSukses = computed(() => {
  return store.datacountstotal.lamaSukses
})

const lamaGagal = computed (() => {
  return store.datacountstotal.lamaGagal
})


// Konfigurasi tambahan untuk apexchart
const trenGraphs = lamaSuksesData.value.map((lamaSuksesData, index) => {
  const total = totalData_time.value[index];
  const hasil = Math.round(((lamaSuksesData/total)*100) * 100) / 100;
  const adapt = (hasil/100) * nilaiTerbesar
  return isNaN(adapt) ? 0 : adapt;
});


// Data untuk chart IPK
// Chart bila fakultas yang dipilih adalah semua fakultas
const barOption = inject("barOptions"); 
const time = ref([
  {
    name: 'Sukses',
    type: 'column',
    data: lamaSuksesData.value
  },
  {
    name: 'Gagal',
    type: 'column',
    data: lamaGagalData.value
  }
]);
// Chart bila fakultas yang dipilih adalah spesific fakultas
const timeSpecific = ref([
  {
    name: 'Sukses',
    type: 'column',
    data: lamaSuksesData.value,
    showInLegend: true
  },
  {
    name: 'Gagal',
    type: 'column',
    data: lamaGagalData.value,
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
  return val !== null ? val.toFixed(0) : '';
}

const barOption_specific = inject("barOptions_specific");
setFormatter(ipkFormatter)


//untuk pie
const newLabels = ['Lama Sukses', 'Lama Gagal'];
const setLabels = inject('setLabels');
setLabels(newLabels);
const pieOptions = inject("pieOptions");
const lamaSeries = ref([lamaSukses.value, lamaGagal.value]);


</script>

<template>
  <div class="container bg-lightContainer dark:bg-darkContainer mt-7">
    <div class=" text-center text-lightText dark:text-darkText text-2xl font-bold ">Berdasarkan Waktu Studi ≤ 4 Tahun</div>
      <div class="container flex items-center justify-center">
        <div class="w-full md:w-1/2">
          <div v-if="fak === true">
            <ApexCharts type="bar" :options="barOption" :series="time"></ApexCharts>
          </div>
          <div v-else>
            <ApexCharts type="line" :options="barOption_specific" :series="timeSpecific"></ApexCharts>
          </div>
        </div>
        <div class="w-1/2 hidden md:flex">
          <div class="items-center h-full w-[90%] ml-16 content-center">
            <ApexCharts type="pie" :options="pieOptions" :series="lamaSeries"></ApexCharts>
          </div>
        </div>
    </div>
  </div>
</template>