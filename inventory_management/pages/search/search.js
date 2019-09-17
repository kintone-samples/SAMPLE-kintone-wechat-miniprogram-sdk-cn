const kintoneConfig = require('../../common/kintoneConfig');
const utility = require('../../common/utility');

Page({
  data: {
    slideButtons: [
      {
        text: '入库',
        data: 'in',
        extClass: 'slideButton_in',
      },
      {
        text: '出库',
        data: 'out',
        extClass: 'slideButton_out',
      },
      {
        text: '删除',
        data: 'delete',
        type: 'warn'
      }
    ],
    dialogShow: false,
    dialogButtons: [
      {text: '取消'},
      {text: '确定'}
    ],
    loadingShow: false,
    triggerSearch: false
  },

  onLoad() {
    this.setData({
      search: this.search.bind(this),
    });
  },

  search: function(value) {
    const params = {
      app: kintoneConfig.appId,
      query: (value.length > 0 ? `${kintoneConfig.field.commodityName.code} like "${value}" ` : '') + 'order by $id asc',
      fields: [
        '$id',
        kintoneConfig.field.commodityName.code,
        kintoneConfig.field.inventoryAmount.code,
        kintoneConfig.field.unit.code,
        kintoneConfig.field.warehouse.code,
        kintoneConfig.field.warehousePosition.code,
        kintoneConfig.field.inOutTable.code,
      ],
      totalCount: true
    };
    const kintoneRecord = utility.kintoneRecordModule();
    return kintoneRecord.getAllRecordsByQuery(params).then((rsp) => {
      console.log(rsp);
      const records = rsp.records;
      let result = [];
      for (let i = 0; i < records.length; i++) {
        result.push({
          id: records[i]['$id']['value'],
          record: [
            [`${utility.checkNull(records[i][kintoneConfig.field.commodityName.code]['value'])}`,
              `× ${utility.checkNull(records[i][kintoneConfig.field.inventoryAmount.code]['value'], 0)}` +
              ` ${utility.checkNull(records[i][kintoneConfig.field.unit.code]['value'])}`],
            [`${kintoneConfig.field.warehouse.name}：`, `${utility.checkNull(records[i][kintoneConfig.field.warehouse.code]['value'])}`],
            [`${kintoneConfig.field.warehousePosition.name}：`, `${utility.checkNull(records[i][kintoneConfig.field.warehousePosition.code]['value'])}`]
          ],
        });
      }
      return result;
    }).catch((err) => {
      console.log(err.get());
      return [];
    });
  },

  selectResult: function(e) {
    const id = e.detail.item.id;
    wx.navigateTo({url: `../commodity/detail?id=${id}`});
  },

  slideButtonTap: function(e) {
    const id = e.detail.item.id;
    const cmd = e.detail.data;
    if (cmd === 'delete') {
      this.setData({
        deleteItemId: id,
        dialogTitle: e.detail.item.record[0][0],
        dialogShow: true,
        dialogButtons: [
          {text: '取消'},
          {text: '确定', data: {id: id}}
        ],
      });
    } else {
      wx.navigateTo({url: `../inventory/operate?cmd=${cmd}&id=${id}`});
    }
  },

  addButtonTap: function(e) {
    wx.navigateTo({url: '../commodity/add'});
  },

  dialogButtonTap: function(e) {
    if (e.detail.index === 1 && e.detail.item.text === '确定') {
      this.setData({
        loadingShow: true,
      });

      const params = {
        app: kintoneConfig.appId,
        ids: [e.detail.item.data.id]
      };
      const kintoneRecord = utility.kintoneRecordModule();
      kintoneRecord.deleteRecords(params).then(rsp => {
        this.setData({
          dialogShow: false,
          loadingShow: false,
          triggerSearch: true
        });
      }).catch(e => {
        console.log(e);
      });
    } else {
      this.setData({
        dialogShow: false,
      });
    }
  },
});