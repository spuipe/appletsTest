import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, ScrollView, Map } from '@tarojs/components'

import './index.scss'
import { connect } from '@tarojs/redux';
import QQMapWX from '../../utils/qqmap-wx-jssdk.min.js'
import {location as locationInfo} from '../../actions/counter';

let qqmapsdk = new QQMapWX({ key: 'U3HBZ-TEYW4-76HUD-DZQBT-KXY22-NJBUE' })

interface MarkersItem {
    iconPath: string
    id: number
    longitude: number
    latitude: number
    width: number
    height: number
    callout: any
}

interface shopListItem {
    ad_info: Object
    address: string
    category: string
    id: string
    location: Object
    tel: number
    title: string
    type: number
    _distance: number
}

type PageOwnProps = {}

type PageOwnState = {
    markers: Array<MarkersItem>
    city: string
    district: string
    longitude: number
    latitude: number
    shopListHeight: number
    shopList: Array<shopListItem>
}

type State = PageOwnState

type PageMapSateProps = {
    location: Object
    recentShop: Object
}

type PageDispatchProps = {
    setLocation: ()=>void
}

type IPros = PageMapSateProps & PageDispatchProps & PageOwnProps

interface OrderAddress {
    props: IPros
}


@connect(({ location, recentShop }) => ({
    location, recentShop
}), (dispatch) => ({
   setLocation(location){
       dispatch(locationInfo(location))
   }
}))

class OrderAddress extends Component {
    config: Config = {
        navigationBarTitleText: '选择门店'
    }

    constructor() {
        super(...arguments);
    }

    calloutItem = {
        color: '#000',
        fontSize: 14,
        borderRadius: 10,
        borderColor: '#fff',
        bgColor: '#fff',
        padding: 10,
        display: 'ALWAYS',
        textAlign: 'center'
    }

    state: State = {
        markers: [],
        city: '',
        district: '',
        longitude: 0,
        latitude: 0,
        shopListHeight: 0,
        shopList: []
    }

    componentWillMount() {
        Taro.showLoading({ title: '加载中' })
        const { recentShop } = this.props;
        this.setState({
            latitude: recentShop.recentShop.location.lat,
            longitude: recentShop.recentShop.location.lng
        })
    }

    componentDidShow(){}

    componentDidMount() {
        const { location } = this.props
        Taro.hideLoading()
        this.calculateShopListHeight()

        qqmapsdk.reverseGeocoder({  // 根据经纬度获取信息
            location: { latitude: location.location.latitude, longitude: location.location.longitude },
            get_poi: 1,
            success: (res) => {
                this.setState({
                    city: res.result.address_component.city,
                    district: res.result.address_component.district
                })

                // 查找附件店铺
                this.searchShop(location.location.latitude,location.location.longitude)
            }
        })
    }

    searchShop = (latitude,longitude) => {
        // 查找附件店铺
        qqmapsdk.search({
            keyword: '喜茶',
            location: { latitude: latitude, longitude: longitude },
            success: (data) => {
                let markers: any = [];
                let shopList: any = [];
                data.data.map((item) => {
                    let markersItem = { iconPath: '../img/HEETEA.jpg', width: 20, height: 20 }
                    if (item.title.indexOf('喜茶') != -1) {
                        shopList.push(item);
                        let { id, title, location } = item;
                        Object.assign(markersItem, { id, longitude: location.lng, latitude: location.lat }, { callout: { content: title, ...this.calloutItem } })
                        markers.push(markersItem)
                    }
                })
                this.setState({ markers, shopList })
            }
        })
    }

    calculateShopListHeight = () => {  // 计算地址列表的高度
        let deviceInfo = Taro.getSystemInfoSync();  // 同步获取设备信息
        let query = Taro.createSelectorQuery();
        query.select('#mapHeader').boundingClientRect().exec(rectMapHeight => {
            query.select('#map').boundingClientRect().exec(rectMap => {
                let height = deviceInfo.windowHeight - rectMapHeight[0].height - rectMap[0].height;
                this.setState({ shopListHeight: height })
            })
        });
    }

    toShopItem = (item) => {
        console.log(item);
        this.searchShop(item.location.lat,item.location.lng)
        this.setState({
            longitude: item.location.lng,
            latitude: item.location.lat,
            district: item.ad_info.district,
            city: item.ad_info.city
        })
        this.props.setLocation({latitude:item.location.lat,longitude:item.location.lng})
        Taro.navigateBack()
    }

    mapTap = (e)=>{
        console.log(e.markerId);
        const { markers } = this.state;
        for(let item in markers){
            if(markers[item].id == e.markerId){
                this.searchShop(markers[item].latitude,markers[item].longitude);
            }
        }
    }

    render() {
        const { latitude,longitude } = this.state
        return (
            <View>
                <View id='mapHeader' className='mapHeader'>
                    <View><Text className='city'>{this.state.city}</Text><Text className='city'>{this.state.district}</Text>></View>
                    <View className='search'>搜索</View>
                </View>
                <Map id='map' markers={this.state.markers} longitude={longitude} latitude={latitude} className='map' onMarkerTap={this.mapTap}></Map>

                <View className='shopListArea' style={`height: ${this.state.shopListHeight}px`}>
                    <ScrollView className='shopList' style={`height: ${this.state.shopListHeight}px`} scrollY scrollWithAnimation>
                        {this.state.shopList.map(item => {
                            return (
                                <View className='shopListItem'>
                                    <View className='itemInfo'>
                                        <View className='itemName'>{item.title}</View>
                                        <View className='itemDistance'>距离您 {(item._distance / 1000).toFixed(2)}km</View>
                                        <View className='itemAddress'>{item.address}</View>
                                        <View className='itemTime'>营业时间 10:00~22:00</View>
                                    </View>
                                    <View className='itemGo' onClick={this.toShopItem.bind(this, item)}>去下单</View>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export default OrderAddress as ComponentClass<PageOwnProps, PageOwnState>