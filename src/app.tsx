import '@tarojs/async-await'
import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [      
      'pages/order/index',
      'pages/user/index',
      'pages/zongzi/index',
      'pages/cha/index',
      'pages/historyOrder/index',
      'pages/userInfo/index',
      'pages/orderAddress/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '小品茶道',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#DCDCDC',
      selectedColor: '#696969',
      list: [
        {
          pagePath: "pages/order/index",
          text: "点单",
          iconPath: "pages/img/order.png",
          selectedIconPath: "pages/img/orderactive.png"
        },
        {
          pagePath: "pages/zongzi/index",
          text: "粽子工厂",
          iconPath: "pages/img/zongzi.png",
          selectedIconPath: "pages/img/zongziactive.png"
        },
        {
          pagePath: "pages/cha/index",
          text: "取茶",
          iconPath: "pages/img/cha.png",
          selectedIconPath: "pages/img/chaactive.png"
        },
        {
          pagePath: "pages/user/index",
          text: "我的",
          iconPath: "pages/img/user.png",
          selectedIconPath: "pages/img/useractive.png"
        }
      ]
    },
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示'
      }
    }
  }


  componentWillMount() {
  }

  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
