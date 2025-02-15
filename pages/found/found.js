var ms1 = [
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
    ["搜索全部物品"],
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
      "14栋",
      "16栋",
    ],
    [
      // 1 1
      "二教",
      "三教",
    ],
  ],
];
var ms3 = [
  [
    // 0
    "可选",
    "宿舍区",
    "教学区",
  ],
  [
    // 1
    [],
    [
      // 1 0
      "14",
      "16",
    ],
    [
      // 1 1
      "二",
      "四",
    ],
  ],
];
var ms4 = [
  [
    // 0
    "可选",
    "宿舍区",
    "教学区",
  ],
  [
    // 1
    [],
    [
      // 1 0
      "14",
      "16",
    ],
    [
      // 1 1
      "二",
      "四",
    ],
  ],
];

Page({
  data: {
    items: [
      { value: "0", name: "清水河校区", checked: "true" },
      { value: "1", name: "沙河校区" },
    ],
    items2: [
      { value: "0", name: "留在原地", checked: "true" },
      { value: "1", name: "自行带走" },
      { value: "2", name: "放在别处" },
    ],
    ratioVal: 1,
    ratioVal2: 0,
    multiArray1: [
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
      ["14栋", "16栋"],
    ],
    array: ["上午", "下午", "晚上"],
    index: 0,
    multiIndex1: [0, 0],
    multiIndex2: [0, 0],
    date: "2021-05-01",
    dateShow: "05-01",
    time: "12:01",
    timeStart: "00:00",
    timeEnd: "23:59",
    typeDetail: "",
    placeDetail: "",
    imgPreview: [],
    identify: "",
    otherPlace: "",
    more: "",
    toView: null,
    isSubmit: false,
  },
  myAlert: function (msg) {
    tt.showModal({
      title: "提示",
      content: msg,
      showCancel: false,
      success: (res) => {},
    });
  },
  scrollBottom: function (id) {
    this.setData({
      toView: id,
    });
    console.log(this.data.toView);
  },
  submit: function () {
    this.setData({
      isSubmit: true,
    });
    setTimeout(() => {
      console.log(2);

      this.setData({ isSubmit: false });
    }, 3000);
    let upForm = {
      type_index: this.data.multiIndex1,
      place_index: this.data.multiIndex2,
      campus_id: this.data.ratioVal,
      current_place: this.data.ratioVal2,
    };
    if (this.data.typeDetail == "") {
      this.myAlert("尚未填写物品详情");
      this.scrollBottom("demo1");
      return;
    }
    if (this.data.placeDetail == "") {
      this.myAlert("尚未填写地点详情");
      this.scrollBottom("demo2");
      return;
    }
    if (this.data.ratioVal2 == 2 && this.data.otherPlace == "") {
      this.myAlert("尚未填写放置地点");
      return;
    }
    upForm["info"] = this.data.typeDetail;
    upForm["place_detail"] = this.data.placeDetail;
    if (this.data.ratioVal2 == 2) {
      upForm["current_place_detail"] = this.data.otherPlace;
    }
    if (this.data.identify != "") {
      upForm["loster_info"] = this.data.identify;
    }
    if (this.data.more != "") {
      upForm["additional_info"] = this.data.more;
    }
    let imgArr = [];
    let myThis = this;
    console.log(this.data.imgPreview);
    for (let i = 0; i < myThis.data.imgPreview.length; i++) {
      tt.uploadFile({
        url: "http://139.9.86.70:8080/miniapp/uploadimg",
        filePath: myThis.data.imgPreview[i],
        name: "image",
        success(res) {
          if (res.statusCode === 200) {
            // console.log(`uploadFile 调用成功 ${res.data}`);
            let tmp = JSON.parse(res.data);
            let path = tmp.data.path;
            imgArr.push(path);
            console.log(imgArr);
            if (i == myThis.data.imgPreview.length - 1) {
              //finish uploading
              upForm["image"] = imgArr;
              tt.request({
                url: "http://139.9.86.70:8080/miniapp/addfound", // 目标服务器url
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                method: "POST",
                data: upForm,
                success: (res) => {
                  //init form
                  if (res.data.code == 200) {
                    myThis.setData({
                      multiIndex1: [0, 0],
                      multiIndex2: [0, 0],
                      typeDetail: "",
                      placeDetail: "",
                      imgPreview: [],
                      identify: "",
                      more: "",
                      otherPlace: "",
                    });
                    tt.showModal({
                      title: "提示",
                      content: "提交成功",
                      showCancel: false,
                      success: (res) => {
                        if (res.confirm) {
                          tt.reLaunch({
                            url: "/pages/index/index", // 指定页面的url
                          });
                        } else if (res.cancel) {
                          tt.reLaunch({
                            url: "/pages/index/index", // 指定页面的url
                          });
                        }
                      },
                    });
                  }
                },
              });
            }
          }
        },
        fail(res) {
          console.log(`uploadFile 调用失败`);
        },
      });
    }
  },
  moreInfo: function (e) {
    this.setData({
      more: e.detail.value,
    });
  },
  handelOtherPlace: function (e) {
    this.setData({
      otherPlace: e.detail.value,
    });
  },
  handleDelImg: function (e) {
    console.log(e.target.id);
    let arr = this.data.imgPreview;
    let myThis = this;
    tt.showModal({
      title: "提示",
      content: "删除这张图片？",
      success(res) {
        if (res.confirm) {
          arr.splice(e.target.id, 1);
          myThis.setData({
            imgPreview: arr,
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
  handleUpload: function () {
    let myThis = this;
    tt.chooseImage({
      sourceType: ["album"],
      count: 1,
      sizeType: ["original", "compressed"],
      success: (res) => {
        console.log(res.tempFilePaths);
        let arr = myThis.data.imgPreview;
        if (arr.length < 3) {
          arr.push(res.tempFilePaths[0]);
          myThis.setData({
            imgPreview: arr,
          });
        } else {
          tt.showToast({
            title: "最多添加三张图片",
            icon: "none",
            duration: 2000,
            success(res) {
              console.log(`${res}`);
            },
            fail(res) {
              console.log(`showToast 调用失败`);
            },
          });
        }
      },
    });
  },
  handelIdentify: function (e) {
    this.setData({
      identify: e.detail.value,
    });
  },
  handelTypeDetail: function (e) {
    console.log(e.detail.value);
    this.setData({
      typeDetail: e.detail.value,
    });
  },
  handelPlaceDetail: function (e) {
    this.setData({
      placeDetail: e.detail.value,
    });
  },

  radioChange2: function (e) {
    console.log("Radio 发生 change 事件，value 值为：", e.detail.value);
    var items = this.data.items2;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value;
    }
    this.setData({
      items2: items,
      ratioVal2: e.detail.value,
    });
  },

  radioChange: function (e) {
    console.log("Radio 发生 change 事件，value 值为：", e.detail.value);
    var items = this.data.items;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value;
    }
    this.setData({
      items: items,
      ratioVal: e.detail.value,
    });
    let myThis = this;
    tt.request({
      //获取地点列表
      url: "http://139.9.86.70:8080/miniapp/getplaces", // 目标服务器url
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        campus_id: e.detail.value,
      },
      method: "POST",
      success: (res) => {
        //console.log('get type list',res);
        if (res.data.code == 200) {
          let finalArr = [];
          let arr1 = res.data.data.place1;
          let arr2 = res.data.data.place2;
          finalArr.push(arr1);
          finalArr.push(arr2);

          let dataArr = [];
          dataArr[0] = finalArr[0];
          dataArr[1] = finalArr[1][0];
          console.log(dataArr);
          myThis.setData({
            multiArray2: dataArr,
            multiArray3: dataArr,
            multiArray4: dataArr,
          });
          ms2 = finalArr;
          ms3 = finalArr;
          ms4 = finalArr;
          console.log("multiarr", myThis.data.multiArray1);
        }
      },
    });
  },
  // bindTimeChange: function (e) {
  //   console.log('time picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //       time: e.detail.value
  //   })
  // },
  bindMultiPickerChange1: function (e) {
    console.log("picker1发送选择改变，携带值为", e.detail.value);
    this.setData({
      multiIndex1: e.detail.value,
    });
  },
  bindMultiPickerChange2: function (e) {
    console.log("picker2发送选择改变，携带值为", e.detail.value);
    this.setData({
      multiIndex2: e.detail.value,
    });
  },
  // bindMultiPickerChange3: function (e) {
  //     console.log('picker3发送选择改变，携带值为', e.detail.value)
  //     this.setData({
  //         multiIndex3: e.detail.value
  //     })
  // },
  // bindMultiPickerChange4: function (e) {
  //     console.log('picker4发送选择改变，携带值为', e.detail.value)
  //     this.setData({
  //         multiIndex4: e.detail.value
  //     })
  // },
  bidMultiPickerColumnChange1: function (e) {
    // return;
    console.log("修改的列为", e.detail.column, "，值为", e.detail.value);
    var data = {
      multiArray1: this.data.multiArray1,
      multiIndex1: this.data.multiIndex1,
    };
    switch (e.detail.column) {
      case 0:
        data.multiIndex1[0] = e.detail.value;
        data.multiIndex1[1] = 0;
        // data.multiIndex1[2] = 0;
        data.multiArray1[1] = ms1[1][data.multiIndex1[0]];
        // data.multiArray[2] = ms[2][data.multiIndex[0]][data.multiIndex[1]];
        break;
      case 1:
        data.multiIndex1[1] = e.detail.value;
        // data.multiIndex1[2] = 0;
        // data.multiArray[2] = ms[2][data.multiIndex[0]][data.multiIndex[1]];
        break;
      case 2:
        // data.multiIndex[2] = e.detail.value;
        break;
    }
    this.setData(data);
  },
  bidMultiPickerColumnChange2: function (e) {
    // return;
    console.log("修改的列为", e.detail.column, "，值为", e.detail.value);
    var data = {
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
    this.setData(data);
  },

  onLoad: function (options) {
    let myThis = this;
    // 生命周期函数--监听页面加载
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
            multiArray1: dataArr,
          });
          ms1 = finalArr;
          console.log("multiarr", myThis.data.multiArray1);
        }
      },
    });

    tt.request({
      //获取地点列表
      url: "http://139.9.86.70:8080/miniapp/getplaces", // 目标服务器url
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        campus_id: "0",
      },
      method: "POST",
      success: (res) => {
        //console.log('get type list',res);
        if (res.data.code == 200) {
          let finalArr = [];
          let arr1 = res.data.data.place1;
          let arr2 = res.data.data.place2;
          finalArr.push(arr1);
          finalArr.push(arr2);

          let dataArr = [];
          dataArr[0] = finalArr[0];
          dataArr[1] = finalArr[1][0];
          console.log(dataArr);
          myThis.setData({
            multiArray2: dataArr,
            multiArray3: dataArr,
            multiArray4: dataArr,
          });
          ms2 = finalArr;
          ms3 = finalArr;
          ms4 = finalArr;
          console.log("multiarr", myThis.data.multiArray1);
        }
      },
    });
  },

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },

  onShow: function () {
    // 生命周期函数--监听页面显示
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
