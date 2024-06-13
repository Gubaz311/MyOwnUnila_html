<script setup>
import { computed, ref } from 'vue';
import { StoreData } from '@/Data/StoringData'; // Ganti dengan path ke store Pinia Anda

const store = StoreData();
const students = computed(() => {
return Object.values(store.data).flat();
});


const getYear = (dateString) => {
return dateString ? new Date(dateString).getFullYear() : '';
};


const siswaTerpilih = ref([])

const togglePilih = (student) => {
  const index = siswaTerpilih.value.indexOf(student)
  if (index !== -1) {
    siswaTerpilih.value.splice(index, 1)
  } else {
    siswaTerpilih.value.push(student)
  }
}

const pilihSiswa = (student) => {
  return siswaTerpilih.value.includes(student)
}

const durasiRounds = (student) => {
  if (student.durasi <= 4){
    return "< 4 Tahun"
  }else if(student.durasi > 4){
    return "> 4 Tahun"
  }else{
    return student.durasi
  }
}


</script>
  

<template>
    <div class="container px-3 h-52 overflow-auto mt-10 mb-10 bg-lightContainer dark:bg-darkContainer">
        <table class="w-full text-lightText dark:text-darkText">
            <thead class="bg-lightIcon dark:bg-darkIcon h-12 sticky top-0">
                <tr class="p-1 text-center">
                    <td></td>
                    <td>Nama</td>
                    <td>Angkatan</td>
                    <td>Fakultas</td>
                    <td>Lama</td>
                </tr>
            </thead>
            <tbody>
                <tr @click="togglePilih(student)" v-for="student in students" :key="student.npm" class="cursor-pointer border-b transition duration-300 ease-in-out hover:bg-lightIconFocus dark:hover:bg-darkIconFocus mt-4" >
                    <td><input type="checkbox" name="" id="" :checked="pilihSiswa(student)"></td>
                    <td class="hover:opacity-85">{{ student.nama }}</td>
                    <td>{{ getYear(student.tglMasuk) }}</td>
                    <td>{{ student.fakultas.namaFakultas }}</td>
                    <td>{{ durasiRounds(student) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
