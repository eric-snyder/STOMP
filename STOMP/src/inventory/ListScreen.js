import React from 'react';
import { Alert, ActivityIndicator, View, Text, FlatList } from 'react-native';
import { StackNavigator } from 'react-navigation';

// This is the list from React Native Elements
import { ListItem, SearchBar} from 'react-native-elements'

export default class ListScreen extends React.Component {

  constructor(props){
    super(props);
    const { params } = this.props.navigation.state;
    this.state={
      loading: true,
      list: [],
      searchInput: '',
      token: "",
      email: "",
    }
  }

  componentDidMount = () => {
    this._getList();
    this.setState({token: this.props.navigation.state.token})
  }

  // These are for react navigation, like header bar and such
  static navigationOptions = {
      title: 'List',
        headerStyle: {
          backgroundColor: '#272727',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
  };

  _getList= () => {
    this.setState({
      loading: true,
    });
    // Having a timout of a second makes refreshing seem like it 'works' !
    setTimeout(this._getList_afterTimeout, 1000);
  }

  _getList_afterTimeout = () => {
    request = new XMLHttpRequest();
    request.open('GET', 'https://shrouded-crag-14655.herokuapp.com/getList', true);
    let self = this;
    request.onreadystatechange = () => {
      if (request.readyState == 4 && request.status == 200) {
        responseString = request.responseText;
        let _list = JSON.parse(responseString); //response text into array
        console.log(_list);
        self.setState({
          list: _list,
          loading: false,
        })
      }
      //TODO: else case
    };
    request.send();
  }

  // TODO: maybe use the GUID as the key?
  _keyExtractor = (item, index) => {
    return (item._id);
  }

  _renderItem = ({ item }) => {
    // this is the navigator we passed in from App.js
    const { navigate } = this.props.navigation;

    return(
      <ListItem
        title={item.name}
        onPress={ () => { navigate('Item', { name: item.name, id: item._id, token: this.state.token, email: this.state.email}) } }
        chevron
        bottomDivider={true}
      />
    )
  }

  _filterItems = (items) => {
  return items.filter(item => (item.name.toLowerCase().includes(this.state.searchInput))).sort();
  }

  render() {
    return (
      <View style={{height: "100%"}}>
          <SearchBar
            cancelButtonTitle="Cancel"
            placeholder="Search (Ex. foo)"
            containerStyle={{backgroundColor: 'transparent'}}
            onChangeText={(str) => {this.setState({searchInput: str.toLowerCase()})}}
            onClearText={() => this.setState({searchInput: ''})}
            value={this.state.searchInput}
            lightTheme
            clearIcon={this.state.searchInput !== ''}
          />
          <FlatList
            keyExtractor={this._keyExtractor}
            data={this._filterItems(this.state.list)}
            renderItem={this._renderItem}
            onRefresh={()=>{this._getList()}}
            refreshing={this.state.loading}
          />
      </View>
    );
  }
}
