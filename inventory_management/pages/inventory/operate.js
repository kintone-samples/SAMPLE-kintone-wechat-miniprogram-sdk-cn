const kintoneConfig = require('../../common/kintoneConfig');
const utility = require('../../common/utility');

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    ],
    buttonLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.cmd = false;
    if (options.hasOwnProperty('cmd') && (options['cmd'] === 'in' || options['cmd'] === 'out')) {
      this.cmd = options['cmd'];
      this.setData({
        cmd: this.cmd,
        inOutDateTitle: `${kintoneConfig.field.inOutDate.name[this.cmd]}`,
        inOutAmountTitle: `${kintoneConfig.field.inOutAmount.name[this.cmd]}`,
        inOutNoteTitle: `${kintoneConfig.field.inOutNote.name}`,
      });
    }

    this.id = options.hasOwnProperty('id') ? options.id : 0;
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
        kintoneRecord.getRecord({app: kintoneConfig.appId, id: this.id}).then(rsp => {
          const record = rsp.record;
          const inventory = utility.checkNull(record[kintoneConfig.field.inventoryAmount.code].value, 0);

          if (this.cmd === 'out' && parseInt(inventory) < parseInt(this.data.formData.inOutAmount)) {
            this.setData({
              error: '库存不足，无法出库'
            });
            this.setData({buttonLoading: false});
            return false;
          }

          const value = {};
          value[kintoneConfig.field.inOutDate.code] = {value: this.data.formData.inOutDate};
          value[kintoneConfig.field.inOutAmount.code] = {value: this.cmd === 'in' ? parseInt(this.data.formData.inOutAmount) : (0 - parseInt(this.data.formData.inOutAmount))};
          value[kintoneConfig.field.inOutNote.code] = {value: this.data.formData.inOutNote};

          const body = {};
          body[kintoneConfig.field.inOutTable.code] = record[kintoneConfig.field.inOutTable.code];
          body[kintoneConfig.field.inOutTable.code].value.push({value: value});

          return kintoneRecord.updateRecordByID({app: kintoneConfig.appId, id: this.id, record: body});
        }).then(rsp => {
          if (rsp) {
            wx.redirectTo({url: `../commodity/detail?id=${this.id}`});
          }
        }).catch(e => {
          console.log(e);
          this.setData({buttonLoading: false});
        });
      }
    });
  },
});