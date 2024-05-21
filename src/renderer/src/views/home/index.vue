<template>
  <div class="home">
    <!-- 说明 -->
    <div class="header">
      <div class="text">
        <h3>OGCFUN</h3>
        <br />
        <p>
          这是一个插画网站
          <i style="font-size: 14px; color: #000">pixiv</i> 的爬虫程序,采用JavaScript语言编写
        </p>
        <p style="font-size: 14px; padding-top: 10px">
          在网上冲浪许久，找了许多爬虫程序，但是发现没有适合自己的，于是利用空余时间，自己写了一套爬虫系统。
        </p>
        <p style="font-size: 14px">
          此程序支持爬取日排行榜、周排行榜、月排行榜、Ai排行榜、R18排行榜，以及根据画家名称爬取插画。
        </p>
        <br />
        <p style="font-size: 14px"><span style="font-weight: bolder">当前版本:</span> v1.0.0</p>
        <div style="padding-top: 20px">
          <el-button plain size="small" :icon="Position" @click="openLink('https://www.baidu.com')"
            >GitHub</el-button
          >
          <el-button plain size="small" :icon="House" @click="openLink('https://www.ogcfun.top')"
            >访问官网</el-button
          >
        </div>
      </div>
      <div class="tip">
        <h3>技术选型</h3>
        <br />
        <div style="display: flex; font-size: 14px">
          <div style="width: 160px">
            <div>前端技术</div>
            <br />
            <p>Electron</p>
            <p>Vue3</p>
            <p>typescript</p>
            <p>element-plus</p>
            <p>axios</p>
            <p>pinia</p>
            <p>sass</p>
            <p>...</p>
          </div>

          <div>
            <div>后端技术</div>
            <br />
            <p>NestJs</p>
            <p>puppeteer-core</p>
            <p>class-validator</p>
            <p>socket.io</p>
            <p>rxjs</p>
            <p>reflect-metadata</p>
            <p>socks-proxy-agent</p>
            <p>...</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 日志 -->
    <div class="log">
      <div class="update">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>更新日志</span>
            </div>
          </template>
          <!-- 更新日志 -->
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="v1.0.0 - 2024-5-20" name="1">
              <div style="padding-top: 20px">
                <p style="margin: 4px">1. 实现爬取排行榜图片</p>
                <p style="margin: 4px">2. 实现爬取指定作者插画</p>
                <p style="margin: 4px">3. 实现爬取图片日志管理</p>
                <p style="margin: 4px">4. 实现自定义设置功能</p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
      <!-- 其他 -->
      <div class="more">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>关注微信</span>
            </div>
          </template>
          <div class="image">
            <div class="nopublic">
              <el-image style="width: 180px; height: 180px" :src="nopublic"></el-image>
            </div>
            <div>
              <el-image style="width: 180px; height: 180px" :src="applets"></el-image>
            </div>
          </div>
        </el-card>

        <el-card style="margin-top: 10px">
          <template #header>
            <div class="card-header">
              <span>打赏作者</span>
            </div>
          </template>
          <div class="image">
            <div class="nopublic">
              <div style="font-weight: bold">
                支付宝扫一扫，<span style="color: #75d9f5">向我付款</span>
              </div>
              <el-image
                style="width: 180px; height: 180px; margin-top: 6px"
                :src="alipay"
              ></el-image>
            </div>
            <div>
              <div style="font-weight: bold">微信扫一扫转帐</div>
              <el-image
                style="width: 180px; height: 180px; margin-top: 6px"
                :src="wechat"
              ></el-image>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { House, Position } from '@element-plus/icons-vue'

const activeName = ref('1')
import nopublic from '../../assets/images/nopublic.jpg'
import applets from '../../assets/images/applets.jpg'
import wechat from '../../assets/images/wechat.jpg'
import alipay from '../../assets/images/alipay.png'

/**
 * 打开浏览器进入对应链接
 * @param url
 */
const openLink = (url) => {
  window.openLink.openExternal(url)
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: calc(100vh - 35px);

  .header {
    width: 96%;
    height: 30vh;
    margin: 0 auto;
    border-bottom: 1px solid #00000024;
    display: flex;

    .text {
      width: 50%;
      height: 30vh;
      padding: 20px;
    }

    .tip {
      width: 50%;
      height: 30vh;
      padding: 20px;
    }
  }

  .log {
    width: 96%;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;

    :deep .el-card__header {
      padding: 14px 15px 7px;
      min-height: 40px;
    }

    .update {
      width: 58%;
    }

    .more {
      width: 40%;

      .image {
        text-align: center;
        display: flex;
        justify-content: space-evenly;

        .nopublic {
          width: 50%;
          border-right: 1px solid #00000040;
        }
      }
    }
  }
}
</style>
