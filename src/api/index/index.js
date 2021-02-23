import axios from 'axios';
export default {
    ajax(params) {
        params.data = JSON.stringify(params.data)
        return axios.post(`/api/open/main`, params)
        // return axios.post(`http://192.168.1.130:8012/api/open/main`, params)
    }
}