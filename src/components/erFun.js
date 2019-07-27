function copy(data) {
  return JSON.parse(JSON.stringify(data));
}
export default class erFun {
  constructor() {
    this.stack = [];
    this.nowId = 0;
  }
  pushStack(data) {
    this.stack.push(data);
  }
  getId() {
    this.nowId += 1;
    return this.nowId;
  }
  changeStructrue(arr) { // 把后台得到的数组结构转为基础树形结构备用
    let data = {};
    arr.forEach(item => {
      if (item.nodeType === 'condition') {
        // eslint-disable-next-line
        item.checkVal = [];
        if (item.isEnableApplicants) {
          item.checkVal.push('1');
        }
        if (item.isEnableLeaveType) {
          item.checkVal.push('2');
        }
        let ar = [];
        if (item.isEnableDaysRule) {
          item.checkVal.push('3');
          const str = item.daysRule;
          if (str) {
            ar = str.split(':');
            if (ar[0] === 'bw') {
              console.log(ar);
              const iarr = ar[2].split('-');
              ar.splice(2, 1, ...iarr);
            }
          }
        }
        // eslint-disable-next-line
        item.ruleArr = ar;
      }
      if (item.parentId) {
        // eslint-disable-next-line
        item.parentId = parseInt(item.parentId);
        this.insertNode(data, item);
      } else {
        data = item;
      }
      if (item.id >= this.nowId) {
        this.nowId = item.id + 1;
      }
    });
    console.log(data);
    return data;
  }
  addChildNode(d, obj) {
    // eslint-disable-next-line
    obj.id = this.getId();
    const data = JSON.parse(JSON.stringify(d));
    this.myAddChildNode(data, obj);
    return data;
  }
  delNode(data, obj) {
    if (!obj.parentId) {
      if (obj.next) {
        // eslint-disable-next-line
        data = obj.next;
        // eslint-disable-next-line
        data.parentId = null;
      } else {
        // eslint-disable-next-line
        data = null;
      }
    } else {
      this.myDelChildNode(data, obj, data);
    }
    return data;
  }
  myDelChildNode(d, obj, tree) {
    const data = d;
    if (data.id === obj.parentId) {
      if (obj.nodeType !== 'condition') {
        if (obj.next) {
          // eslint-disable-next-line
          data.next = copy(obj.next);
          // eslint-disable-next-line
          data.next.parentId = data.id;
        } else {
          data.next = null;
        }
      } else {
        data.child.forEach((i, k) => {
          if (i.id === obj.id) {
            data.child.splice(k, 1);
          }
        });
        if (data.child.length === 0) {
          this.delNode(tree, data);
        }
      }
    } else {
      if (data.next) {
        this.myDelChildNode(data.next, obj, tree);
      }
      if (data.child) {
        data.child.forEach(i => {
          this.myDelChildNode(i, obj, tree);
        });
      }
    }
  }
  myAddChildNode(d, obj) {
    const data = d;
    if (obj.nodeType === 'conditionEnter') {
      // eslint-disable-next-line
      obj.child = [];
      let i = 0;
      while (i < 2) {
        obj.child.push({
          nodeType: 'condition',
          parentId: obj.id,
          id: this.getId(),
          checkVal: [],
          ruleArr: [],
        });
        i += 1;
      }
    }
    if (data.id === obj.parentId) {
      if (obj.nodeType !== 'condition') {
        if (data.next) {
          // eslint-disable-next-line
          obj.next = copy(data.next);
          // eslint-disable-next-line
          obj.next.parentId = obj.id;
          data.next = obj;
        } else {
          data.next = obj;
        }
      } else {
        // eslint-disable-next-line
        obj.checkVal = [];
        // eslint-disable-next-line
        obj.ruleArr = [];
        data.child.push(obj);
      }
    } else {
      if (data.next) {
        this.myAddChildNode(data.next, obj);
      }
      if (data.child) {
        data.child.forEach(i => {
          this.myAddChildNode(i, obj);
        });
      }
    }
  }
  insertNode(d, item) { // 插入节点
    const data = d;
    if (data.id === item.parentId) {
      if (item.nodeType !== 'condition') { // 不是条件节点
        data.next = item;
      } else { // 是条件节点
        // eslint-disable-next-line
        if (data.child) {
          data.child.push(item);
        } else {
          data.child = [item];
        }
      }
    } else {
      if (data.next) {
        this.insertNode(data.next, item);
      }
      if (data.child) {
        data.child.forEach(i => {
          this.insertNode(i, item);
        });
      }
    }
  }
  changeBroPos(d, pId, id, cid) { // 更换节点在兄弟集合中的位置
    const data = JSON.parse(JSON.stringify(d));
    // eslint-disable-next-line
    this.myChangeBroPos(data, pId, id, cid);
    return data;
  }
  // eslint-disable-next-line
  myChangeBroPos(d, pId, id, cid) { // 更换节点位置
    const data = d;
    if (data.id === pId) {
      // data.child.
      const obj = data.child.splice(id, 1);
      data.child.splice(cid, 0, obj[0]);
    } else {
      if (data.child) {
        data.child.forEach(i => {
          this.myChangeBroPos(i, pId, id, cid);
        });
      }
      if (data.next) {
        this.myChangeBroPos(data.next, pId, id, cid);
      }
    }
  }
  replaceNode(d, obj) { // 找到id为obj.id的节点，并替换之
    let data = JSON.parse(JSON.stringify(d));
    if (obj.parentId) {
      // eslint-disable-next-line
      this.myReplaceNode(data, obj);
    } else {
      data = obj;
    }
    return data;
  }
  myReplaceNode(d, obj) {
    const data = d;
    if (data.id === obj.parentId) {
      if (obj.nodeType !== 'condition') {
        // eslint-disable-next-line
        data.next = JSON.parse(JSON.stringify(obj));
      } else {
        data.child.forEach((i, k) => {
          if (i.id === obj.id) {
            data.child.splice(k, 1, obj);
          }
        });
      }
    } else {
      if (data.next) {
        this.myReplaceNode(data.next, obj);
      }
      if (data.child) {
        data.child.forEach(i => {
          this.myReplaceNode(i, obj);
        });
      }
    }
  }
  // eslint-disable-next-line
  getLastArr(d) {
    const data = copy(d);
    const arr = [];
    this.pushNode(data, arr);
    console.log(arr);
    return arr;
  }
  pushNode(data, arr) {
    const obj = copy(data);
    obj.next = null;
    obj.child = null;
    if (obj.fixedUserIdList) {
      // eslint-disable-next-line
      obj.fixedUserIds = obj.fixedUserIdList.map(i => {
        console.log('@@fixedUserIds', i);
        return i.userId;
      });
    }
    if (obj.carbonCopyUserIdList) {
      // eslint-disable-next-line
      obj.carbonCopyUserIds = obj.carbonCopyUserIdList.map(i => {
        console.log('@@carbonCopyUserIds', i);
        return i.userId;
      });
    }
    if (obj.applicantList) {
      obj.applicants = obj.applicantList.map(i => {
        console.log('@@applicants', i);
        return i.userId;
      });
    }
    if (obj.applicantGroupIdList) {
      obj.applicantGroupIds = obj.applicantGroupIdList.map(i => {
        console.log('@@applicantGroupIds', i);
        return i.id;
      });
    }
    if (obj.applicantPostIdList) {
      obj.applicantPostIds = obj.applicantPostIdList.map(i => {
        console.log('@@applicantGroupIds', i);
        return i.id;
      });
    }
    if (obj.checkVal && obj.checkVal.length > 0) {
      console.log(obj);
      if (obj.checkVal.includes('1')) {
      // eslint-disable-next-line
        obj.isEnableApplicants = true;
      }
      if (obj.checkVal.includes('2')) {
      // eslint-disable-next-line
        obj.isEnableLeaveType = true;
      }
      if (obj.checkVal.includes('3')) {
        // eslint-disable-next-line
        obj.isEnableDaysRule = true;
        if (obj.ruleArr[0] === 'bw') {
          // eslint-disable-next-line
          obj.daysRule = `${obj.ruleArr[0]}:${obj.ruleArr[1]}:${obj.ruleArr[2]}-${obj.ruleArr[3]}:${obj.ruleArr[4]}`;
        } else if (obj.ruleArr[0] && obj.ruleArr[1]) {
          // eslint-disable-next-line
          obj.daysRule = `${obj.ruleArr[0]}:${obj.ruleArr[1]}`;
        }
      }
    }
    arr.push(obj);
    if (data.next) {
      this.pushNode(data.next, arr);
    }
    if (data.child) {
      // eslint-disable-next-line
      data.child.forEach((i, k) => {
        // eslint-disable-next-line
        i.priority = k + 1;
        this.pushNode(i, arr);
      });
    }
  }
}
