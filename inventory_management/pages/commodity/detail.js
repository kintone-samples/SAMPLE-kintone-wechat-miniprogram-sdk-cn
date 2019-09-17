const kintoneConfig = require('../../common/kintoneConfig');
const utility = require('../../common/utility');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodityInfo: [
      {name: kintoneConfig.field.commodityName.name, value: ''},
      {name: kintoneConfig.field.commodityNumber.name, value: ''},
      {name: kintoneConfig.field.commoditySize.name, value: ''},
      {name: kintoneConfig.field.commodityPrice.name, value: ''},
      {name: kintoneConfig.field.warehouse.name, value: ''},
      {name: kintoneConfig.field.warehousePosition.name, value: ''},
    ],
    inventoryAmountTitle: kintoneConfig.field.inventoryAmount.name,
    inventoryAmount: '',
    unit: '',
    imageTitle: kintoneConfig.field.image.name,
    imagePath: '',
    loadingTips: '加载中',
    loadingShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const kintoneRecord = utility.kintoneRecordModule();
    const kintoneFile = utility.kintoneFileModule();
    this.setData({id: options.id});

    kintoneRecord.getRecord({app: kintoneConfig.appId, id: options.id}).then((rsp) => {
      console.log(rsp);
      const record = rsp.record;

      this.setData({
        inventoryAmount: utility.checkNull(record[kintoneConfig.field.inventoryAmount.code].value),
        unit: utility.checkNull(record[kintoneConfig.field.unit.code].value),
        commodityInfo: [
          {name: kintoneConfig.field.commodityName.name, value: utility.checkNull(record[kintoneConfig.field.commodityName.code].value)},
          {name: kintoneConfig.field.commodityNumber.name, value: utility.checkNull(record[kintoneConfig.field.commodityNumber.code].value)},
          {name: kintoneConfig.field.commoditySize.name, value: utility.checkNull(record[kintoneConfig.field.commoditySize.code].value)},
          {name: kintoneConfig.field.commodityPrice.name, value: utility.checkNull(record[kintoneConfig.field.commodityPrice.code].value)},
          {name: kintoneConfig.field.warehouse.name, value: utility.checkNull(record[kintoneConfig.field.warehouse.code].value)},
          {name: kintoneConfig.field.warehousePosition.name, value: utility.checkNull(record[kintoneConfig.field.warehousePosition.code].value)},
        ]
      });

      if (record.hasOwnProperty(kintoneConfig.field.image.code) && record[kintoneConfig.field.image.code].value.length > 0) {
        const fileKey = record[kintoneConfig.field.image.code].value[0].fileKey;
        this.setData({loadingShow: true});
        kintoneFile.download({fileKey}).then((r) => {
          this.setData({
            imagePath: r.tempFilePath,
            loadingShow: false
          });
        }).catch(e => {
          console.log(e.get());
          this.setData({loadingShow: true});
        });
      }
    }).catch((err) => {
      // This SDK return err with KintoneAPIExeption
      console.log(err.get());
    });
  },
});