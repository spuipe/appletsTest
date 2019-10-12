import React, { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Button, RadioGroup } from '@tarojs/components'
//import { connect } from '@tarojs/redux'

import { AtModal, AtModalHeader, AtModalContent, AtButton, AtModalAction, AtTag, AtBadge } from "taro-ui"

import { connect } from '@tarojs/redux'

import { userdata, location as locationInfo, recentShop as recentShopInfo } from '../../actions/counter';

import './index.scss'
import waimai from '../img/waimai.png';
import shuiguo from '../img/shuiguo.png';
import cha1 from '../img/cha1.png';
import close from '../img/close.svg';
import add from '../img/add.svg';
import less from '../img/less.svg';

import QQMapWX from '../../utils/qqmap-wx-jssdk.min.js'

let qqmapsdk = new QQMapWX({ key: 'U3HBZ-TEYW4-76HUD-DZQBT-KXY22-NJBUE' })

interface Sidebar {
  id: number
  name: string
  top: number
  bottom: number
}

interface MainArea {
  mainTitle: string
  list: Array<MainAreaItem>
}
interface MainAreaItem {
  commodity: string
  description: string
  price: number | null
}

interface shoppingBagItem { }

type PageOwnProps = {}

type PageOwnState = {
  TabCur: number
  loginModalFlag: boolean
  specificationModalFlag: boolean
  shoppingBagFlag: Array<shoppingBagItem>
  shoppingScrollViewHeight: number
  shoppingDialogHeight: number
  commodityAreaHegiht: number
  shopBagFlag: boolean
  MainCur: number
  shopInformation: Object
  VerticalNavTop: number
  baseUrl: string
  list: Array<Sidebar>
  load: boolean
  chaData: Array<MainArea>
  shoppingBagItem: Number
}

type PageDispatchProps = {
  setUserdata: () => void
  setLocation: () => void
  setRecentShop: () => void
}

type PageMapSateProps = {
  location: Object
  selectShopLocation: Object
  recentShop: Object
}

type Props = PageOwnProps & PageDispatchProps & PageMapSateProps

type State = PageOwnState

interface Order {
  props: Props
  state: State
}

@connect(({ location, selectShopLocation, recentShop }) => ({
  location, selectShopLocation, recentShop
}), (dispatch) => ({
  setUserdata(userInformation) {
    dispatch(userdata(userInformation))
  },
  setLocation(location) {
    dispatch(locationInfo(location))
  },
  setRecentShop(recentShop) {
    dispatch(recentShopInfo(recentShop))
  }
}))

class Order extends Component {
  config: Config = {  // Config 小程序专属
    navigationBarTitleText: '茶道'
  }

  constructor() {
    super(...arguments);
  }

  componentWillMount() {
    Taro.showLoading({ title: '加载中' })
    Taro.getSetting().then(res => {
      if (res.authSetting['scope.userInfo']) {
        Taro.login().then(res => {
          Taro.getUserInfo({ withCredentials: true }).then(resolve => {
            this.props.setUserdata(resolve)
          })
        })
      } else {
        this.setState({ loginModalFlag: true })
      }

      if (res.authSetting['scope.userLocation']) {
        Taro.getLocation().then(res => {
          this.props.setLocation(res)
          this.getAnnexShop(res.latitude, res.longitude)
        })
      } else {
        Taro.showModal({
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
        }).then(res => {
          if (res.confirm) {
            Taro.getLocation().then(resolve => {
              this.props.setLocation(resolve)
              this.getAnnexShop(resolve.latitude, resolve.longitude)
            })
          }
        })
      }
    })
  }

  componentDidShow() {  // onShow
    const { selectShopLocation, recentShop } = this.props
    if (Object.keys(selectShopLocation.selectShopLocation).length == 0) {
      this.setState({
        shopInformation: recentShop.recentShop
      })
    } else {
      this.setState({
        shopInformation: selectShopLocation.selectShopLocation
      })
    }
  }

  componentDidMount() {
    Taro.hideLoading()
    this.calculateShopBag()
  }

