Page({
    feedback: function(){
        tt.openSchema({
            schema: 'https://wenjuan.feishu.cn/m/cfm?t=s4Ihv8ra93ri-euhz',
            external: false,
            success (res) {
                console.log(`res`);
            },
            fail (res) {
                console.log(`reLaunch failure`);
            }
        })
    },
    admin:function(){
      // tt.navigateTo({
      //   url: '/pages/admin/admin' // 指定页面的url
      // });

        tt.request({
          url: 'http://139.9.86.70:8080/miniapp/GetPermisson', // 目标服务器url
          method: 'GET',
          success: (res) => {
            if(res.data.code==200){
                tt.navigateTo({
                  url: '/pages/admin/admin' // 指定页面的url
                });
            }else{
                tt.showModal({
                  title:"提示",
                  content:"您没有此权限",
                  showCancel:false,
                  success: (res) => {
                    
                  }
                });
            }
          }
        });
    }
})