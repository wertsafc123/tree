<template>
  <div ref="now" class="stament" :class="'node' + treeData.id">
    <!-- 节点头上那条线 -->
    <div class="topline line">
    </div>
    <div class="width-line" :class="'width-line' + treeData.id" v-if="treeData.nodeType === 'conditionEnter'">
    </div>
    <!-- 节点本身，为了思路清晰，一个节点一个div -->
    <div class="box" v-if="treeData.nodeType === 'approver'">
      <div class="imgBack approverColor pointer" @click="editNode">
        <img src="../assets/img/approver.png">
      </div>
      <div class="box-content pointer" @click="editNode">
        <div class="box-content-title">{{treeData.name ? treeData.name : '审批人'}}</div>
        <div class="box-content-wrap">请选择审批人</div>
      </div>
      <a-icon class="arrowClass pointer" type="right" @click="editNode"/>
      <a-icon class="closeClass" type="close" @click="del"/>
    </div>
    <div class="box" v-if="treeData.nodeType === 'carbonCopy'">
      <div class="imgBack carbonCopyColor pointer" @click="editNode">
        <img src="../assets/img/carbonCopy.png">
      </div>
      <div class="box-content pointer" @click="editNode">
        <div class="box-content-title">{{treeData.name ? treeData.name : '抄送人'}}</div>
        <div class="box-content-wrap">请选择抄送人</div>
      </div>
      <a-icon class="arrowClass pointer" type="right" @click="editNode"/>
      <a-icon class="closeClass" type="close" @click="del"/>
    </div>
    <div class="box conditionBox" v-if="treeData.nodeType === 'condition'">
      <div class="leftBtn" :class="{'visible':myIndex===0}" @click="changePos(-1)">
        <a-icon type="left" />
      </div>
      <div class="pointer" @click="editNode">
        <div class="condition-title">
          <img src="../assets/img/edit.png">
          {{treeData.name ? treeData.name : '条件'}}
        </div>
        请设置条件
      </div>
      <div class="priority pointer" @click="editNode">优先级{{myIndex+1}}</div>
      <a-icon class="closeClass-con" type="close" @click="del"/>
      <div class="rightBtn" :class="{'visible':myIndex+1 === broLength}"  @click="changePos(1)">
        <a-icon type="right" />
      </div>
    </div>
    <!-- 添加子节点 -->
    <div class="line" :class="'heiLine' + treeData.id" v-if="treeData.nodeType !== 'conditionEnter'">
      <a-popover
        trigger="click"
        placement="right"
        v-model="visible"
      >
        <div class="addPop" slot="content">
          <a-icon class="addPop-close" @click="visible =!visible" type="close"/>
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

    <!-- 添加兄弟节点 -->
    <div v-if="myIndex+1 === broLength && treeData.nodeType==='condition' && myIndex < 9" class="adBroBtn" @click="addBro">+添加条件</div>

    <!-- 遍历子节点 -->
    <div class="node-wrap" :class="'node-wrap' + treeData.id" v-if="treeData.child">
      <node class="node-item" v-for="(item, i) in treeData.child" :key="i" :class="`node-item-${treeData.id}-${i}`" :myIndex='i' :plin='1' :broLength='treeData.child.length' :pId='treeData.id' :treeData='item'></node>
    </div>
    <div class="width-line" :class="'width-line' + treeData.id" v-if="treeData.nodeType === 'conditionEnter'">
    </div>
    <!-- 添加子节点 -->
    <div class="line" :class="'heiLine' + treeData.id" v-if="treeData.nodeType === 'conditionEnter'">
      <a-popover
        trigger="click"
        placement="right"
        v-model="visible"
      >
        <div class="addPop" slot="content">
          <a-icon class="addPop-close" @click="visible =!visible" type="close"/>
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
    <!-- 添加下一个节点 -->
    <template v-if="treeData.next">
      <node :myIndex='0' :broLength='1' :pId='treeData.id' :treeData='treeData.next' :plin='lineheight'></node>
    </template>
    <!-- 结束线 -->
    <div class="done" v-if="plin === 0 && !treeData.next">
      <div class="done-line"></div>
      <div class="done-circle"></div>
      <span>流程结束</span>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';

