<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { StoreData } from '@/Data/StoringData';
const store = StoreData();

let fakultas = ref('semua')
let tahun = ref('2016-2017')


let tahunPisah = computed(() => tahun.value.split("-"));


const handleChange = () => {
  store.fetchData(fakultas.value, tahunPisah.value)
}

onBeforeMount(() => {
  store.loadIpk()
  store.fetchData(fakultas.value, tahunPisah.value)
});


</script>

<template>
    <div class="container bg-lightContainer dark:bg-darkContainer shadow-md rounded-md mt-3"> 
        <div class="flex flex-wrap justify-center text-center items-center min-h-10 text-lightText dark:text-darkText"> 
            <div class="w-full px-4 lg:w-1/2">Kelulusan Tepat Waktu</div>
            <div class="w-full px-4 lg:w-1/2 flex justify-evenly p-2 items-center">
                <select @change="handleChange" v-model="fakultas" class=" flex h-10 rounded-md bg-lightIcon dark:bg-darkIcon text-lightText dark:text-darkText brightness-110 items-center p-2 hover:opacity-85 focus:ring-2 focus:ring-lightFooter dark:focus:ring-darkFooter focus:ring-offset-2 focus:ring-offset-gray-100">
                    <option value="semua">Semua Fakultas</option>
                    <option value="1">FEB</option>
                    <option value="2">Hukum</option>
                    <option value="3">FISIP</option>
                    <option value="4">Kedokteran</option>
                    <option value="5">FKIP</option>
                    <option value="6">FMIPA</option>
                    <option value="7">Pertanian</option>
                    <option value="8">Teknik</option>
                </select>
                <select @change="handleChange" v-model="tahun" class="flex h-10 rounded-md bg-lightIcon dark:bg-darkIcon text-lightText dark:text-darkText brightness-110 items-center p-2 hover:opacity-85 focus:ring-2 focus:ring-lightFooter dark:focus:ring-darkFooter focus:ring-offset-2 focus:ring-offset-gray-100">
                    <option value="2016-2017">2016-2017</option>
                    <option value="2017-2018">2017-2018</option>
                    <option value="2016-2022">2018-2019</option>
                    <option value="2019-2020">2019-2020</option>
                    <option value="2020-2021">2020-2021</option>
                    <option value="2021-2022">2021-2022</option>
                </select>
            </div>
        </div>
    </div>
</template>