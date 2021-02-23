export default {
    methods: {
        gotoTabbar(path) {
            if (window.__wxjs_environment === "miniprogram") {
                if (path == "/my") {
                    wx.miniProgram.reLaunch({
                        url: `/pages/my/my`
                    });
                } else if (path == "/index") {
                    wx.miniProgram.reLaunch({
                        url: `/pages/index/index`
                    });
                }
            } else {
                this.$router.push({
                    path: path
                });
            }
        },
        gotoh5share(path, type) {
            if (window.__wxjs_environment === "miniprogram") {
                let origin = location.origin;
                if (type == 'reLaunch') {
                    wx.miniProgram.reLaunch({
                        url: `/pages/h5share/h5share?url=${origin}/#${path}`
                    });
                } else if (type == 'redirectTo') {
                    wx.miniProgram.redirectTo({
                        url: `/pages/h5share/h5share?url=${origin}/#${path}`
                    });
                } else {
                    wx.miniProgram.navigateTo({
                        url: `/pages/h5share/h5share?url=${origin}/#${path}`
                    });
                }
            } else {
                this.$router.push({
                    path: path
                });
            }
        },
        goto(path, type) {
            if (window.__wxjs_environment === "miniprogram") {
                let origin = location.origin;
                if (type == 'reLaunch') {
                    wx.miniProgram.reLaunch({
                        url: `/pages/h5/h5?weburl=${origin}/#${path}`
                    });
                } else if (type == 'redirectTo') {
                    wx.miniProgram.redirectTo({
                        url: `/pages/h5/h5?weburl=${origin}/#${path}`
                    });
                } else {
                    wx.miniProgram.navigateTo({
                        url: `/pages/h5/h5?weburl=${origin}/#${path}`
                    });
                }
            } else {
                this.$router.push({
                    path: path
                });
            }
        },

    },
    filters: {
        _formatNumPoint(num) {
            let str = num.toString().split('.');
            return (str[1] ? ('.' + str[1]) : null);
        },
        _formatNum(num) {
            let str = num.toString().split('.');
            return str[0]
        },
        showTime(str){
            if(str){
                return str.slice(0, 10)
            }else{
                return ''
            }
        }
    }
}