export default {
  name: 'node',
  props: ['treeData', 'myIndex', 'broLength', 'pId', 'plin'], // 节点数据， 当前索引 ， 兄弟集合长度, 父节点id
  data() {
    return {
      visible: false,
      lineheight: 0,
      widthLine: {
        width: '20px',
        height: '1px',
        background: '#000',
      },
      nodeName: {
        carbonCopy: '抄送人',
        condition: '条件',
        approver: '审批人',
      },
    };
  },
  watch: {
    treeData: {
      handler() {
        // 画线
        this.updateLine();
        this.updateBox();
      },
      deep: true,
    },
  },
  mounted() {
    this.updateLine();
    this.updateBox();
  },
  methods: {
    updateLine() {
      if (this.plin !== 0) { // 告诉当前节点身在一个分支树内
        this.lineheight = this.plin;
      }
      $(`.heiLine${this.treeData.id}`).height(60);
      this.$nextTick(() => {
        this.$nextTick(() => { // 画竖线
          if (this.plin === 1 && !this.treeData.next) { // 当前node若是一个在分支内最后的节点
            const hDom = $($(`.node${this.treeData.id}`).closest('.node-item')[0]);
            const linDom = $(`.heiLine${this.treeData.id}`);
            linDom.height(hDom.height() - (linDom.offset().top - hDom.offset().top));
          }
        });
        if (this.treeData.nodeType === 'conditionEnter') { // 画横线
          const wrapdom = this.$refs.now.querySelector('.node-wrap');
          if (wrapdom) {
            if (this.treeData.child && this.treeData.child.length > 1) {
              let width = 0;
              this.treeData.child.forEach((i, k) => {
                if (k === 0 || k === this.treeData.child.length - 1) {
                  width += 10;
                  width += this.$refs.now.querySelectorAll(`.node-item-${this.treeData.id}-${k}`)[0].clientWidth / 2;
                } else {
                  width += 20;
                  width += this.$refs.now.querySelectorAll(`.node-item-${this.treeData.id}-${k}`)[0].clientWidth;
                }
              });
              const widthLine = this.$refs.now.querySelectorAll(`.width-line${this.treeData.id}`);
              const leftchildWidth = this.$refs.now.querySelectorAll(`.node-item-${this.treeData.id}-0`)[0].clientWidth;
              const rightchildWidth = this.$refs.now.querySelectorAll(`.node-item-${this.treeData.id}-${this.treeData.child.length - 1}`)[0].clientWidth;
              const marginLeft = (leftchildWidth - rightchildWidth) / 2;
              widthLine[0].style.width = `${width}px`;
              widthLine[1].style.width = `${width}px`;
              widthLine[0].style.marginLeft = `${marginLeft}px`;
              widthLine[1].style.marginLeft = `${marginLeft}px`;
              this.$forceUpdate();
            } else {
              const widthLine = this.$refs.now.querySelectorAll(`.width-line${this.treeData.id}`);
              widthLine[0].style.width = '1px';
              widthLine[1].style.width = '1px';
            }
          }
        }
      });
    },
    updateBox() {
      this.$nextTick(() => {
        if (this.treeData.nodeType === 'approver' || this.treeData.nodeType === 'carbonCopy') {
          const box = this.$refs.now.querySelector('.box');
          box.removeAttribute('style');
        } else if (this.treeData.nodeType === 'conditionEnter') {
          const wrapdom = this.$refs.now.querySelector('.node-wrap');
          if (wrapdom) {
            wrapdom.removeAttribute('style');
          }
        }
      });
    },
    // 添加子节点
    add(type) {
      this.visible = false;
      this.eventBus.$emit('add', {
        nodeType: type,
        parentId: this.treeData.id,
      });
    },
    // 添加兄弟节点
    addBro() {
      this.eventBus.$emit('addBro', this.pId);
    },
    // 交换位置
    changePos(pos) {
      this.eventBus.$emit('changePos', this.pId, this.myIndex, this.myIndex + pos);
    },
    // 删除节点
    del() {
      this.eventBus.$emit('delNode', this.treeData);
    },
    // 点击编辑当前节点，弹出抽屉
    editNode() {
      this.eventBus.$emit('editNode', this.treeData, this.myIndex, this.broLength);
    },
  },
  computed: {
  },
};
</script>

<style scoped>
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
.width-line{
  height: 1px;
  width: 1px;
  background: rgba(212, 212, 212, 1);
}
.node-item{
  margin: 0 10px;
}
.priority{
  background: #FFFFFF;
  border: 1px solid #4476D5;
  border-radius: 2px;
  width: 60px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  color: #4476D5;
  letter-spacing: 0;
  text-align: center;
  margin-left: 20px;
  margin-bottom: 33px;
}
.condition-title{
  background: #F4F4F4;
  border: 1px solid #D8D8D8;
  border-radius: 2px;
  width: 169px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  height: 40px;
  padding: 8px;
}
.visible{
  visibility: hidden;
}
.rightBtn{
  height: 98px;
  border-radius: 0 5px 5px 0;
  width: 15px;
  background: #F4F4F4;
  display: flex;
  align-items: center;
  color: #AAAEB2;
  font-size: 12px;
  cursor: pointer;
  margin-left: 5px;
}
.leftBtn{
  height: 98px;
  border-radius: 5px 0 0 5px;
  width: 15px;
  background: #F4F4F4;
  display: flex;
  align-items: center;
  color: #AAAEB2;
  font-size: 12px;
  cursor: pointer;
  margin-right: 10px;
}
.conditionBox{
  height: 100px !important;
  font-size: 14px !important;
  color: #555555 !important;
  letter-spacing: 0.17px !important;
}
.closeClass{
  margin-bottom: 40px;
  color: #AAAEB2;
}
.closeClass-con{
  margin-bottom: 70px;
  margin-left: 15px;
  color: #AAAEB2;
}
.arrowClass{
  margin-left: 83px;
  font-size: 24px;
  color: #888888;
}
.pointer{
  cursor: pointer;
}
.box-content-title{
  color: #222222;
  text-align: justify;
  width: 80px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  font-size: 16px;
}
.box-content-wrap{
  font-size: 14px;
  color: #888888;
  text-align: justify;
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
.apprbtn{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
.apprbtn img {
  margin: 4px;
}
.adBroBtn{
  width: 80px;
  border-radius: 10px;
  background: #505660;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  color: #FFF;
  letter-spacing: 0;
  cursor: pointer;
  position: absolute;
  top: 20px;
}
.line{
  height: 60px;
  width: 1px;
  background: rgba(212, 212, 212, 1);
}
.topline{
  height: 30px !important;
}
.stament{
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.node-wrap{
  display: flex;
  flex-direction: row;
}
.box{
  border: 1px solid #AAAEB2;
  border-radius: 5px;
  width: 313px;
  height: 70px;
  text-align: center;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #222222;
  letter-spacing: 0;
  text-align: justify;
}
.addBtn{
  margin-left: -15px;
  margin-top: 15px;
}
.closeBtn{
  cursor: pointer !important;
  color: #fff;
  margin: 3px;
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
