/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import CheckBox from 'react-native-check-box';
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
      isEdit: false,
      index: null,
      item: null,
      items: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    };
      // dataSource: ds.cloneWithRows([
      //   { title: 'Create new react app adsfasdfad asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf adsfadsf asdfasdf adfasdf' },
      //   { title: 'Fix errors'}
      // ])

    this.onSubmit = this.onSubmit.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCompleted = this.onCompleted.bind(this);
  }

  onSubmit() {
    var text = this.state.text;

    if (text) {
      if (this.state.isEdit) {
        var updateItems = this.state.items.slice();
        updateItems[this.state.index] = { title: text };

        this.setState({
          text: '',
          isEdit: false,
          index: null,
          item: null,
          items: updateItems,
          dataSource: this.state.dataSource.cloneWithRows(updateItems)
        });
      } else {
        var items = this.state.items;
        var newItems = items.concat({ title: text });

        this.setState({
          text: '',
          isEdit: false,
          items: newItems,
          dataSource: this.state.dataSource.cloneWithRows(newItems)
        });
      }
    } else {
      var message = "Title can't be blank";

      Alert.alert('Alert Title', message,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}]
      );
    }
  }

  onEdit(item, index, isEdit) {
    this.setState({
      text: item.title,
      isEdit: isEdit,
      index: index,
      item: item
    })
  }

  onDelete(index) {
    var items = this.state.items;
    items.splice(index, 1);

    this.setState({
      items: items,
      dataSource: this.state.dataSource.cloneWithRows(items)
    });
  }

  onCompleted(item, index, checked) {
    var items = this.state.items;
    var updateItems = this.state.items.slice();

    if (checked) {
      // items[index].title = item.title + ' - Completed';
      updateItems[index] = { title: item.title + ' - Completed' };
    } else {
      // items[index].title = item.title.split(' - ')[0];
      updateItems[index] = { title: item.title.split(' - ')[0] };
    }

    this.setState({
      items: updateItems,
      dataSource: this.state.dataSource.cloneWithRows(updateItems)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput onChangeText={(text) => this.setState({text})} value={this.state.text}
          placeholder='Enter a to do item'/>

        <Button onPress={this.onSubmit} title='Save' color="#1e90ff" />
        <ListView
          dataSource={this.state.dataSource} renderRow={(item, sectionId, rowId) => <ToDoItem item={item}
          sectionId={sectionId} rowId={rowId} onEdit={this.onEdit}
          onDelete={this.onDelete} onCompleted={this.onCompleted}/>}
          enableEmptySections={true}
        />
      </View>
    );
  }
}

class ToDoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      checked: false
      // onChange: null,
    };

    // this._toggleChecked = this._toggleChecked.bind(this);
    // this.onChange = this.onChange.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.completed = this.completed.bind(this);
  }

  // _toggleChecked() {
  //   var checked = !this.state.checked;

  //   this.setState({ checked: checked });
  //   this.props.onChange && this.props.onChange(this.props.item.title, checked);
  // }

  // onChange(title, checked) {
  //   console.log('yuhuu');
  // }

  edit() {
    this.props.onEdit(this.props.item, this.props.rowId, true);
  }

  delete() {
    this.props.onDelete(this.props.rowId);
  }

  completed() {
    var checked = !this.state.checked;

    this.setState({ checked: checked });
    this.props.onCompleted(this.props.item, this.props.rowId, checked);
  }

  render() {
    var item = this.props.item

    return (
      <View style={styles.containerItem}>
        <CheckBox style={styles.checkBox} isChecked={false} onClick={this.completed} />
        <Text style={{ width: 320 }} onPress={this.edit}>{item.title}</Text>
        <Text onPress={this.delete}>x</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerItem: {
    marginTop: 10,
    flexDirection: 'row',
  },
  checkBox: {
    width: 30
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
