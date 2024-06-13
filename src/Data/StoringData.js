import { defineStore } from "pinia";
import {  ref } from 'vue';
import * as tf from '@tensorflow/tfjs';
import deepClone from "deep-clone";

export const StoreData = defineStore("Data", {
  state: () => ({
    data: [],
    datacounts: [],
    datacountstotal: [],
    theme: null,
    fakultas:true, // True untuk semua fakultas dan false untuk fakultas yang specific

    error: null,
    loadingData: true,
    totalData:[],
    teksLoading:null,

    //Memory all variables
    memory:[],

    // Deep Learnings section
    dataAi:[],
    model:null,
    tensorData:null,
    result:null,
    rentangIpk:null,
    bestIpk:null,
  }),
  getters: {
    getTeksLoading(state){
      return ref(state.teksLoading)
    },
    dataCountsKeys(state) {
      return Object.keys(state.data);
    },
    themeChanger(){
      const theme = localStorage.theme === "dark" ? "#e6e6e6" : "#262626";
      return theme;
    },
    hitungData(state) {
      const counts = {};
      for (const key in state.data) {
        let nilaiIpkSukses = 0;
        let nilaiIpkGagal = 0;
        let nilaiLamaSukses = 0;
        let nilaiLamaGagal = 0;
        state.data[key].forEach((mahasiswa) => {
          let tahunKeluar = new Date(mahasiswa.tglKeluar).getFullYear();
          let tahunMasuk = new Date(mahasiswa.tglMasuk).getFullYear();
          if (!isNaN(mahasiswa.ipk)) {
            if (mahasiswa.ipk >= 3.0) {
              nilaiIpkSukses++;
            } else {
              nilaiIpkGagal++;
            }
          }

          if (!isNaN(tahunKeluar)) {
            if (tahunKeluar - tahunMasuk <= 4) {
              nilaiLamaSukses++;
            } else {
              nilaiLamaGagal++;
            }
          }
        });
        // Menyimpan hasil hitungan ke dalam objek counts
        counts[key] = {
          ipkSukses: nilaiIpkSukses,
          ipkGagal: nilaiIpkGagal,
          lamaSukses: nilaiLamaSukses,
          lamaGagal: nilaiLamaGagal
        };
      }

      return counts;
    },
    hitungDataTotal(state) {
      let totalIpkSukses = 0;
      let totalIpkGagal = 0;
      let totalLamaSukses = 0;
      let totalLamaGagal = 0;

      // Mengakses nilai-nilai dari objek state.datacounts
      for (const key in state.datacounts) {
        const data = state.datacounts[key];
        totalIpkSukses += data.ipkSukses || 0;
        totalIpkGagal += data.ipkGagal || 0;
        totalLamaSukses += data.lamaSukses || 0;
        totalLamaGagal += data.lamaGagal || 0;
      }

      let total = {
        ipkSukses: totalIpkSukses,
        ipkGagal: totalIpkGagal,
        lamaSukses: totalLamaSukses,
        lamaGagal: totalLamaGagal,
      };

      return total;
    },
    hitungTotal(state){
      const counts = {};
      for (const key in state.data) {
        let nilaiTotalData_ipk = 0;
        let nilaiTotalData_lama = 0;
        state.data[key].forEach((mahasiswa) => {
          let tahunKeluar = new Date(mahasiswa.tglKeluar).getFullYear();
          if (!isNaN(mahasiswa.ipk)){
            nilaiTotalData_ipk += 1; 
          }
          if (!isNaN(tahunKeluar)){
            nilaiTotalData_lama += 1; 
          }
        });
        counts[key] = {
          ipk : nilaiTotalData_ipk,
          lama : nilaiTotalData_lama
        }
      }
      return counts;
    },
    //Deep learning section
    ConvertToTensor(state){
      this.teksLoading = "Converting the data"
      //Getting Data
      const data1 = deepClone(state.dataAi)
      const data2 = deepClone(state.dataAi)
      //Making to flat data for ipk
      const forIpk = []
      //Making to flat data for prediction
      const forPredict = []
      //insert data to each array
      for (const fakultas in data1){
        forIpk.push(...data1[fakultas]);
      }
      for (const fakultas in data2){
        forPredict.push(...data2[fakultas]);
      }
      //Deleting property that is not used
      forPredict.forEach(d=>{
        delete d.fakultas;
        delete d.fakultasID;
        delete d.nama;
        delete d.noHape;
        delete d.npm;
        delete d.tglMasuk;
        delete d.tglKeluar;
      })
      forIpk.forEach(e => {
        delete e.fakultas;
        delete e.fakultasID;
        delete e.nama;
        delete e.noHape;
        delete e.npm;
        delete e.tglMasuk;
        delete e.tglKeluar;
        delete e.asalSekolah;
        delete e.durasi;
        delete e.gpaSemester1;
        delete e.gpaSemester2;
        delete e.gpaSemester3;
        delete e.gpaSemester4;
        delete e.jenisKelamin;
      });
      //changing jenisKelamin
      // 1 for M(an) and 0 for F(emale)
      forPredict.forEach(d => {
        d.jenisKelamin = d.jenisKelamin === "M" ? 1:0
      })
      //changing durasi
      //1 for succes and 0 for failure
      forPredict.forEach(d => {
        d.durasi = d.durasi <= 4 ? 1:0
      })

      // Classification for school by number 
      const schoolConvert = (d) => {
        switch (d) {
          case "China": return 0;
          case "Russia": return 1;
          case "Croatia": return 2;
          case "Poland": return 3;
          case "Afghanistan": return 4;
          case "Czech Republic": return 5;
          case "Argentina": return 6;
          case "Indonesia": return 7;
          case "Colombia": return 8;
          case "Armenia": return 9;
          default: return 10;
        }
      }
      forPredict.forEach(d => {
        d.asalSekolah = schoolConvert(d.asalSekolah)
      })

      //convert to tensor
      const featuresPredict = forPredict.map(d => [d.asalSekolah, d.gpaSemester1, d.gpaSemester2, d.gpaSemester3, d.gpaSemester4, d.ipk, d.jenisKelamin])
      const featuresIpk = forIpk.map(d => [d.ipk])
      const labels = forPredict.map(d => d.durasi);
      //save to 1 variable
      const tensorPredict = {
        feature : featuresPredict,
        label : labels
      }
      const tensorIpk = {
        feature : featuresIpk,
        label : labels
      }
      //assemble to 1 variable
      const tensor = {
        ipk : tensorIpk,
        predict : tensorPredict
      }
      return tensor;
    },
    async loadModelIpk(state){
      this.teksLoading = "Load model"
      const model = tf.sequential()
      model.add(tf.layers.dense({units: 128, activation: 'relu', inputShape: [1]}))
      model.add(tf.layers.dense({units: 64, activation: 'relu'}));
      model.add(tf.layers.dense({units: 32, activation: 'relu'}));
      model.add(tf.layers.dense({units: 16, activation: 'relu'}));
      model.add(tf.layers.dense({units: 8, activation: 'relu'}));
      model.add(tf.layers.dense({units: 4, activation: 'relu'}));
      model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
      
      this.teksLoading = "Compiling model"
      await model.compile({
        optimizer: tf.train.adam(),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      this.teksLoading = "Finding the best ipk for compare";
      async function trainModel(feature, label)  {
        //konfigurasi epoch
        const epochCount = 10;
        //function for debuggin
        const trainingProgressCallback =  {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1} / ${epochCount}`);
            console.log(`Loss: ${logs.loss}, Accuracy: ${logs.acc}`);
            console.log(`Validation Loss: ${logs.val_loss}, Validation Accuracy: ${logs.val_acc}`);
          }
        };
        const customCallback = new tf.CustomCallback(trainingProgressCallback)
        const forPatience = state.tensorData.ipk.feature.length; 
        try {
          const history = await model.fit(feature, label, {
            epochs: epochCount,
            batchSize: 32,
            validationSplit: 0.2,
            callbacks: [
              tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: forPatience }),
              customCallback
            ]
          });
          console.log('Model training completed');
          console.log('Training History:', history);
        } catch (error) {
          console.error('Error during model training:', error);
        }
      }

      const features = JSON.parse(JSON.stringify(state.tensorData.ipk.feature)); 
      const labels = JSON.parse(JSON.stringify(state.tensorData.ipk.label));
      const featureTensor = tf.tensor2d(features);
      const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
      
      //Start the Process
      await trainModel(featureTensor, labelTensor)
      this.teksLoading = "Evaluate the models"
      const result = await model.evaluate(featureTensor, labelTensor);
      this.teksLoading = "Done"
      console.log("result : ", result) 

      const nilaiIpk = JSON.parse(JSON.stringify(state.rentangIpk))
      const predictions = [];
      const ipkValues = [];
    
      for (let ipk of nilaiIpk) {
        ipk = parseFloat(ipk);

        const input = [ipk]; 
        const tensor = tf.tensor2d([input]);
        const prediction = await model.predict(tensor).dataSync()[0];
        
        ipkValues.push(ipk);
        predictions.push(prediction);
      }

      //Mencari nilai tengah
      let optimalIPK = null;
      let minDifference = Infinity;
    
      for (let i = 0; i < ipkValues.length; i++) {
        const difference = Math.abs(predictions[i] - 0.5);
        if (difference < minDifference) {
          minDifference = difference;
          optimalIPK = ipkValues[i];
        }
      }
      console.log(optimalIPK)
      return optimalIPK;

    },
    async loadModelPredict(state){
      this.teksLoading = "Load model"
      const model = tf.sequential()
      model.add(tf.layers.dense({units: 32, activation: 'relu', inputShape: [7]}));
      model.add(tf.layers.dense({units: 16, activation: 'relu'}));
      model.add(tf.layers.dense({units: 8, activation: 'relu'}));
      model.add(tf.layers.dense({units: 4, activation: 'relu'}));
      model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));
      
      this.teksLoading = "Compiling model"
      await model.compile({
        optimizer: tf.train.adam(),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      this.teksLoading = "Training the models"
      //Training model section
      async function trainModel(feature, label)  {
        //konfigurasi epoch
        const epochCount = 300;
        //function for debug
        // const trainingProgressCallback = {
        //   onEpochEnd: (epoch, logs) => {
        //     console.log(`Epoch ${epoch + 1} / ${epochCount}`);
        //     console.log(`Loss: ${logs.loss}, Accuracy: ${logs.acc ? logs.acc : logs.accuracy}`);          
        //   }
        // };
        const trainingProgressCallback =  {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1} / ${epochCount}`);
            console.log(`Loss: ${logs.loss}, Accuracy: ${logs.acc}`);
            console.log(`Validation Loss: ${logs.val_loss}, Validation Accuracy: ${logs.val_acc}`);
          }
        };
        const customCallback = new tf.CustomCallback(trainingProgressCallback)
        try {
          const history = await model.fit(feature, label, {
            epochs: epochCount,
            batchSize: 32,
            validationSplit: 0.2,
            callbacks: [
              tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 0 }),
              customCallback
            ]
          });
          console.log('Model training completed');
          console.log('Training History:', history);
        } catch (error) {
          console.error('Error during model training:', error);
        }
      }
      
      const features = JSON.parse(JSON.stringify(state.tensorData.predict.feature));
      const labels = JSON.parse(JSON.stringify(state.tensorData.predict.label));
      const featureTensor = tf.tensor2d(features);
      const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

      //Start the Process
      await trainModel(featureTensor, labelTensor)
      this.teksLoading = "Evaluate the models"
      const result = await model.evaluate(featureTensor, labelTensor);
      this.teksLoading = "Done"
      console.log("result : ", result) 

      const nilaiIpk = JSON.parse(JSON.stringify(state.rentangIpk))

      console.log("nilaiIpk",nilaiIpk) //array(41) dari 0 sampai 4.0 kelipatan 0.1


    },
  },
  actions: {
    loadIpk(){
      const ipk = [];
      // Mengisi array ipk dengan nilai dari 0.1 hingga 4 dengan kelipatan 0.1
      for (let i = 0; i < 4.1; i += 0.1) {
        const x = i.toFixed(1) 
        ipk.push(x);
      }
      this.rentangIpk = ipk;
    },
    async fetchDataLulus(f, t) {
      // Menunggu
      this.loadingData = true;
      //Menyimpan ke memory
      this.memory = {
        fakultas : f,
        tahun : t
      }
      // Konfigurasi url GetData
      const baseUrl = "http://localhost:8080/lulus";
      let url = baseUrl;
      url += `/${t[0]}/${t[1]}`
      if (f !== "semua") {
        // Jika fakultas spesifik maka ditambahkan link fakultas
        url += `/${f}`;
      }
      //Masuk ke section fetching
      this.teksLoading = "Fetching Datas"
      // Fetching Data from url
      try {
        const responses = await fetch(url);
        if (!responses.ok) {
          throw new Error("Fail to get Data");
        }
        const datafetchings = await responses.json();
        // mendapatkan nilai durasi
        datafetchings.forEach((students) => {
        let tahunKeluar = new Date(students.tglKeluar).getFullYear();
        let tahunMasuk = new Date(students.tglMasuk).getFullYear();
        let durasi = tahunKeluar - tahunMasuk;
        students.durasi = durasi;
        })
        // Menghitung IPK untuk setiap objek data
        datafetchings.forEach((students) => {
          let totalGPA = 0;
          let semesterCount = 0;
          for (const key in students) {
            if (key.startsWith("gpaSemester") && Number(students[key]) > 0) {
              totalGPA += Number(students[key]);
              semesterCount++;
            }
          }
          students.ipk =
            Math.round(
              (semesterCount > 0 ? totalGPA / semesterCount : 0) * 100
            ) / 100;
        });
        if (f === "semua") {
          let dataz = {}; //Bantuan
          datafetchings.forEach((mahasiswas) => {
            let fakultas = mahasiswas.fakultas.namaFakultas;
            if (!Object.prototype.hasOwnProperty.call(dataz, fakultas)) {
              dataz[fakultas] = [];
            }
            dataz[fakultas].push(mahasiswas);
          });
          this.fakultas = true;
          this.dataAi = dataz;
        } else {
          let dataz = {}; //Bantuan
          datafetchings.forEach((mahasiswas) => {
            let tahunMasuk = new Date(mahasiswas.tglMasuk)
              .getFullYear()
              .toString();
            if (!Object.prototype.hasOwnProperty.call(dataz, tahunMasuk)) {
              dataz[tahunMasuk] = [];
            }
            dataz[tahunMasuk].push(mahasiswas);
          });
          this.fakultas = false;
          this.dataAi = dataz;
        }
        await this.processAllAi();
        this.loadingData = false;
      } catch (error) {
        this.teksLoading = "Fail to get data" 
        this.error = error;
      }
      // Untuk developing
      // Akan dihapus ketika developing sudah selesai
      console.log("URL: ", url);
      console.log("Data yang didapatkan :", this.dataAi);
      return this.dataAi;
    },
    async fetchData(f, t) {
      // Menunggu
      this.loadingData = true;
      //Menyimpan ke memory
      this.memory = {
        fakultas : f,
        tahun : t
      }
      // Konfigurasi url GetData
      const baseUrl = "http://localhost:8080";
      let url = baseUrl;

      url += `/${t[0]}/${t[1]}`
      if (f !== "semua") {
        // Jika fakultas spesifik maka ditambahkan link fakultas
        url += `/${f}`;
      }
      //Masuk ke section fetching
      this.teksLoading = "Fetching Datas"
      // Fetching Data from url
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Fail to get Data");
        }
        const datafetching = await response.json();
        //Masuk ke section proses Data
        this.teksLoading = "Processing Datas" 
        // Menghitung IPK untuk setiap objek data
        datafetching.forEach((student) => {
          // Periksa apakah student.tglKeluar ada dan bukan null atau undefined
          if (student.tglKeluar) {
            let tahunKeluar = new Date(student.tglKeluar).getFullYear();
            let tahunMasuk = new Date(student.tglMasuk).getFullYear();
            let durasi = tahunKeluar - tahunMasuk;
            student.durasi = durasi;
          } else {
            student.durasi = "Belum lulus";
          }
        })
        datafetching.forEach((student) => {
          let totalGPA = 0;
          let semesterCount = 0;
          for (const key in student) {
            if (key.startsWith("gpaSemester") && Number(student[key]) > 0) {
              totalGPA += Number(student[key]);
              semesterCount++;
            }
          }
          student.ipk =
            Math.round(
              (semesterCount > 0 ? totalGPA / semesterCount : 0) * 100
            ) / 100;
          if (student.ipk == 0) {
            student.ipk = "No IPK yet";
          }
        });
        if (f === "semua") {
          let dataz = {}; //Bantuan
          datafetching.forEach((mahasiswa) => {
            let fakultas = mahasiswa.fakultas.namaFakultas;
            if (!Object.prototype.hasOwnProperty.call(dataz, fakultas)) {
              dataz[fakultas] = [];
            }
            dataz[fakultas].push(mahasiswa);
          });
          this.fakultas = true;
          this.data = dataz;
        } else {
          let dataz = {}; //Bantuan
          datafetching.forEach((mahasiswa) => {
            let tahunMasuk = new Date(mahasiswa.tglMasuk)
              .getFullYear()
              .toString();
            if (!Object.prototype.hasOwnProperty.call(dataz, tahunMasuk)) {
              dataz[tahunMasuk] = [];
            }
            dataz[tahunMasuk].push(mahasiswa);
          });
          this.fakultas = false;
          this.data = dataz;
        }
        //Masuk ke section validasi data
        this.teksLoading = "Litlle bit more" 
        await this.processAll();
        this.loadingData = false;
      } catch (error) {
        this.teksLoading = "Fail to get data"
        this.error = error;
      }
      // Untuk developing
      // Akan dihapus ketika developing sudah selesai
      // console.log("URL: ", url);
      // console.log("Data yang didapatkan :", this.data);
      // console.log("data counts", this.datacounts);
      // console.log("data countstotal", this.datacountstotal);
      // console.log("LoadingData",this.loadingData)
      // console.log("totalData: ", this.totalData)
      // console.log("fakultas:", this.fakultas)
      // console.log("memory", this.memory)
      return this.data;
    },
    async processAll() {
      this.datacounts = await this.hitungData;
      this.datacountstotal = await this.hitungDataTotal;
      this.theme = await this.themeChanger;
      this.totalData = await this.hitungTotal;
    },
    async processAllAi() {
      this.tensorData = await this.ConvertToTensor;
      this.model = await this.loadModelIpk;
      // this.model = await this.loadModelPredict;
    },
  },
});