  state: State = {
    loginModalFlag: false,
    specificationModalFlag: false,
    shoppingBagFlag: [],
    TabCur: 0,  //点击侧边导航栏的key值
    MainCur: 0,  // 商品列表的标题key值
    VerticalNavTop: 0,
    shoppingDialogHeight: 0,
    shoppingScrollViewHeight: 0,
    commodityAreaHegiht: 0,
    shopBagFlag: false,  // 购物袋是否显示
    shopInformation: {},  // 定位商店的信息
    baseUrl: "",
    list: [
      { id: 0, name: "麦包包", top: 0, bottom: 348 },
      { id: 1, name: "食验室", top: 348, bottom: 574 },
      { id: 2, name: "当季限定", top: 574, bottom: 1288 },
      { id: 3, name: "制冰茶", top: 1288, bottom: 2002 },
      { id: 4, name: "水果茶", top: 2002, bottom: 2716 },
      { id: 5, name: "波波茶", top: 2716, bottom: 3308 },
      { id: 6, name: "满杯水果", top: 3308, bottom: 3778 },
      { id: 7, name: "纯茶", top: 3778, bottom: 4370 },
      { id: 8, name: "加料", top: 4370, bottom: 5816 },
      { id: 9, name: "热饮推荐", top: 5816, bottom: 6164 },
      { id: 10, name: "咖啡", top: 6164, bottom: 6756 },
      { id: 11, name: "灵感提示", top: 6756, bottom: 7104 },
      { id: 12, name: "绿色茶道", top: 7104, bottom: 7818 },
      { id: 13, name: "甜点", top: 7818, bottom: 7922 }
    ],
    load: true,
    chaData: [
      {
        mainTitle: '麦包包', list: [
          { commodity: '水蜜桃麦包包', description: '下单后不用等待叫号，直接出示给店员领取。', price: 19 },
          { commodity: '甜橙麦包包', description: '下单后不用等待叫号，直接出示给店员领取。', price: 23 },
          { commodity: '番石榴麦包包', description: '下单后不用等待叫号，直接出示给店员领取。', price: 23 }
        ]
      },
      {
        mainTitle: '食验室', list: [
          { commodity: '芒芒瓜瓜酸奶杯', description: '下单后不用等待叫号，直接出示给店员领取。', price: 25 },
          { commodity: '爆芋泥波波冰', description: '下单后不用等待叫号，直接出示给店员领取。', price: 23 },
        ]
      },
      {
        mainTitle: '当季限定', list: [
          { commodity: '多肉芒芒甘露', description: '下单后不用等待叫号，直接出示给店员领取。', price: 25 },
          { commodity: '芝芝桃桃', description: '下单后不用等待叫号，直接出示给店员领取。', price: 29 },
          { commodity: '醉醉桃桃', description: '下单后不用等待叫号，直接出示给店员领取。', price: 25 },
          { commodity: '多肉粉荔', description: '下单后不用等待叫号，直接出示给店员领取。', price: 29 },
          { commodity: '醉醉粉荔', description: '下单后不用等待叫号，直接出示给店员领取。', price: 25 },
          { commodity: 'MINI喜茶', description: '下单后不用等待叫号，直接出示给店员领取。', price: 28 },
        ]
      },
      {
        mainTitle: '制冰茶', list: [
          { commodity: '爆芋泥雪糕杯', description: '下单后不用等待叫号，直接出示给店员领取。', price: 16 },
          { commodity: '芝芝脆筒', description: '下单后不用等待叫号，直接出示给店员领取。', price: 9 },
          { commodity: '芝芝金凤脆筒', description: '下单后不用等待叫号，直接出示给店员领取。', price: 9 },
          { commodity: '芝芝茶王脆筒', description: '下单后不用等待叫号，直接出示给店员领取。', price: 5 },
          { commodity: '波波雪糕杯', description: '下单后不用等待叫号，直接出示给店员领取。', price: 16 },
          { commodity: '芒芒雪糕杯', description: '下单后不用等待叫号，直接出示给店员领取。', price: 18 }
        ]
      },
      {
        mainTitle: '水果茶', list: [
          { commodity: '多肉葡萄', description: '下单后不用等待叫号，直接出示给店员领取。', price: 28 },
          { commodity: '多肉瓜瓜', description: '下单后不用等待叫号，直接出示给店员领取。', price: 25 },
          { commodity: '芝芝莓莓', description: '下单后不用等待叫号，直接出示给店员领取。', price: 30 },
          { commodity: '芝芝莓莓双拼', description: '下单后不用等待叫号，直接出示给店员领取。', price: 33 },
          { commodity: '多肉莓莓', description: '下单后不用等待叫号，直接出示给店员领取。', price: 32 },
          { commodity: '芝芝芒芒', description: '下单后不用等待叫号，直接出示给店员领取。', price: 32 }
        ]
      },
      {
        mainTitle: '波波茶', list: [
          { commodity: '阿华田波波冰', description: '下单后不用等待叫号，直接出示给店员领取。', price: 28 },
          { commodity: '黑糖波波（鲜奶）', description: '下单后不用等待叫号，直接出示给店员领取。', price: 19 },
          { commodity: '双拼波波（鲜奶）', description: '下单后不用等待叫号，直接出示给店员领取。', price: 19 },
          { commodity: '奶茶波波冰', description: '下单后不用等待叫号，直接出示给店员领取。', price: 25 },
          { commodity: '芋泥波波（鲜奶）', description: '下单后不用等待叫号，直接出示给店员领取。', price: 25 }
        ]
      },
      {
        mainTitle: '满杯水果', list: [
          { commodity: '满杯红柚', description: '下单后不用等待叫号，直接出示给店员领取。', price: 23 },
          { commodity: '满杯橙橙', description: '下单后不用等待叫号，直接出示给店员领取。', price: 23 },
          { commodity: '满杯水果绿/四季春', description: '下单后不用等待叫号，直接出示给店员领取。', price: 22 },
          { commodity: '满杯香水柠', description: '下单后不用等待叫号，直接出示给店员领取。', price: 20 },
        ]
      },
      {
        mainTitle: '纯茶', list: [
          { commodity: '纯绿妍', description: '下单后不用等待叫号，直接出示给店员领取。', price: 11 },
          { commodity: '纯金玉', description: '下单后不用等待叫号，直接出示给店员领取。', price: 19 },
          { commodity: '纯金凤茶王', description: '下单后不用等待叫号，直接出示给店员领取。', price: 17 },
          { commodity: '纯四季春', description: '下单后不用等待叫号，直接出示给店员领取。', price: 19 },
          { commodity: '纯从露可可', description: '下单后不用等待叫号，直接出示给店员领取。', price: 25 }
        ]
      },
      {
        mainTitle: '加料', list: [
          { commodity: '芝士', description: '下单后不用等待叫号，直接出示给店员领取。', price: 6 },
          { commodity: '阿华田脆脆', description: '下单后不用等待叫号，直接出示给店员领取。', price: 2 },
          { commodity: '加料冰淇淋', description: '下单后不用等待叫号，直接出示给店员领取。', price: 6 },
          { commodity: '丹麦式酸奶', description: '下单后不用等待叫号，直接出示给店员领取。', price: 6 },
          { commodity: '黑波波', description: '下单后不用等待叫号，直接出示给店员领取。', price: 2 },
          { commodity: '芋圆波波', description: '下单后不用等待叫号，直接出示给店员领取。', price: 3 },
          { commodity: '脆波波', description: '下单后不用等待叫号，直接出示给店员领取。', price: 3 },
          { commodity: '加料布甸', description: '下单后不用等待叫号，直接出示给店员领取。', price: 6 },
          { commodity: '奥利奥', description: '下单后不用等待叫号，直接出示给店员领取。', price: 3 },
          { commodity: '红柚果粒', description: '下单后不用等待叫号，直接出示给店员领取。', price: 2 },
          { commodity: '芦荟果粒', description: '下单后不用等待叫号，直接出示给店员领取。', price: 3 },
          { commodity: '黑糖奶冻', description: '下单后不用等待叫号，直接出示给店员领取。', price: 4 },
        ]
      },
      {
        mainTitle: '热饮推荐', list: [
          { commodity: '热芋泥波波（鲜奶）', description: '下单后不用等待叫号，直接出示给店员领取。', price: 25 },
          { commodity: '热满杯红柚', description: '下单后不用等待叫号，直接出示给店员领取。', price: 23 },
          { commodity: '热松露可可', description: '下单后不用等待叫号，直接出示给店员领取。', price: 28 }
        ]
      },
      {
        mainTitle: '咖啡', list: [
          { commodity: '阿华田咖啡冰', description: '下单后不用等待叫号，直接出示给店员领取。', price: 28 },
          { commodity: '咖啡波波冰', description: '下单后不用等待叫号，直接出示给店员领取。', price: 25 },
          { commodity: '咖啡波波双拼', description: '下单后不用等待叫号，直接出示给店员领取。', price: 25 },
          { commodity: '芝芝拿铁', description: '下单后不用等待叫号，直接出示给店员领取。', price: 25 },
          { commodity: '知芝美式', description: '下单后不用等待叫号，直接出示给店员领取。', price: 21 },
        ]
      },
      {
        mainTitle: '灵感提示', list: [
          { commodity: '联系我们', description: '下单后不用等待叫号，直接出示给店员领取。', price: null },
          { commodity: '星球须知', description: '下单后不用等待叫号，直接出示给店员领取。', price: null },
          { commodity: '好茶', description: '下单后不用等待叫号，直接出示给店员领取。', price: null }
        ]
      },
      {
        mainTitle: '绿色茶道', list: [
          { commodity: '自带杯 减2元', description: '下单后不用等待叫号，直接出示给店员领取。', price: null },
          { commodity: '一起使用纸吸管', description: '下单后不用等待叫号，直接出示给店员领取。', price: null },
          { commodity: '不打包 更环保', description: '下单后不用等待叫号，直接出示给店员领取。', price: null },
          { commodity: '让垃圾各归各家', description: '下单后不用等待叫号，直接出示给店员领取。', price: null },
          { commodity: '纸巾按需取用', description: '下单后不用等待叫号，直接出示给店员领取。', price: null },
          { commodity: '循环利用 激发灵感', description: '下单后不用等待叫号，直接出示给店员领取。', price: null },
        ]
      },
      {
        mainTitle: '甜点', list: [
          { commodity: '焦糖烤布蕾', description: '下单后不用等待叫号，直接出示给店员领取。', price: 9 }
        ]
      },
    ],
    shoppingBagItem: 0
  }

