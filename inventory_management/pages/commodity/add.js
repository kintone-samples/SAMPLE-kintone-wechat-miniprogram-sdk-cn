const kintoneConfig = require('../../common/kintoneConfig');
const utility = require('../../common/utility');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    warehouses: ["上海A", "上海B", "苏州", "无锡"],
    warehouseIndex: 0,
    warehousePositions: ["1-1", "1-2", "2-1", "2-2"],
    warehousePositionIndex: 0,
    inOutDate: `${utility.formatDate(new Date())}`,
    formData: {
      inOutDate: `${utility.formatDate(new Date())}`,
    },
    rules: [
      {
        name: 'inOutDate',
        rules: [{required: true, message: '日期必填'}],
      },
      { // 多个规则
        name: 'inOutAmount',
        rules: [{required: true, message: '数量必填'}, {
          validator: (rule, value, param, models) => {
            var regPos = /^\d+$/; // 非负整数
            if (!regPos.test(value)) {
              return rule.message;
            }
          },
          message: '数量格式不对',
          valid: true,
        }],
      },
      {
        name: 'commodityName',
        rules: [{required: true, message: '商品名称必填'}]
      },
    ],
    commodityNameTitle: kintoneConfig.field.commodityName.name,
    commodityNumberTitle: kintoneConfig.field.commodityNumber.name,
    inOutDateTitle: kintoneConfig.field.inOutDate.name.in,
    inOutAmountTitle: kintoneConfig.field.inOutAmount.name.in,
    unitTitle: kintoneConfig.field.unit.name,
    inOutNoteTitle: kintoneConfig.field.inOutNote.name,
    warehouseTitle: kintoneConfig.field.warehouse.name,
    warehousePositionTitle: kintoneConfig.field.warehousePosition.name,
    commoditySizeTitle: kintoneConfig.field.commoditySize.name,
    commodityPriceTitle: kintoneConfig.field.commodityPrice.name,
    imageTitle: kintoneConfig.field.image.name,
    buttonLoading: false,
  },

  onLoad() {
    this.setData({
      uploadFile: this.uploadFile.bind(this)
    });
  },

  formDateChange: function(e) {
    this.setData({
      inOutDate: e.detail.value,
    });
    this.formInputChange(e);
  },

  formInputChange: function(e) {
    const {field} = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  warehouseChange: function(e) {
    this.setData({
      warehouseIndex: e.detail.value,
    });
  },

  warehousePositionChange: function(e) {
    this.setData({
      warehousePositionIndex: e.detail.value
    });
  },

  fileKey: '',
  uploadFile: function(files) {
    console.log('upload files', files);

    const kintoneFile = utility.kintoneFileModule();
    return kintoneFile.upload({filePath: files.tempFilePaths[0]}).then(rsp => {
      this.fileKey = rsp.fileKey;
      return {urls: files.tempFilePaths};
    }).catch(e => {
      console.log(e.get());
    });
  },
  deleteFile: function() {
    this.fileKey = '';
  },

  submitForm: function() {
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors);
      if (!valid) {
        const firstError = Object.keys(errors);
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          });
        }
      } else {
        this.setData({buttonLoading: true});

        const kintoneRecord = utility.kintoneRecordModule();

        const record = {};
        record[kintoneConfig.field.commodityName.code] = {value: this.data.formData.commodityName};
        record[kintoneConfig.field.commodityNumber.code] = {value: this.data.formData.commodityNumber};
        record[kintoneConfig.field.warehouse.code] = {value: this.data.warehouses[this.data.warehouseIndex]};
        record[kintoneConfig.field.warehousePosition.code] = {value: this.data.warehousePositions[this.data.warehousePositionIndex]};
        record[kintoneConfig.field.commoditySize.code] = {value: this.data.formData.commoditySize};
        record[kintoneConfig.field.commodityPrice.code] = {value: this.data.formData.commodityPrice};
        record[kintoneConfig.field.unit.code] = {value: this.data.formData.unit};
        if (this.fileKey.length > 0) {
          record[kintoneConfig.field.image.code] = {value: [{fileKey: this.fileKey}]};
        }

        const value = {};
        value[kintoneConfig.field.inOutDate.code] = {value: this.data.formData.inOutDate};
        value[kintoneConfig.field.inOutAmount.code] = {value: parseInt(this.data.formData.inOutAmount)};
        value[kintoneConfig.field.inOutNote.code] = {value: this.data.formData.inOutNote};
        record[kintoneConfig.field.inOutTable.code] = {value: [{value: value}]};
        kintoneRecord.addRecord({app: kintoneConfig.appId, record: record}).then(rsp => {
          wx.redirectTo({url: `../commodity/detail?id=${rsp.id}`});
        }).catch(e => {
          console.log(e.get());
          this.setData({buttonLoading: false});
        });
      }
    });
  },
});