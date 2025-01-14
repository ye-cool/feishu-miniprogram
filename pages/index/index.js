var ms = [
  [
    // 0
    "电子设备",
    "证件",
    "个人物品",
    "学习用品",
    "全部物品",
  ],
  [
    // 1
    [
      // 1 0
      "手机",
      "平板电脑",
      "kindle",
      "笔记本电脑",
      "耳机",
      "充电器/宝/数据线",
      "手表",
      "u盘",
      "鼠标",
      "键盘",
      "触控笔",
      "全部电子设备",
    ],
    [
      // 1 1
      "一卡通",
      "身份证",
      "学生证",
      "健身卡",
      "全部证件",
    ],
    [
      "衣物",
      "包",
      "眼镜",
      "钱包",
      "钥匙",
      "水杯",
      "雨伞",
      "化妆品",
      "首饰",
      "全部个人物品",
    ],
    ["笔袋", "书籍", "笔记本", "全部学习用品"],
    ["查看全部物品"],
  ],
];

var ms2 = [
  [
    // 0
    "宿舍区",
    "教学区",
  ],
  [
    // 1
    [
      // 1 0
      "校内14栋",
      "校内16栋",
    ],
    [
      // 1 1
      "第二教学楼",
      "第四教学楼",
    ],
  ],
];

