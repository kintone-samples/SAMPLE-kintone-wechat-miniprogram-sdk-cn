module.exports = {
  domain: 'xxx.cybozu.cn', //kintone的domain地址
  username: 'xxx', // kintone的用户名
  password: 'xxx', // 登录密码
  appId: 'xxx', // "商品库存管理"应用的ID
  field: {
    warehouse: {name: '仓库', code: '所属仓库'},
    warehousePosition: {name: '库位', code: '所属库位'},
    commodityName: {name: '商品名称', code: '商品名称'},
    commodityNumber: {name: '商品编号', code: '商品编号'},
    commoditySize: {name: '规格', code: '规格'},
    commodityPrice: {name: '预售价格', code: '预售价格'},
    inOutTable: {name: '出入库情况', code: '出入库情况'},
    inOutAmount: {name: {in: '入库数量', out: '出库数量'}, code: '出入库数量'},
    inOutDate: {name: {in: '入库日期', out: '出库日期'}, code: '出入库日期'},
    inOutNote: {name: '备注', code: '备注'},
    inventoryAmount: {name: '库存数量', code: '库存数量'},
    unit: {name: '单位', code: '单位'},
    image: {name: '照片', code: '照片'},
  },
};
