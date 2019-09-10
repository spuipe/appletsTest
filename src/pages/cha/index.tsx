import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'

import './index.scss'

import apple from '..//img/apple.png'
import scanning from '../img/scanning.png'

type PageOwnProps = {}

type PageOwnState = {
    imageurl: string
}

type State = PageOwnState

class Cha extends Component {
    config: Config = {
        navigationBarTitleText: '取茶'
    }

    constructor() {
        super(...arguments);
    }

    state: State = {
        imageurl: ''
    }

    gotoOrder = () => { 
        Taro.switchTab({ url: '/pages/order/index' })
    }

    gotoHistoryOrder = () => {
        Taro.navigateTo({ url: '/pages/historyOrder/index' })
    }

    usecamera = () => { }

    render() {
        return (
            <View>
                <View className='page'>
                    <View className='main'>
                        <View className='main-image'><Image src={apple} className='main-apple'></Image></View>
                        <View className='main-order1'>您今天还没有下单</View>
                        <View className='main-order2'>快去选择一杯喜欢的茶吧</View>

                        <View className='to-order' onClick={this.gotoOrder}>去点单</View>
                        <View className='history-order' onClick={this.gotoHistoryOrder}>历史订单></View>
                    </View>

                    <View className='scanning' onClick={this.usecamera}><Image src={scanning} className='scanning-image'></Image></View>
                </View>
            </View>
        );
    }
}

export default Cha as ComponentClass<PageOwnProps, PageOwnState>