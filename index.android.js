/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import CheckBox from 'react-native-checkbox';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  Alert,
  Button
} from 'react-native';

class ToDoApp extends Component {
  render() {
    return (
      <ToDoList />
    );
  }
}

class ToDoList extends Component {
  constructor(props) {
    super(props);
    
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      text: '',
      items: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
      // dataSource: ds.cloneWithRows([
      //   { title: 'Create new react app' }, { title: 'Fix errors'}
      // ])
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    var text = this.state.text;
    var message = text ? text : "Title can't be blank";
    var items = this.state.items.concat({ title: text });

    this.setState({
      items: items,
      dataSource: this.state.dataSource.cloneWithRows(items)
    });

    // Alert.alert('Alert Title', message,
    //   [{text: 'OK', onPress: () => console.log('OK Pressed')}]
    // );
  }

  render() {
    return (
      <View>
        <TextInput onChangeText={(text) => this.setState({text})} value={this.state.text}
          placeholder='Enter a to do item'/>

        <Button onPress={this.onSubmit} title='Save' color="#841584" />
        <ListView dataSource={this.state.dataSource} renderRow={(item) => <ToDoItem item={item} />} />
      </View>
    );
  }
}

class ToDoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      onChange: null,
      checked: false
    };

    this._toggleChecked = this._toggleChecked.bind(this);
  }

  _toggleChecked() {
    var checked = !this.state.checked;
    this.setState({ checked: checked });
    this.props.onChange && this.props.onChange(this.props.name, checked);
  }

  render() {
    var item = this.props.item
    return (
      <View>
        <CheckBox label={item.title}
          onChange={this._toggleChecked} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
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

AppRegistry.registerComponent('ToDoApp', () => ToDoApp);
