import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, RadioGroup, Radio, Label, Picker,Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'

import './index.scss'

import avatar from '../img/avatar.jpg'

type PageOwnProps = {}

type PageOwnState = {
    name: string
    phone: string
    birthday: string
}

type State = PageOwnState

class UserInfo extends Component {
    config: Config = {
        navigationBarTitleText: '我的信息'
    }

    constructor() {
        super(...arguments);
    }

    state: State = {
        name: '',
        phone: '',
        birthday: ''
    }

    componentWillMount() {
        Taro.showLoading({ title: '加载中' })
    }

    componentDidMount() {
        Taro.hideLoading()
    }

    bindDateChange = (e)=>{
        this.setState({ birthday: e.detail.value })
    }


    render() {
        return (
            <View>
                <View className='header'>
                    <View className='header-user'><AtAvatar circle image='https://jdc.jd.com/img/200' className='header-image'></AtAvatar></View>
                    <View className='header-username'>白纸扇</View>
                </View>

                <View className='hr'></View>

                <View className='main'>
                    <View className='main-item'>
                        <View className='main-item-left'>昵称</View>
                        <View className='main-item-right'><Text>{this.state.name}</Text></View>
                    </View>

                    <View className='main-item'>
                        <View className='main-item-left'>手机号</View>
                        <View className='main-item-right'><Text>{this.state.phone}</Text></View>
                    </View>

                    <View className='main-item'>
                        <View className='main-item-left'>性别</View>
                        <View className='main-item-right'>
                            <RadioGroup>
                                <Label className='main-item-sex'><Radio value='1' />男</Label>
                                <Label><Radio value='0' />女</Label>
                            </RadioGroup>
                        </View>
                    </View>

                    <View className='main-item'>
                        <View className='main-item-left'>生日</View>
                        <View className='main-item-right'><Picker  mode="date" onChange={this.bindDateChange} value='YYYY-MM-DD'><Text className='main-birthday'>{this.state.birthday}</Text></Picker></View>
                    </View>

                    <View className='save'>保存</View>
                </View>
            </View >
        );
    }
}

export default UserInfo as ComponentClass<PageOwnProps, PageOwnState>