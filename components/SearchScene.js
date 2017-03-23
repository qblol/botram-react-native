import React, { Component } from 'react';
import { Container, Content, Header, Item, Input, Button, Footer, FooterTab } from 'native-base';
import {
  BackAndroid,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const iconhome = (<Icon name="home" size={30} color="#6C7A89" />)
const iconcamera = (<Icon name="photo-camera" size={30} color="#6C7A89" />)
const iconfav = (<Icon name="favorite" size={30} color="#6C7A89" />)
const iconSearch = (<Icon name="search" size={30}color="#b71c1c" />)

var {width, height} = require('Dimensions').get('window');

export default class Search extends Component {
  constructor(){
    super()
    this.state = {
      search: '',
      result: [],
      foodId: ''
    }
  }

  searchResult(){
    AsyncStorage.getItem('token').then(token => {
      AsyncStorage.getItem('userId').then(userId => {
        fetch(`http://botram-api-dev.ap-southeast-1.elasticbeanstalk.com/api/users/${userId}`,{
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': token
          },
          body: {
            search: this.state.search
          }
        }).then(res => res.json())
        .then(() => {
          fetch(`http://botram-api-dev.ap-southeast-1.elasticbeanstalk.com/api/users/food/byfood/${this.state.search}`,{
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'token': token
            }
          })
          .then(res => res.json())
          .then(data => this.setState({result:data}))
          .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
      })
    })
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded style={{backgroundColor: '#B71C1C'}}>

            <Item>
                <Icon name="search" color={'#B71C1C'} size={25}/>
                <Input placeholder="Search" onChangeText={(text) => this.setState({search:text})}/>
                <Icon name="navigate-next" color={'#B71C1C'} size={25} onPress={this.searchResult()}/>
            </Item>
        </Header>

        <Content>
          <ScrollView>
            {this.state.result.map((result, index) => {
              return(
                <Content key={index}>
                    <Card>
                       <CardItem style={{margin: -3}}>
                          <Grid>
                            <Col size={20}><Thumbnail source={{uri:result._userId.pic}} /></Col>
                          <Col size={65} style={{marginTop: width/40}}>
                                <Text style={{color:'#b71c1c', fontWeight: 'bold'}}>
                                  {result._userId.name}
                                </Text>
                              <Text style={{fontSize: width/35, marginRight: width/80}}>{result._userId.city}</Text>
                            </Col>
                            <Col size={15}>
                              <Text style={{color:'#6C7A89', marginTop: width/20, fontSize: width/27}}>{result._userId.rating}/5 <Icon name="star" style={{fontSize: width/25}}/></Text>
                            </Col>
                          </Grid>
                       </CardItem>
                       <CardItem cardBody>
                         <Image style={{ resizeMode: 'cover', width: width, height: height/3 }} source={{uri:result.food_pic}}/>
                       </CardItem>
                       <CardItem>
                         <Grid>
                           <Row style={{marginBottom: height/100}}>
                            <Col size={77}>
                              <Text style={{color: '#282828', marginRight: width/100, fontSize: width/22, fontWeight: 'bold'}}>
                                {result.food_title}
                              </Text>
                            </Col>
                            <Col size={23}><Text style={{color: '#282828'}}>Rp {result.food_price}</Text></Col>
                           </Row>
                           <Row>
                            <Col size={77}><Text style={{fontSize: width/27, color: '#6C7A89'}}>Qty : {result.food_qty} pcs</Text></Col>
                            <Col size={23}>
                               <Button
                                 style={{width: width/5, height: height/25, backgroundColor: '#00B16A'}}
                                 onPress={() => {
                                   this.setState({
                                     foodId : result._id,
                                   });
                                   setTimeout(() => {
                                      this.props.navigator.push( {title:'FoodDetails',foodId: this.state.foodId})
                                   }, 100)

                               }}>
                                 <Text style={{color: '#FFFFFF'}}>Detail</Text>
                               </Button>
                             </Col>
                           </Row>
                         </Grid>
                       </CardItem>
                   </Card>
                </Content>
              )
            })}
          </ScrollView>
        </Content>

        <Footer style={{position: 'absolute', bottom:0, left: 0, right: 0}}>
          <FooterTab style={{backgroundColor:'#ECECEC'}}>
            <Button onPress={() => {
              this.props.navigator.push({title:'FavoritesScene'})
            }}>
              {iconfav}
            </Button>
            <Button onPress={() => {
              this.props.navigator.popToTop()
            }}>
              {iconhome}
            </Button>
            <Button>
            {iconSearch}
            </Button>
            <Button onPress={() => {
              this.props.navigator.push({title:'CameraScene'})
            }}>
              {iconcamera}
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    height:height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  judul: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
