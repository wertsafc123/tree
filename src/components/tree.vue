<template>
  <div class="k-content">
    <!-- 流程图 -->
    <div class="tree-wrap">
      <div class="body">

        <!-- 发起人节点 -->
        <div class="box">
          <div class="imgBack">
            <img src="../assets/img/all.png">
          </div>
          发起人
        </div>

        <!-- 发起人节点下面那条线 -->
        <div class="line">
          <a-popover
            trigger="click"
            placement="right"
            v-model="visible"
          >
            <div class="addPop" slot="content">
              <a-icon class="addPop-close" @click="hidePop" type="close"/>
              <div class="addPop-content">
                <div class="addPop-item">
                  <div class="apprbtn approverColor" @click="add('approver')">
                    <img src="../assets/img/approver.png">
                  </div>
                  审批人
                </div>
                <div class="addPop-item">
                  <div class="apprbtn carbonCopyColor" @click="add('carbonCopy')">
                    <img src="../assets/img/carbonCopy.png">
                  </div>
                  抄送人
                </div>
                <div class="addPop-item">
                  <div class="apprbtn conditionColor" @click="add('conditionEnter')">
                    <img src="../assets/img/condition.png">
                  </div>
                  条件
                </div>
              </div>
            </div>
            <a-button class="addBtn" type="primary" shape="circle" icon="plus"></a-button>
          </a-popover>
        </div>
        
        <!-- 审批流程 -->
        <template v-if="treeData.id">
          <node :myIndex='0' :broLength='1' :pId='treeData.id' :treeData='treeData' :plin='0'></node>
        </template>
        <!-- 结束线 -->
        <div v-else class="done">
          <div class="done-line"></div>
          <div class="done-circle"></div>
          <span>流程结束</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import node from './node';
import ErFun from './erFun';

