import axios from 'axios'
import type { Ref } from 'vue'
import type { CountData, TableData, ChartData } from '@/types'
// import * as echarts from 'echarts'

export default {
  getCount: async (countData: Ref<CountData[]>) => {
    await axios({
      url: '/api/home/getCountData',
      method: 'get',
    })
      .then((res) => {
        console.log('getCountData Success: ', res.data)
        if (res.data.code === 200) {
          countData.value = res.data.data
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },
  getTableData: async (tableData: Ref<TableData[]>) => {
    await axios({
      url: '/api/home/getTableData',
      method: 'get',
    })
      .then((res) => {
        console.log('getTableData Success: ', res.data)
        if (res.data.code === 200) {
          tableData.value = res.data.data.tableData
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },
  getChartData: async (chartData: Ref<ChartData>) => {
    await axios({
      url: '/api/home/getChartData',
      method: 'get',
    })
      .then((res) => {
        console.log('getChartData Success: ', res.data)
        if (res.data.code === 200) {
          chartData.value = res.data
          console.log('chartData: ', chartData.value)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },
}
