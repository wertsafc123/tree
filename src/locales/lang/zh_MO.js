export default {
  title: 'WeMust 通訊錄',
  header: {
    title: '通訊錄',
  },
  menu: {
    exit: '退出系統',
  },
  base: {
    create: '新建',
    home: '首頁',
    approval: '審批',
    document: '公文',
    apply: '應用',
    addressBook: '通訊錄',

    departmentEidt: '编辑用户',
    actionSuccess: '操作成功',
    addTeam: '新建小組',
    editTeam: '编辑小組',

    contacts: '最近聯繫人',
    note: '注：发送公文时的收件人和抄送人显示在此页面',
  },
  tab: {
    department: '部門',
    team: '我的小組',
    contacts: '最近聯繫人',
  },
  action: {
    exportTable: '导出',
    allClose: '全部收起',
    allOpen: '全部展开',
    advancedSearch: '高級搜索',
    search: '搜索',
    clear: '清空',
    edit: '編輯',
    addGroup: '新建小組',
    del: '刪除',
    simpleSearch: '簡易搜索',

    save: '提交',
    cancel: '取消',
  },
  label: {
    userName: '姓名',
    nameZh: '中文名稱',
    nameEn: '英文名稱',
    email: '郵箱',
    roomNo: '房號（辦公室）',
    extNo: '內部熱線',
    position: '職務',
    staffNo: '工號',
    professional: '職稱',
    action: '操作',

    groupName: '小组中文名稱',
    groupEnName: '小组英文名稱',
  },
  placeholder: {
    keyword: '請輸入關鍵字',
    userName: '請輸入姓名',
    nameZh: '請輸入中文名稱',
    nameEn: '請輸入英文名稱',
    email: '請輸入郵箱',
    roomNo: '請輸入房號',
    extNo: '請輸入內部熱線',
    position: '請輸入職務',
    staffNo: '請輸入工號',
    professional: '請輸入職稱',

    groupName: '請輸入小组中文名稱',
    groupEnName: '請輸入小组英文名稱',

    application: '請輸入應用名稱',
  },
  rule: {
    keyword: '請輸入關鍵字',
    name: '請輸入中文名稱',
    nameZh: '請輸入中文名稱',
    mobile: '請輸入內部熱線',

    groupName: '請輸入小组中文名稱',
    groupEnName: '請輸入小组英文名稱',

    email: '請輸入正確的郵箱',
    enName: '請輸入英文名稱',
    selectPeople: '請選擇人員',

    tooManyPerson: '选择的人数不能超过 {n} 人',
  },
  btns: {
    clearAll: '清空',
    confirm: '確定',
    cancel: '取消',
  },
  tips: {
    title: '提示',
    export: '导出中...',
    advancedSearch: '请至少输入一项',
    noData: '暫無數據',
    clear: '确定要清空吗？',
    loading: '数据加载中，请稍后操作...',
    del: '确定要删除吗？',
  },
  approval: {
    creater: '創建人',
    lastModify: '最後編輯時間',
    status: '狀態',
    operate: '操作',
    selected: '已選擇',
    person: '人',
    search: '搜索',
  },
  error: {
    ajax: {
      ERRCODE_UNKNOWN_ERROR: '未知錯誤',
      ERRCODE_NOT_SUPPORT_ERROR: '不支持',
      ERRCODE_MAINTENANCE: '服務正在維護中，請稍候重試',
      MISSING_FIELD: '字段缺失',
      INVALID_FIELD: '無效的字段',
      INVAILD_FORMAT_ERROR: '無效的數據返回格式',
      INVAILD_USER_TYPE_ERROR: '無效的用戶類型',
      REQUEST_TIMEOUT_ERROR: '請求超時，請稍候重試',
    },
    tips: {
      GROUP_NAME_OR_ENNAME_ALREADY_EXISTS: '群組名或英文名已存在',
    },
  },
  table: {
    emptyText: '暫無數據',
  },
};