export default {
  name: 'tree',
  components: {
    node,
  },
  data() {
    return {
      typeList: {
        user: 'applicantList',
        dep: 'applicantGroupIdList',
        post: 'applicantPostIdList',
      },
      treeData: {},
      visible: false,
      drawerVisible: false,
      node: {},
      type: '',
      cIndex: null,
      nodeName: {
        carbonCopy: '抄送人',
        condition: '条件',
        approver: '审批人',
      },
      erFun: {
        stack: [],
      },
      loading: false,
      reloading: false,
      pickFlag: false,
      all: false,
      pickPost: false,
    };
  },
  mounted() {
    this.getProDefAction();
    this.eventBus.$on('add', this.addChild);
    this.eventBus.$on('addBro', this.addBro);
    this.eventBus.$on('changePos', this.changePos);
    this.eventBus.$on('delNode', this.delNode);
    this.eventBus.$on('editNode', this.showDrager);
    this.erFun = new ErFun();
  },
  methods: {
    checkPost() {
      this.pickPost = true;
      this.drawerVisible = false;
      this.pickFlag = true;
    },
    addPost(d) {
      this.pickPost = false;
      this.drawerVisible = true;
      this.pickFlag = false;
      if (d[0]) {
        this.node.postId = d[0].userId;
        this.node.postName = d[0].nickname;
      }
    },
    change(cIndex) {
      this.cIndex = cIndex;
    },
    getLast() {
      // const arr = [];
      const arr = this.erFun.getLastArr(this.treeData);
      const id = this.$route.query.id;
      this.$store
        .dispatch('flowModule/postProcessDefinition', { arr, id })
        .then(r => {
          if (r.success) {
            this.$message.success('发布成功');
          }
        });
    },
    addUser(userList) {
      if (this.all) {
        userList.forEach(item => {
          if (!this.node[this.typeList[item.type]]) {
            this.node[this.typeList[item.type]] = [];
          }
          const list = this.node[this.typeList[item.type]];
          if (item.type === 'user') {
            list.push(item);
          } else {
            list.push({
              id: item.userId,
              name: item.nickname,
            });
          }
        });
        let arr = [];
        Object.values(this.typeList).forEach(i => {
          arr = [];
          console.log(i);
          // eslint-disable-next-line
          this.node[i] && this.node[i].forEach(it => {
            // eslint-disable-next-line
            const b = arr.some(item => {
              if (i === 'applicantList') {
                return it.userId === item.userId;
                // eslint-disable-next-line
              } else {
                return it.id === item.id;
              }
            });
            if (!b) {
              arr.push(it);
            }
          });
          this.node[i] = arr;
        });
      } else {
        // eslint-disable-next-line
        if (!this.node[this.type]) {
          this.node[this.type] = [];
        }
        this.node[this.type].push(...userList);
        const arr = [];
        this.node[this.type].forEach(i => {
          // eslint-disable-next-line
          const b = arr.some(it => {
            return it.userId === i.userId;
          });
          if (!b) {
            arr.push(i);
          }
        });
        while (arr.length > 10) {
          arr.pop();
        }
        this.node[this.type] = arr;
      }
      this.all = false;
      this.pickFlag = false;
      this.drawerVisible = true;
    },
    closePickUser() {
      this.pickFlag = false;
    },
    checkUser(str, all) {
      this.all = all;
      this.type = str;
      this.drawerVisible = false;
      this.pickFlag = true;
    },
    reload() {
      this.reloading = true;
      this.$set(this, 'treeData', JSON.parse(JSON.stringify(this.treeData)));
      setTimeout(() => {
        this.reloading = false;
      }, 500);
    },
    // 撤回操作
    stackPop() {
      if (this.erFun.stack.length > 0) {
        this.loading = true;
        this.$nextTick(() => {
          this.$set(this, 'treeData', JSON.parse(JSON.stringify(this.erFun.stack.pop())));
          this.$nextTick(() => {
            this.reload();
          });
        });
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    },
    replace() {
      if (this.cIndex && this.node.nodeType === 'condition' && this.cIndex !== (this.node.myIndex - 1)) {
        this.changePos(this.node.parentId, this.node.myIndex - 1, this.cIndex - 1);
      }
      const treeData = this.erFun.replaceNode(this.treeData, this.node);
      this.$set(this, 'treeData', treeData);
      this.onClose();
      this.$nextTick(() => {
        this.reload();
      });
    },
    // 主树上添加节点
    add(type) {
      this.erFun.pushStack(JSON.parse(JSON.stringify(this.treeData)));
      if (type === 'conditionEnter') {
        const obj = {
          id: this.erFun.getId(),
          nodeType: type,
          child: [
            {
              id: this.erFun.getId(),
              nodeType: 'condition',
              checkVal: [],
              ruleArr: [],
            },
            {
              id: this.erFun.getId(),
              nodeType: 'condition',
              checkVal: [],
              ruleArr: [],
            },
          ],
        };
        obj.child[0].parentId = obj.id;
        obj.child[1].parentId = obj.id;
        if (this.treeData.id) {
          obj.next = JSON.parse(JSON.stringify(this.treeData));
          obj.next.parentId = obj.id;
        }
        this.$set(this, 'treeData', obj);
        this.$forceUpdate();
      } else {
        const obj = {
          id: this.erFun.getId(),
          nodeType: type,
        };
        if (this.treeData.id) {
          obj.next = JSON.parse(JSON.stringify(this.treeData));
          obj.next.parentId = obj.id;
        }
        this.$set(this, 'treeData', obj);
        this.$forceUpdate();
      }
      this.visible = false;
      this.$nextTick(() => {
        this.reload();
      });
    },
    // 监听添加兄弟节点
    addBro(pId) {
      this.erFun.pushStack(JSON.parse(JSON.stringify(this.treeData)));
      const obj = {
        nodeType: 'condition',
        parentId: pId,
      };
      const treeData = this.erFun.addChildNode(this.treeData, obj);
      this.$set(this, 'treeData', treeData);
      this.$nextTick(() => {
        this.reload();
      });
    },
    // 添加子节点
    addChild(obj) {
      this.erFun.pushStack(JSON.parse(JSON.stringify(this.treeData)));
      const treeData = this.erFun.addChildNode(this.treeData, obj);
      this.$set(this, 'treeData', treeData);
      this.$nextTick(() => {
        this.reload();
      });
    },
    // 兄弟节点交换位置
    changePos(pId, id, cId) {
      this.erFun.pushStack(JSON.parse(JSON.stringify(this.treeData)));
      const treeData = this.erFun.changeBroPos(this.treeData, pId, id, cId);
      this.$set(this, 'treeData', treeData);
      this.$nextTick(() => {
        this.reload();
      });
    },
    // 删除节点
    delNode(obj) {
      this.erFun.pushStack(JSON.parse(JSON.stringify(this.treeData)));
      const treeData = this.erFun.delNode(this.treeData, obj);
      if (treeData) {
        this.$set(this, 'treeData', treeData);
      } else {
        this.$set(this, 'treeData', {});
      }
      this.$nextTick(() => {
        this.reload();
      });
    },
    // 初始化数据
    getProDefAction() {
      // this.$store
      //   .dispatch('flowModule/getProDefAction', this.$route.query.id)
      //   .then(r => {
      //     console.log(r);
      //     if (r.model.processNodeList) {
      //       this.treeData = this.erFun.changeStructrue(r.model.processNodeList);
      //       this.$nextTick(() => {
      //         this.reload();
      //       });
      //     }
        // });
    },
    // 隐藏抽屉
    hidePop() {
      this.visible = !this.visible;
    },
    onClose() {
      this.drawerVisible = false;
    },
    // 展开抽屉，拷贝点击的节点到抽屉中进行操作
    showDrager(n, index, length) {
      this.node = JSON.parse(JSON.stringify(n));
      if (n.nodeType === 'condition') {
        this.node.myIndex = index + 1;
        this.node.broLength = length;
        this.cIndex = null;
      }
      this.drawerVisible = true;
    },
  },
  computed: {
  },
  destroyed() {
    this.eventBus.$off('add');
    this.eventBus.$off('addBro');
    this.eventBus.$off('changePos');
    this.eventBus.$off('delNode');
    this.eventBus.$off('editNode');
    this.erFun = null;
  },
  watch: {
    treeData: {
      handler() {
        this.$nextTick(() => {
          const wrapdom = document.querySelector('.body');
          const treedom = wrapdom.querySelectorAll('.node-wrap');
          let width = 1700;
          treedom.forEach(i => {
            if (i.scrollWidth > width) {
              width = i.scrollWidth;
            }
          });
          if (width !== 1700) {
            wrapdom.style.width = `${width}px`;
          } else {
            wrapdom.style.width = '100vw';
          }
        });
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.k-content{
  width: 100vw;
  height: 100vh;
}
.done{
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(212, 212, 212, 1);
}
.done-circle{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(212, 212, 212, 1);
}
.done-line{
  height: 20px;
  width: 1px;
  background: rgba(212, 212, 212, 1);
}
.apprbtn img {
  margin: 4px;
}
.apprbtn{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
.approverColor{
  background: #4272CF !important;
}
.carbonCopyColor{
  background: #53C886 !important;
}
.conditionColor{
  background: #60CAFF !important;
}
.saveBtn{
  background: #4476D5;
  border-radius: 2px;
  height: 40px;
  width: 120px;
  color: #fff;
  font-size: 14px;
}
.cancelBtn{
  border: 1px solid #4476D5;
  background: #fff;
  border-radius: 2px;
  height: 40px;
  width: 120px;
  color: #4476D5;
  margin-left: 30px;
  font-size: 14px;
}
.footer{
  position: absolute;
  bottom: 0;
  right: 0;
  height: 180px;
  width: 900px;
  border-top: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
}
.wraper{
  min-height: 968px;
  width: 1000px;
  position: absolute;
  top: 0;
  right: 0;
}
.drager{
  position: relative;
}
.container{
  width: 900px;
  position: absolute;
  right: 0;
  top: 100px;
}
.closeClass{
  width: 50px;
  height: 50px;
  background: #fff;
  color: #365AA4;
  font-size: 19px; 
  position: absolute;
  top:50%;
  right: 975px;
  text-align: center;
  line-height: 50px;
}
.drager-header{
  width: 1000px;
  height: 50px;
  background: #365AA4;
  text-align: center;
  line-height: 50px;
  font-size: 16px;
  color: #FFFFFF;
  position: absolute;
  right: 0;
  top: 0;
}
.imgBack{
  width: 50px;
  height: 50px;
  border-radius: 2px;
  background: #60CAFF;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 24px;
}
.tree-wrap{
  width: 100%;
  overflow-x: scroll;
}
.body{
  box-sizing: content-box;
}
.box{
  border: 1px solid #AAAEB2;
  border-radius: 5px;
  width: 313px;
  height: 70px;
  text-align: center;
  margin: 0 auto;
  line-height: 80px;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #222222;
  letter-spacing: 0;
  text-align: justify;
}
.line{
  margin: 0 auto;
  height: 60px;
  width: 1px;
  background: rgba(212, 212, 212, 1);
}
.addBtn{
  margin-left: -15px;
  margin-top: 15px;
}
.addPop-close{
  float: right;
}
.addPop-content{
  display: flex;
  flex-direction: row;
  padding-top: 20px;
}
.addPop-item{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}
</style>
