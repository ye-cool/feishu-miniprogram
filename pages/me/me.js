Page({
    data:{
        nickName:"",
        avatarUrl:"",
        myInfo: undefined
    },
    goMore:function(){
      tt.navigateTo({
        url: '/pages/more/more' // 指定页面的url
      });
    },
    handleFoundDetail: function(e){
        console.log(e.currentTarget.dataset.foundid);
        console.log(e.currentTarget.dataset.ismatch);
        tt.request({
            url: 'http://139.9.86.70:8080/miniapp/me', // 目标服务器url
            method: 'POST',
            header:{
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:{
                'FoundId':e.currentTarget.dataset.foundid
            },
            success: (res) => {
              console.log(res.data);
              let app=getApp();
              app.matchInfo=res.data.data;
              app.match=e.currentTarget.dataset.ismatch

                  tt.navigateTo({
                      url: '/pages/matched/matched', // 指定页面的url
                      fail (res) {
                        console.log(`navigateTo 调用失败`,res);
                    }
                    });

  
            }
          });
    },
    handleDetail: function(e){
        console.log(e.currentTarget.dataset.lostid);
        console.log(e.currentTarget.dataset.ismatch);
        let myObj={};
        if(e.currentTarget.dataset.ismatch){
          myObj["MatchId"]=e.currentTarget.dataset.lostid;
        }else{
          myObj["LostId"]=e.currentTarget.dataset.lostid
        }

        tt.request({
          url: 'http://139.9.86.70:8080/miniapp/me', // 目标服务器url
          method: 'POST',
          header:{
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data:myObj,
          success: (res) => {
            console.log(res.data);
            let app=getApp();
            app.matchInfo=res.data.data;
            app.match=e.currentTarget.dataset.ismatch
            if(e.currentTarget.dataset.ismatch){
                tt.navigateTo({
                    url: '/pages/matched/matched', // 指定页面的url
                    fail (res) {
                      console.log(`navigateTo 调用失败`,res);
                  }
                  });
            }else{
                app.notmatchInfo=res.data.data
                tt.navigateTo({
                  url: '/pages/notmatch/notmatch' // 指定页面的url
                });
            }

          }
        });
    },
    onShow: function() {
      // Do something when page show.
      let myThis=this;
      tt.request({
        url: 'http://139.9.86.70:8080/miniapp/me', // 目标服务器url
        method:'GET',
        success: (res) => {
          if(res.data.code==200){
              myThis.setData({
                myInfo:res.data.data
              })
          }
        }
      });
    },
    onLoad: function(options){
        let myThis=this;
        tt.getUserInfo({
            success(res) {
                var userInfo = res.userInfo;
                myThis.setData({
                    nickName:userInfo.nickName,
                    avatarUrl:userInfo.avatarUrl
                })
                console.log(userInfo);
            },
            fail (res) {
                console.log(`getUserInfo 调用失败`);
            }
        })
        tt.request({
          url: 'http://139.9.86.70:8080/miniapp/me', // 目标服务器url
          method:'GET',
          success: (res) => {
            if(res.data.code==200){
                myThis.setData({
                    myInfo:res.data.data
                })
            }
          }
        });
    }
})