  getAnnexShop = (latitude: number, longitude: number) => {  // 获取最近的店铺
    qqmapsdk.search({
      keyword: '喜茶',
      location: { latitude: latitude, longitude: longitude },
      success: (data) => {
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].title.indexOf('喜茶') != -1) {
            this.setState({ shopInformation: data.data[i] })
            this.props.setRecentShop(data.data[i])
            break;
          }
        }
      }
    })
  }

  tabSelect = (id: number) => {
    this.setState({
      TabCur: id,
      MainCur: id,
      VerticalNavTop: (id - 1) * 50
    })
  }

  VerticalMain = (e: Object) => {  // 滚动时触发
    let _this = this;
    let list = this.state.list;
    let tabHeight = 0;
    if (this.state.load) {
      for (let i = 0; i < list.length; i++) {
        let view = Taro.createSelectorQuery().select('#main-' + list[i].id);
        view.fields({ size: true, dataset: true, id: true }, data => {  // fields 查询节点信息
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;  // height 没问题，只是ts检查问题
          list[i].bottom = tabHeight;
        }).exec();
        _this.setState({ load: false, list })
      }
    }

    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        _this.setState({ VerticalNavTop: (list[i].id - 1) * 50, TabCur: list[i].id })
        return false;
      }
    }
  }

  showDetailedSpecifications = (mainId: number, itemId: number) => {  // 点击+号，选规格时触发
    Taro.getStorage({ key: 'userInfo' }).then(res => {
      this.setState({ specificationModalFlag: true })
      this.getVisibleHeight()
    }).catch(rej => {
      this.setState({ loginModalFlag: true })
    })
  }

  getUserInfo = (userInfo: Object) => {  // 获取用户信息
    Taro.getUserInfo().then(res => {
      Taro.setStorage({ key: 'userInfo', data: res })
      this.setState({ loginModalFlag: false })
    })
  }

  closeLoginModal = () => {  // 用户关闭授权弹框
    this.setState({ loginModalFlag: false })
    Taro.showModal({
      title: '提示',
      content: '需要通过授权才能继续，请重新点击并授权',
      showCancel: false,
      confirmColor: '#25a902'
    })
  }

  closeCommodityModal = (): void => {
    this.setState({ specificationModalFlag: false })
  }

  chooseStore = (): void => {  // 跳转到店铺选择页
    Taro.navigateTo({ url: '/pages/orderAddress/index' })
  }

  calculateShopBag = (): void => {  // 计算添加到购物袋之后ScrollView的高度问题
    let query = Taro.createSelectorQuery();
    let systemInfo = Taro.getSystemInfoSync();
    let header = query.select('.header');
    let headerInformation = query.select('.header-information');
    let shoppingBagArea = query.select('.shoppingBagArea');
    header.boundingClientRect().exec(rectHeader => {
      headerInformation.boundingClientRect().exec(rectHeaderInformation => {
        shoppingBagArea.boundingClientRect().exec(rectShoppingBagArea => {
          let height = systemInfo.windowHeight - rectHeader[0].height - rectHeaderInformation[0].height - rectShoppingBagArea[0].height;
          this.setState({ commodityAreaHegiht: height })
        })
      })
    })

  }

  getVisibleHeight = () => {  // 设置饮料规格的ScrollView高度问题
    let systemInfo = Taro.getSystemInfoSync();
    let shoppingImage = Taro.createSelectorQuery().select('#shoppingImage');
    let rpx = 750 / systemInfo.windowWidth;
    let addShopingCar = Taro.createSelectorQuery().select('#addShopingCar');
    shoppingImage.boundingClientRect().exec(rectShoppingImage => {
      addShopingCar.boundingClientRect().exec(rectAddShopingCar => {
        let height = systemInfo.windowHeight * 0.9 - 300 / rpx - rectAddShopingCar[0].height - 50 / rpx;
        this.setState({
          shoppingDialogHeight: systemInfo.windowHeight * 0.9,
          shoppingScrollViewHeight: height
        })
      })
    })
  }

  addShopBag = () => {
    this.setState({ shopBagFlag: true, specificationModalFlag: false })
  }


  render() {
    const { VerticalNavTop, list, TabCur, MainCur, chaData, shopInformation, shopBagFlag, commodityAreaHegiht, loginModalFlag, specificationModalFlag, shoppingDialogHeight, shoppingScrollViewHeight } = this.state;
    return (
      <View>
        <View className='header'>
          <View className='shopname' onClick={this.chooseStore}>{shopInformation.title}<Text className='header-left-direction'> > </Text></View>
          <View className='header-right'>自取</View>
        </View>

        <View className='header-information'>
          <View className='header-information-font'>距离您{Object.keys(shopInformation).length != 0 ? (shopInformation._distance / 1000).toFixed(2) : 0}km</View>
          <View className='header-information-font'>更多门店信息</View>
        </View>

        <View className='main'>
          <ScrollView className='main-left' scrollTop={VerticalNavTop} scrollY scrollWithAnimation enableBackToTop style={shopBagFlag == true ? { height: `${commodityAreaHegiht}px` } : {}}>
            {list.map((item, key) => {
              return <View className={`main-left-item ${item.id == TabCur ? 'text-grey cur' : ''} `} key={item.id} onClick={this.tabSelect.bind(this, key)} >{item.name}</View>
            })}
          </ScrollView>

          <ScrollView className='main-right' scrollY scrollWithAnimation scrollIntoView={`main-${MainCur}`} onScroll={this.VerticalMain} style={shopBagFlag == true ? { height: `${commodityAreaHegiht}px` } : {}}>
            <Image src={waimai} className='main-image' />
            <Image src={shuiguo} className='main-image' />

            {chaData.map((item, key) => {
              return (
                <View className='main-item' id={`main-${key}`}>
                  <View className='main-item-title'>{item.mainTitle}</View>
                  {item.list.map((itemList, keyList) => {
                    return (
                      <View className='main-item-content' key={keyList}>
                        <View className='main-item-content-left'>
                          <Image src={cha1} className='main-item-content-left-image'></Image>
                        </View>
                        <View className='main-item-content-right'>
                          <View className='main-item-content-right-description'>{itemList.commodity}</View>
                          <View className='main-item-content-right-explanation'>{itemList.description}</View>
                          {
                            itemList.price != null ?
                              <View className='main-item-content-right-operating'>
                                <View className='main-item-content-right-operating-money'>{itemList.price}</View>
                                <View className='main-item-content-right-operating-choose' onClick={this.showDetailedSpecifications.bind(this, key, keyList)}>+</View>
                              </View>
                              : ''
                          }
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}

          </ScrollView>
        </View>

        <AtModal isOpened={loginModalFlag} closeOnClickOverlay onClose={this.closeLoginModal}>
          <AtModalHeader>授权茶道</AtModalHeader>
          <AtModalContent>
            <View className='loginDescription'>需要微信授权后登录</View>
          </AtModalContent>
          <AtModalAction>
            <Button open-type='getUserInfo' onGetUserInfo={this.getUserInfo} className='authorizedLogin' lang="zh_CN">立即授权</Button>
          </AtModalAction>
        </AtModal>

        <View className='shoppingBagArea'>
          <View className='shoppingBagPrice'>￥12
             <View className='shoppingBag'>
               <Text>购物袋</Text>
               { shopBagFlag == true ? <View className='commodityCount'>1</View> : '' }
             </View>
          </View>
          <View className='settlement'>结算</View>
        </View>

        <View className='shoppingModal' style={specificationModalFlag == true ? { display: `block` } : { display: `none` }}>
          <View className='shoppingDialog' style={`height: ${shoppingDialogHeight}px`}>
            <View className='close' onClick={this.closeCommodityModal}><Image src={close} /></View>
            <View className='shoppingImage' id='shoppingImage'><Image src={cha1} /></View>

            <ScrollView scrollY scrollWithAnimation className='detailedArea' style={`height: ${shoppingScrollViewHeight}px`}>
              <View className='commodityName'>芝芝桃桃</View>
              <View>
                <Text className='commodityInclusion'>含乳制品</Text>
                <Text className='commodityInclusion'>含桃子</Text>
              </View>
              <View className='commodityInfo'>产品描述</View>
              <View className='commodityInfo'>今夏回归，精选当季水蜜桃肉手工捣碎，搭配甘醇金玉茶底，清新桃气扑面而来。</View>

              <View>
                <View className='commodityInfo commodityInfo-options'>绿色茶</View>
                <View className=''>
                  <AtTag name='conventionalStraw' active className='optionsItem'>常规吸管</AtTag>
                  <AtTag name='paperStraw' className='optionsItem'>纸吸管-口感略有影响</AtTag>
                  <AtTag name='noneStraw' className='optionsItem'>不使用吸管</AtTag>
                </View>
              </View>

              <View>
                <View className='commodityInfo commodityInfo-options'>加料</View>
                <View className=''>
                  <AtTag name='lowSugar' className='optionsItem'>低卡糖（糖的热量降90%）<Text className='optionsItemPrice'>￥1</Text></AtTag>
                  <AtTag name='cheeseFilling' className='optionsItem'>芝士分装<Text className='optionsItemPrice'>￥1</Text></AtTag>
                  <AtTag name='brittleWave' className='optionsItem'>脆波波<Text className='optionsItemPrice'>￥3</Text></AtTag>
                </View>
              </View>
            </ScrollView>

            <View className='addShopingCar' id='addShopingCar'>
              <View className='tap'>
                <View className='info'>
                  <View className='price'>￥ 29</View>
                  <View className='description'>常规吸管</View>
                </View>
                <View className='count'>
                  <View className='less'><Image src={less} /></View>
                  <View className='number'>1</View>
                  <View className='add'><Image src={add} /></View>
                </View>
              </View>
              <View className='addCar'><Button onClick={this.addShopBag}>加入购物袋</Button></View>
            </View>

          </View>
        </View>

      </View >
    );
  }
}

export default Order as ComponentClass<PageOwnProps, PageOwnState>
