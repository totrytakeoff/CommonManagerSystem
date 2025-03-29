<template>
    <div>
        <el-row class="home" :getter="20">
            <el-col :span="8" style="margin-top: 20px">
                <el-card shadow="hover" style="border-radius: 10px">
                    <div class="user">
                        <img :src="getImageUrl('user')" alt="用户头像" class="user" />
                        <div class="user-info">
                            <p class="user-info-name">admin</p>
                            <p class="user-info-authority">superAdministers</p>
                        </div>
                    </div>

                    <div class="login-info">
                        <p>last launch time: <span>"2025-03-26T00:00:00.000Z"</span></p>
                        <p>last launch location: <span>"China"</span></p>
                    </div>
                </el-card>
                <el-card shadow="hover" style="border-radius: 10px" class="user-table">
                    <el-table :data="tableData" stripe border>
                        <el-table-column v-for="(item, index) in tableLabel" :key="index" :prop="index" :label="item">
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>

            <el-col :span="16" style="margin-top:20px">
                <div class="count">

                    <el-card :body-style="{ display: 'flex', padding: '0' }" v-for="item in countData" :key="item.name"
                        shadow="hover">
                        <component :is="item.icon" class="icon" :style="{ background: item.color }"></component>
                        <div class="detail">
                            <p class="num">{{ item.value }}</p>
                            <p class="name">{{ item.name }}</p>
                        </div>

                    </el-card>
                </div>

                <div class="graph">

                    <el-card class="top-echart" shadow="hover">
                        <div ref="chart1" style="height: 280px"></div>
                    </el-card>
                    <div class="bottom-echart">
                        <el-card class="bottom-left-echart" shadow="hover">
                            <div ref="chart2" style="height: 240px"></div>
                        </el-card>
                        <el-card class="bottom-right-echart" shadow="hover">
                            <div ref="chart3" style="height: 240px"></div>
                        </el-card>

                    </div>

                </div>


            </el-col>

        </el-row>
    </div>
</template>



<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue'
import API from '@/api/api.ts'
import type { TableData, CountData, ChartData, XOptions, LineSeriesOption, BarSeriesOption, PieOptions } from '@/types'
import * as echarts from "echarts"
import { reactive } from 'vue'
import getImageUrl from '@/utils/getUserData'
import axios from 'axios'

// 表格数据
const tableData = ref<TableData[]>([])
// 统计卡片数据
const countData = ref<CountData[]>([])
// 图表数据
const chartData = ref<ChartData>({
    code: 0,
    data: {
        orderData: { date: [], data: [] },
        videoData: [],
        userData: []
    }
})


const tableLabel = ref({
    name: "课程",
    todayBuy: "今日购买",
    monthBuy: "本月购买",
    totalBuy: "总购买",
})

const chart1 = ref<HTMLElement | null>(null);
const chart2 = ref<HTMLElement | null>(null);
const chart3 = ref<HTMLElement | null>(null);

// ECharts 实例
let chartInstance1: echarts.ECharts | null = null;
let chartInstance2: echarts.ECharts | null = null;
let chartInstance3: echarts.ECharts | null = null;



// 初始化图表
const initCharts = () => {
    if (chart1.value) chartInstance1 = echarts.init(chart1.value);
    if (chart2.value) chartInstance2 = echarts.init(chart2.value);
    if (chart3.value) chartInstance3 = echarts.init(chart3.value);

    updateCharts();
};


// 更新图表配置
const updateCharts = () => {
    const { orderData, userData, videoData } = chartData.value.data || {
        orderData: { date: [], data: [] },
        videoData: [],
        userData: [],
    };

    // 折线图配置
    if (chartInstance1 && orderData) {
        chartInstance1.setOption({
            title: { text: '订单数据趋势' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: orderData.date },
            yAxis: { type: 'value' },
            series: Object.keys(orderData.data[0] || {}).map(key => ({
                name: key,
                type: 'line',
                data: orderData.data.map(item => item[key]),
            })),
        });
    }

    // 柱状图配置
    if (chartInstance2 && userData) {
        chartInstance2.setOption({
            title: { text: '用户数据统计' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: userData.map(item => item.date) },
            yAxis: { type: 'value' },
            series: [
                { name: '新增用户', type: 'bar', data: userData.map(item => item.new) },
                { name: '活跃用户', type: 'bar', data: userData.map(item => item.active) },
            ],
        });
    }

    // 饼图配置
    if (chartInstance3 && videoData) {
        chartInstance3.setOption({
            title: { text: '视频数据分布', left: 'center' },
            tooltip: { trigger: 'item' },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    data: videoData.map(item => ({ name: item.name, value: item.value })),
                },
            ],
        });
    }
};

// 生命周期钩子
onMounted(async () => {
    await API.getChartData(chartData); // 获取数据
    await API.getCount(countData);
    await API.getTableData(tableData);
    // await API.getChartData(chartData);
    initCharts(); // 初始化图表
});

// 监听数据变化
watch(
    () => chartData.value,
    () => {
        updateCharts();
    },
    { deep: true }
);


// 监听窗口变化, 重新渲染图表
const observer = ref();
observer.value = new ResizeObserver((en) => {
    chartInstance1?.resize();
    chartInstance2?.resize();
    chartInstance3?.resize();
})

observer.value.observe(document.body);


</script>

<style scoped lang="less">
.home {
    height: 100%;
    overflow: hidden;

    .user {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        height: 200px;

        img {
            width: 160px;
            height: 160px;
            border-radius: 50%;
            margin-right: 40px;
        }

        .user-info {
            p {
                color: #333;
                margin-bottom: 10px;
                margin-left: 10px
            }

            .user-info-name {
                font-size: 32px
            }

            .user-info-authority {
                font-size: 16px;
                color: #999;
            }

        }
    }

    .login-info {
        p {
            line-height: 30px;
            font-size: 14px;
            color: #999;

            margin-bottom: 10px;

            span {
                color: #666;
                margin-left: 60px;
            }
        }
    }

    .user-table {
        margin-top: 20px;
        height: 450px;

    }

    .count {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-left: 10px;

        .el-card {
            width: 32%;
            margin-bottom: 20px;
        }

        .icon {
            width: 60px;
            height: 60px;
            margin-left: 5px;
            margin-top: 10px;
            justify-content: center;
            align-items: center;
            border-radius: 80%;
            font-size: 20px;
            text-align: center;
            line-height: 80px;
            color: #fff;
        }

        .detail {
            margin-left: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            margin-top: 12px;
            margin-bottom: 15px;

            .num {

                font-size: 30px;
                margin-bottom: 10px;
            }

            .name {
                font-size: 16px;
                text-align: center;
                color: #999;
            }
        }
    }

    .name {
        font-size: 20px;
    }


    .graph {
        margin-left: 10px;

        .top-echart {
            margin-bottom: 20px;
        }

        .bottom-echart {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;

            .el-card {
                width: 48%;
                height: 260px;
            }
        }
    }

}
</style>
