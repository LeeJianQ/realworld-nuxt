import dayjs from 'dayjs'
import Vue from 'vue'

/**
 * 处理时间戳转换函数
 */
Vue.filter('date', (value, format = 'YYYY-MM-DD hh:mm:ss') => {
    return dayjs(value).format(format)
})