Page({
  data: {
    multiArray: [
      ["电子设备", "证件", "个人物品", "学习用品", "全部物品"],
      [
        "手机",
        "平板电脑",
        "kindle",
        "笔记本电脑",
        "耳机",
        "充电器",
        "充电宝",
        "数据线",
        "手表",
        "u盘",
        "鼠标",
        "键盘",
        "触控笔",
        "其他",
      ],
    ],
    multiArray2: [
      ["宿舍区", "教学区"],
      ["校内14栋", "校内16栋"],
    ],
    array: ["清水河校区", "沙河校区"],
    index: 0, //校区picker
    multiIndex: [0, 0],
    multiIndex2: [0, 0],
    date: "2021-05-01",
    dateShow: "05-01",
    lost: [],
    showList: true,
  },
  goHelp: function () {
    tt.openSchema({
      schema: "https://uestc.feishu.cn/docs/doccnSaQndJu1oicsWJmyv0Pgmf",
      external: false,
      success(res) {
        console.log(`${res}`);
      },
      fail(res) {
        console.log(`open fail`);
      },
    });
  },
  getPlace: function () {
    let myThis = this;
    tt.request({
      //获取地点列表
      url: "http://139.9.86.70:8080/miniapp/getplaces", // 目标服务器url
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        campus_id: myThis.data.index,
      },
      method: "POST",
      success: (res) => {
        //console.log('get type list',res);
        if (res.data.code == 200) {
          //console.log(JSON.stringify(res.data.data));
          let finalArr = [];
          let arr1 = res.data.data.place1;
          let arr2 = res.data.data.place2;
          finalArr.push(arr1);
          finalArr.push(arr2);
          let dataArr = [];
          dataArr[0] = finalArr[0];
          dataArr[1] = finalArr[1][0];
          console.log(dataArr);
          let dataArr1 = JSON.parse(JSON.stringify(dataArr));
          dataArr1[0].unshift("可选");
          dataArr1[1] = [];
          console.log("arr1", dataArr1);
          myThis.setData({
            multiArray2: dataArr,
          });
          let finalArr1 = JSON.parse(JSON.stringify(finalArr));
          finalArr1[0].unshift("可选");
          finalArr1[1].unshift([]);
          ms2 = finalArr;
          console.log("multiarr", myThis.data.multiArray1);
        }
      },
    });
  },
  getFoundList: function () {
    let myThis = this;
    tt.request({
      url: "http://139.9.86.70:8080/miniapp/getfound", // 目标服务器url
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        type_index: this.data.multiIndex,
        campus_id: this.data.index,
        place: this.data.multiIndex2,
        start_time: this.data.start_time,
        end_time: this.data.end_time,
      },
      success: (res) => {
        console.log(res.data);
        if (res.data.data == "[]") {
          this.setData({
            lost: [],
          });
        } else {
          myThis.setData({
            lost: res.data.data,
          });
        }
      },
    });
  },
  bindDateChange1: function (e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    let myDate = String(e.detail.value).substr(5);
    this.setData({
      start_time: e.detail.value,
      start_timeShow: myDate,
    });
    console.log(e.detail.value);
    this.getFoundList();
  },
  bindDateChange2: function (e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    let myDate = String(e.detail.value).substr(5);
    this.setData({
      end_time: e.detail.value,
      end_timeShow: myDate,
    });
    console.log(e.detail.value);
    this.getFoundList();
  },
  onLoad: function () {
    console.log("Welcome to Mini Code");
  },
  postLostConfirm: function () {
    tt.showModal({
      title: "您希望发送一个失物查询请求",
      content:
        "您的失物还未被拾取，因此没有出现在列表中。符合您填写特征的物品被拾到后，我们将以消息的形式通知您",
      success(res) {
        if (res.confirm) {
          console.log("confirm, continued");
          tt.navigateTo({
            url: `/pages/lost/index`,
            success(res) {
              console.log(`${res}`);
            },
            fail(res) {
              console.log(`navigateTo 调用失败`);
            },
          });
        } else if (res.cancel) {
          console.log("cancel, cold");
        } else {
          // what happend?
        }
      },
      fail(res) {
        console.log(`showModal调用失败`);
      },
    });
  },

  getCode: function () {
    tt.login({
      success(res) {
        console.log(`login 调用成功 ${res.code} `);
        tt.showModal({
          title: "code",
          content: res.code,
        });
      },
      fail(res) {
        console.log(`login 调用失败`);
      },
    });
  },
  bindPickerChange: function (e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    this.setData({
      index: e.detail.value,
    });
    tt.request({
      url: "http://139.9.86.70:8080/miniapp/getfound", // 目标服务器url
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        campus_id: this.data.index,
      },
      method: "POST",
      success: (res) => {
        console.log(res.data);
        this.setData({
          lost: res.data.data,
        });
      },
    });
    this.getPlace();
  },
  bindMultiPickerChange: function (e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    this.setData({
      multiIndex: e.detail.value,
    });
    this.getFoundList();
  },
  bindMultiPickerChange2: function (e) {
    console.log("picker2发送选择改变，携带值为", e.detail.value);
    this.setData({
      multiIndex2: e.detail.value,
    });
    this.getFoundList();
  },
  bindMultiPickerColumnChange: function (e) {
    // return;
    console.log("修改的列为", e.detail.column, "，值为", e.detail.value);
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
    };
    switch (e.detail.column) {
      case 0:
        data.multiIndex[0] = e.detail.value;
        data.multiIndex[1] = 0;
        // data.multiIndex[2] = 0;
        data.multiArray[1] = ms[1][data.multiIndex[0]];
        // data.multiArray[2] = ms[2][data.multiIndex[0]][data.multiIndex[1]];
        break;
      case 1:
        data.multiIndex[1] = e.detail.value;
        // data.multiIndex[2] = 0;
        // data.multiArray[2] = ms[2][data.multiIndex[0]][data.multiIndex[1]];
        break;
      case 2:
        // data.multiIndex[2] = e.detail.value;
        break;
    }
    this.setData({
      multiArray: data.multiArray,
      multiIndex: data.multiIndex,
    });
  },
  bindMultiPickerColumnChange2: function (e) {
    // return;
    console.log("修改的列为", e.detail.column, "，值为", e.detail.value);
    const data = {
      multiArray2: this.data.multiArray2,
      multiIndex2: this.data.multiIndex2,
    };
    switch (e.detail.column) {
      case 0:
        data.multiIndex2[0] = e.detail.value;
        data.multiIndex2[1] = 0;
        // data.multiIndex2[2] = 0;
        data.multiArray2[1] = ms2[1][data.multiIndex2[0]];
        // data.multiArray[2] = ms[2][data.multiIndex[0]][data.multiIndex[1]];
        break;
      case 1:
        data.multiIndex2[1] = e.detail.value;
        // data.multiIndex2[2] = 0;
        // data.multiArray[2] = ms[2][data.multiIndex[0]][data.multiIndex[1]];
        break;
      case 2:
        // data.multiIndex[2] = e.detail.value;
        break;
    }
    this.setData({
      multiArray2: data.multiArray2,
      multiIndex2: data.multiIndex2,
    });
  },

  handleLostTab: function (e) {
    console.log(e.currentTarget.id);
    let app = getApp();
    app.lostInfo = this.data.lost[e.currentTarget.id];
    console.log("global", app.lostInfo);
    tt.navigateTo({
      url: `/pages/lostinfo/lostinfo`,
      success(res) {
        console.log(`${res}`);
      },
      fail(res) {
        console.log(`navigateTo 调用失败`);
      },
    });
  },

  onLoad: function (options) {
    let now = new Date();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let year = now.getFullYear();
    console.log("date", year, month, day);
    if (String(month).length == 1) {
      let nowStr = year + "-" + "0" + month + "-" + day;
      console.log("day str", nowStr);
      let nowShow = "0" + month + "-" + day;
      this.setData({
        start_time: nowStr,
        start_timeShow: nowShow,
        end_time: nowStr,
        end_timeShow: nowShow,
      });
    } else {
      let nowStr = year + "-" + month + "-" + day;
      let nowShow = month + "-" + day;
      console.log("day str", nowStr);
      this.setData({
        start_time: nowStr,
        start_timeShow: nowShow,
        end_time: nowStr,
        end_timeShow: nowShow,
      });
    }
    let launchQuery = tt.getLaunchOptionsSync();
    console.log(launchQuery);
    if (launchQuery.query.lost_id) {
      let app = getApp();
      app.lost_id = launchQuery.query.lost_id;
      app.found_id = launchQuery.query.found_id;
      tt.request({
        url: "http://139.9.86.70:8080/miniapp/getfound", // 目标服务器url
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          id: launchQuery.query.found_id,
        },
        success: (res) => {
          console.log(res.data.data[0]);
          let app = getApp();
          app.lostInfo = res.data.data[0];
          console.log(app.lostInfo);
          tt.navigateTo({
            url: "/pages/lostinfo/lostinfo", // 指定页面的url
          });
        },
      });
      tt.navigateTo({
        url: "", // 指定页面的url
      });
    }
    let myThis = this;
    // 生命周期函数--监听页面加载
    tt.login({
      success(res) {
        console.log(`login 调用成功 ${res.code} `);
        tt.request({
          url: "http://139.9.86.70:8080/minilogin", // 目标服务器url
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: {
            code: res.code,
          },
          success: (res) => {
            console.log(res);
          },
        });
        tt.request({
          //获取物品列表
          url: "http://139.9.86.70:8080/miniapp/gettypes", // 目标服务器url
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
          success: (res) => {
            //console.log('get type list',res);
            if (res.data.code == 200) {
              let finalArr = [];
              let arr1 = res.data.data.type1;
              let arr2 = res.data.data.type2;
              finalArr.push(arr1);
              finalArr.push(arr2);

              let dataArr = [];
              dataArr[0] = finalArr[0];
              dataArr[1] = finalArr[1][0];
              console.log(dataArr);
              myThis.setData({
                multiArray: dataArr,
              });
              ms = finalArr;
              console.log("multiarr", myThis.data.multiArray);
            }
          },
        });
        tt.request({
          url: "http://139.9.86.70:8080/miniapp/getfound", // 目标服务器url
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: {
            campus_id: myThis.data.index,
          },
          method: "POST",
          success: (res) => {
            console.log(res.data);
            myThis.setData({
              lost: res.data.data,
            });
          },
        });

        tt.request({
          //获取地点列表
          url: "http://139.9.86.70:8080/miniapp/getplaces", // 目标服务器url
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: {
            campus_id: myThis.data.index,
          },
          method: "POST",
          success: (res) => {
            //console.log('get type list',res);
            if (res.data.code == 200) {
              //console.log(JSON.stringify(res.data.data));
              let finalArr = [];
              let arr1 = res.data.data.place1;
              let arr2 = res.data.data.place2;
              finalArr.push(arr1);
              finalArr.push(arr2);
              let dataArr = [];
              dataArr[0] = finalArr[0];
              dataArr[1] = finalArr[1][0];
              console.log(dataArr);
              let dataArr1 = JSON.parse(JSON.stringify(dataArr));
              dataArr1[0].unshift("可选");
              dataArr1[1] = [];
              console.log("arr1", dataArr1);
              myThis.setData({
                multiArray2: dataArr,
              });
              let finalArr1 = JSON.parse(JSON.stringify(finalArr));
              finalArr1[0].unshift("可选");
              finalArr1[1].unshift([]);
              ms2 = finalArr;
              console.log("multiarr", myThis.data.multiArray1);
            }
          },
        });
      },
      fail(res) {
        console.log(`login 调用失败`);
      },
    });
  },

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },

  onShow: function () {
    // 生命周期函数--监听页面显示
    console.log("我是multiArray2" + this.data.multiArray2);
    let myThis = this;
    tt.request({
      url: "http://139.9.86.70:8080/miniapp/getfound", // 目标服务器url
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        campus_id: myThis.data.index,
      },
      method: "POST",
      success: (res) => {
        console.log(res.data);
        myThis.setData({
          lost: res.data.data,
        });
      },
    });
  },

  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },

  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },

  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },

  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },

  onShareAppMessage: function () {
    // 用户点击右上角分享

    return {
      title: "title", // 分享标题

      desc: "desc", // 分享描述

      path: "path", // 分享路径
    };
  },
});
