<template>
  <div class="page">
    <ScreenAdapter>
      <div class="container">
        <div class="left">
          <div class="home-img">
            <img
              src="@/assets/images/home/home-page.png"
              alt="" />
          </div>
          <div class="warning-info">
            <div class="little-title">预警信息</div>
            <div class="split"></div>
            <AdminTable
              :columns="columns1"
              :tableData="tableData1">
              <template #action="{ row }">
                <el-button
                  class="action-button"
                  link>
                  忽略
                </el-button>
              </template>
            </AdminTable>
          </div>
        </div>
        <div class="right">
          <div class="right-top">
            <div class="avatar"></div>
            <div style="width: 420px">
              <div class="flex-content">
                <div class="user-name">王伟汉</div>
                <div class="user-status">外勤中</div>
              </div>
              <div class="flex-content mt16">
                <div class="user-dept">一队执法人员</div>
                <div class="user-time">登录时间：2023-05-26 10:26:32</div>
              </div>
            </div>
          </div>
          <div class="quick-entrance">
            <div class="little-title">快捷入口</div>
            <div class="split"></div>
            <div class="entrance-list">
              <div
                v-for="(item, index) in entranceList"
                :key="index"
                class="entrance-item">
                <img
                  :src="item.image"
                  alt="" />
                <div class="entrance-name">{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenAdapter>
  </div>
</template>

<script setup name="Index">
import ScreenAdapter from '@/components/screen-adapter/screen-adapter.vue'
import CaseHandle from '@/assets/images/home/case-handle.png'
import CaseManage from '@/assets/images/home/case-manage.png'
import Money from '@/assets/images/home/money.png'
import Writer from '@/assets/images/home/writer.png'
import SystemImg from '@/assets/images/home/system.png'
const columns1 = [
  { label: '姓名', prop: 'name', width: '240' },
  { label: '预警类型', prop: 'type', width: '430' },
  { label: '预警时间', prop: 'time', width: '450' },
  {
    label: '操作',
    width: '160',
    prop: 'action',
    'class-name': 'small-padding fixed-width'
  }
]
const tableData1 = [
  {
    name: '曲姬贞',
    type: '笔录完成未出区',
    time: '2023-05-23 17:35:42'
  },
  {
    name: '方昭坚',
    type: '笔录完成未出区',
    time: '2023-05-23 17:35:42'
  }
]
const entranceList = [
  {
    name: '办案区系统',
    image: CaseHandle,
    url: ''
  },
  {
    name: '案件管理',
    image: CaseManage,
    url: ''
  },
  {
    name: '涉案财物',
    image: Money,
    url: ''
  },
  {
    name: '智能笔录',
    image: Writer,
    url: ''
  },
  {
    name: '系统维护',
    image: SystemImg,
    url: ''
  }
]
</script>

<style scoped lang="scss">
.mt16 {
  margin-top: 16px;
}
.container {
  width: 100%;
  display: flex;
}
.warning-info {
  width: 1312px;
  height: 648px;
  background: #ffffff;
  border-radius: 4px;
  margin-top: 16px;
  padding: 16px;
  box-sizing: border-box;
}
.little-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: AlibabaPuHuiTi_2_65_Medium;
  color: #333333;
}
.little-title::before {
  content: '';
  width: 4px;
  height: 24px;
  background: #3183e2;
  margin-right: 8px;
}
.split {
  width: 100%;
  height: 1px;
  border: 1px solid #eff4f9;
  margin-top: 16px;
}
:deep(.admin-table-box) {
  margin-top: 7px;
  padding: 0;
}
.home-img {
  width: 1312px;
  height: 320px;
  img {
    width: 100%;
    height: 100%;
  }
}
.right {
  margin-left: 14px;
}
.right-top {
  width: 560px;
  height: 120px;
  background: #ffffff;
  border-radius: 4px;
  display: flex;
  align-items: center;
}
.flex-content {
  display: flex;
  justify-content: space-between;
}
.avatar {
  width: 80px;
  height: 80px;
  background: #f7fbfe;
  border: 1px solid rgba(210, 212, 223, 0.3);
  margin-left: 22px;
  margin-right: 20px;
  border-radius: 50%;
}
.user-name {
  height: 33px;
  font-size: 24px;
  font-family: AlibabaPuHuiTi_2_65_Medium;
  color: #333333;
  line-height: 33px;
}
.user-dept {
  height: 25px;
  font-size: 18px;
  font-family: AlibabaPuHuiTi_2_55_Regular;
  color: #646b72;
  line-height: 25px;
}
.user-status {
  width: 64px;
  height: 28px;
  background: rgba(37, 155, 251, 0.15);
  border-radius: 2px;
  border: 1px solid rgba(37, 155, 251, 0.8);
  font-size: 16px;
  font-family: AlibabaPuHuiTi_2_65_Medium;
  color: #259bfb;
  line-height: 28px;
  text-align: center;
}
.user-time {
  height: 22px;
  font-size: 16px;
  font-family: AlibabaPuHuiTi_2_55_Regular;
  color: #aab2bd;
  line-height: 22px;
}
.quick-entrance {
  width: 560px;
  height: 848px;
  background: #ffffff;
  border-radius: 4px;
  margin-top: 16px;
  padding: 16px;
  box-sizing: border-box;
}
.entrance-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.entrance-item {
  margin-top: 16px;
  width: 256px;
  height: 88px;
  background: rgba(49, 131, 226, 0.05);
  border-radius: 4px;
  display: flex;
  align-items: center;
  img {
    width: 88px;
    height: 88px;
    margin-left: 8px;
    margin-right: 29px;
  }
}
.entrance-name {
  font-size: 18px;
  font-family: AlibabaPuHuiTi_2_65_Medium;
  color: #132c56;
  letter-spacing: 2px;
}
</style>
