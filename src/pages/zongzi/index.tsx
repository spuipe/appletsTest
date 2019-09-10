import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'

import './index.scss'

import zongziDong from  '../img/zongziDong.gif'

type PageOwnProps = {}

type PageOwnState = {}

type State = PageOwnState

class ZongZi extends Component {
    config: Config = {
        navigationBarTitleText: '粽子工厂'
    }

    constructor() {
        super(...arguments);
    }

    state: State = {}

    toshop = ()=>{}

    render() {
        return (
            <View>
                <View className='main'>
                    <View><Image src={zongziDong}></Image></View>
                    <View className='toshop' onClick={this.toshop}>前往购买</View>
                </View>
            </View>
        );
    }
}

export default ZongZi as ComponentClass<PageOwnProps, PageOwnState>