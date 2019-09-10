import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import { AtAvatar, AtBadge,AtIcon  } from 'taro-ui'

import './index.scss'

import { connect } from '@tarojs/redux';



import vipPic from '../img/vip.png'
import star from '../img/star.png'
import { userdata } from '../../actions/counter';

type PageOwnProps = {}

type PageOwnState = {
    vip: string
}

type State = PageOwnState

type PageMapSateProps = {

}


type PageDispatchProps = {
    userData: {
        userData: Object
    }
}

type IPros = PageMapSateProps & PageDispatchProps & PageOwnProps

interface User {
    props: IPros
}

@connect(({ userData }) => ({
    userData
}), (dispatch) => ({
    
}))

class User extends Component {
    config: Config = {
        navigationBarTitleText: '个人信息'
    }

    constructor() {
        super(...arguments);
    }

    state: State = {
        vip: '茶道会员'
    }

    componentWillMount() {
        Taro.showLoading({ title: '加载中' })
    }

    componentDidMount(){
        Taro.hideLoading()
    }

    gotoHistoryOrder = ()=>{
        Taro.navigateTo({ url: '/pages/historyOrder/index' })
    }

    gotoUserInfo = ()=>{
        Taro.navigateTo({ url: '/pages/userInfo/index' })
    }

    render() {
        const { userData } = this.props;
        return (
            <View>
                <View className='userInfo'>
                    <View className='name-avatar'>
                        <AtAvatar circle image={userData.userData.userInfo.avatarUrl}></AtAvatar>
                        <Text className='userName'>{userData.userData.userInfo.nickName}</Text>
                    </View>
                    <View className='userVip'>{this.state.vip}</View>
                </View>

                <View className='header-other-info'>
                    <View className='header-other-info-item header-other-info-item-margin1'>
                        <View className='header-other-info-item-count'>66</View>
                        <View className='header-other-info-item-name'>积分</View>
                    </View>
                    <View className='header-other-info-item '>
                        <View className='header-other-info-item-count'>0</View>
                        <View className='header-other-info-item-name'>茶道卷</View>
                    </View>
                    <View className='header-other-info-item header-other-info-item-margin2'>
                        <View className='header-other-info-item-count'>0.00</View>
                        <View className='header-other-info-item-name'>钱包</View>
                    </View>
                </View>

                <View className='main-vip-integral'>
                    <AtBadge dot>
                        <View className='main-vip'>
                            <View className='main-image'><Image src={vipPic} className='header-avatar'></Image></View>
                            <View className='main-vip-area'>会员俱乐部</View>
                        </View>
                    </AtBadge>
                    <View className='main-integral'>
                        <View className='main-image'><Image src={star} className='header-avatar'></Image></View>
                        <View className='main-integral-area'>积分商城</View>
                    </View>
                </View>

                <View className='main-list-item main-order' onClick={this.gotoHistoryOrder}><AtIcon value='numbered-list' size='25' className='item-icon'></AtIcon>历史订单</View>

                <View className='main-list-item main-order' onClick={this.gotoUserInfo}><AtIcon value='folder' size='25' className='item-icon'></AtIcon>个人资料</View>

                <View className='main-list-item main-order'><AtIcon value='bell' size='25' className='item-icon'></AtIcon>消息中心</View>

                <View className='main-list-item main-order'><AtIcon value='phone' size='25' className='item-icon'></AtIcon>意见反馈</View>

                <View className='main-list-item main-order'><AtIcon value='alert-circle' size='25' className='item-icon'></AtIcon>关于茶道</View>
            </View>
        );
    }
}

export default User as ComponentClass<PageOwnProps, PageOwnState>