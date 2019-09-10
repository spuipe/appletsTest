import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'

import './index.scss'

type PageOwnProps = {}

type PageOwnState = {

}

type State = PageOwnState

type PageMapSateProps = {

}

type PageDispatchProps = {}

type IPros = PageMapSateProps & PageDispatchProps & PageOwnProps

interface User {
    props: IPros
}



class User extends Component {
    config: Config = {
        navigationBarTitleText: '登录'
    }

    constructor() {
        super(...arguments);
    }

    state: State = {
        userInfo: {
            avatarUrl: '',
            nickName: ''
        }
    }

    componentWillMount() {
        let userInfo = Taro.getStorage({key: 'userInfo'})
        if(userInfo){
            Taro.navigateTo({url: '/pages/order/index'})
        }
    }

    getUserInfo = (userInfo) => {
        console.log('userInfo', userInfo);
        if (userInfo.detail.userInfo) {   //同意
            //this.props.setBasicInfo(userInfo.detail.userInfo) //将用户信息存入redux
            Taro.setStorage({ key: 'userInfo', data: userInfo.detail.userInfo })
            Taro.navigateTo({
                url: '/pages/order/index'
            })
        } else { //拒绝,保持当前页面，直到同意 
        }

    }
   
    render() {
        return (
            <View className='main'>
                <Text>申请获取你的公开信息（昵称、头像等）</Text>
                <Button open-type='getUserInfo' onGetUserInfo={this.getUserInfo} > 微信授权 </Button>
            </View>
        );
    }
}

export default User as ComponentClass<PageOwnProps, PageOwnState>