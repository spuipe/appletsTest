import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'

import './index.scss'

import naicha from '../img/naicha.jpg'

type PageOwnProps = {}

type PageOwnState = {

}

type State = PageOwnState

class HistoryOrder extends Component {
    config: Config = {
        navigationBarTitleText: '历史订单'
    }

    constructor() {
        super(...arguments);
    }

    state: State = {

    }


    render() {
        return (
            <View>
                <View className='header'>
                    <View className='header-left'>星球会员购买记录</View>
                    <View className='header-right'>查看></View>
                </View>

                <View className='main-area'>
                    <View className='main-item item1'>
                        <View className='item-header'>
                            <View className='item-header-left'>北京路</View>
                            <View className='item-header-right'>已完成></View>
                        </View>

                        <View className='item-image'>
                            <Image src={naicha} className='item-image-detailed'></Image>
                        </View>

                        <View>
                            <View className='order-style'><Text>订单编号：</Text><Text>020007201904102024218457</Text></View>
                            <View className='order-style order-time-money'>
                                <View><Text>下单时间：</Text><Text>2019-04-10 20:24:26</Text></View>
                                <View className='order-money'>￥41.00</View>
                            </View>
                        </View>
                    </View>
                </View>

                <View className='no-order'>没有更多订单了~</View>
            </View>
        );
    }
}

export default HistoryOrder as ComponentClass<PageOwnProps, PageOwnState>