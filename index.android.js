import React, { AppRegistry } from 'react-native';
import App from './app/containers/app';

AppRegistry.registerComponent('ToDoApp', () => App);

/*import React, { Component } from 'react';
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

    this.getList = this.getList.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  componentWillMount(nextProps, nextState) {
    this.getList();
  }

  getList() {
    return fetch('http://192.168.0.132:3000/tasks')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          items: responseJson.tasks,
          dataSource: this.state.dataSource.cloneWithRows(responseJson.tasks)
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  create(params) {
    let url = 'http://192.168.0.132:3000/tasks/';

    return fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: params
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        let newItems = this.state.items.concat(responseJson);

        this.setState({
          text: '',
          isEdit: false,
          items: newItems,
          dataSource: this.state.dataSource.cloneWithRows(newItems)
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  update(params) {
    let url = 'http://192.168.0.132:3000/tasks/' + params.id;

    return fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: params
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        let updateItems = this.state.items.slice();
        updateItems[this.state.index] = responseJson;

        this.setState({
          text: '',
          index: null,
          items: updateItems,
          dataSource: this.state.dataSource.cloneWithRows(updateItems)
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  destroy(id) {
    let url = 'http://192.168.0.132:3000/tasks/' + id;
    // let items = this.state.items
    // items.splice(this.state.index, 1);

    return fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then((response) => {
        // let items = this.state.items.filter(function(obj) {
        //   return obj.id !== id;
        // })
        let items = this.state.items
        delete items[this.state.index];
        console.log(items)

        this.setState({
          items: items,
          dataSource: this.state.dataSource.cloneWithRows(items)
        });
      }).catch((error) => { console.error(error); });
  }

  onSubmit() {
    var text = this.state.text;

    if (text) {
      if (this.state.isEdit) {
        var updateItems = this.state.items.slice();
        let status = this.state.item.aasm_state;
        let newText = (status  == 'completed' ? (text + ' - Completed') : text);

        updateItems[this.state.index] = {
          id: this.state.item.id,
          text: newText,
          aasm_state: status
        };

        this.update(updateItems[this.state.index]);
        // updateItems[this.state.index] = { text: text };

        // this.setState({
        //   text: '',
        //   isEdit: false,
        //   index: null,
        //   items: updateItems,
        //   dataSource: this.state.dataSource.cloneWithRows(updateItems)
        // });
      } else {
        // var item = this.state.items;
        // var newItems = items.concat({ text: text });
        // console.log(this.state);

        let item = { text: text };
        this.create(item);

        // this.setState({
        //   text: '',
        //   isEdit: false,
        //   items: newItems,
        //   dataSource: this.state.dataSource.cloneWithRows(newItems)
        // });
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
      text: item.text.split(' - ')[0],
      isEdit: isEdit,
      index: index,
      item: item
    })
  }

  onDelete(id, index) {
    // console.log(index)
    this.setState({ index: index }, function() { this.destroy(id); });

    // var items = this.state.items;
    // items.splice(index, 1);

    // this.setState({
    //   items: items,
    //   dataSource: this.state.dataSource.cloneWithRows(items)
    // });
  }

  onCompleted(item, index, checked) {
    // var items = this.state.items;
    var updateItems = this.state.items.slice();

    if (checked) {
      // items[index].title = item.title + ' - Completed';
      updateItems[index] = {
        id: item.id,
        text: item.text + ' - Completed',
        aasm_state: 'completed'
      };
      this.setState({ index: index }, function() {
        this.update(updateItems[index]);
      });
    } else {
      // items[index].title = item.title.split(' - ')[0];
      updateItems[index] = {
        id: item.id,
        text: item.text.split(' - ')[0],
        aasm_state: 'uncompleted'
      };
      this.setState({ index: index }, function() {
        this.update(updateItems[index]);
      });
    }

  }

  renderRow(item, sectionId, rowId) {
    return (
      <ToDoItem item={item}
        sectionId={sectionId} rowId={rowId} onEdit={this.onEdit}
        onDelete={this.onDelete} onCompleted={this.onCompleted}/>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput onChangeText={(text) => this.setState({text})} value={this.state.text}
          placeholder='Enter a to do item'/>

        <Button onPress={this.onSubmit} title='Save' color="#1e90ff" />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(item, sectionId, rowId) =>  <ToDoItem item={item}
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

    let item = this.props.item
    let status = item.aasm_state == 'completed' ? true : false;

    this.state = {
      title: '',
      checked: status,
      item: this.props.item
    };

    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.completed = this.completed.bind(this);
  }

  // _toggleChecked() {
  //   var checked = !this.state.checked;

  //   this.setState({ checked: checked });
  //   this.props.onChange && this.props.onChange(this.props.item.title, checked);
  // }

  edit() {
    this.props.onEdit(this.props.item, this.props.rowId, true);
  }

  delete() {
    // this.props.onDelete(this.props.rowId);
    this.props.onDelete(this.props.item.id, this.props.rowId);
  }

  completed() {
    let checked = !this.state.checked;
    let item = this.props.item;

    this.setState({ checked: checked }, function() {
      this.props.onCompleted(item, this.props.rowId, checked);
    });
  }

  render() {
    let item = this.props.item
    let status = item.aasm_state == 'completed' ? true : false
    console.log(status)
    return (
      <View style={styles.containerItem}>
        <CheckBox style={styles.checkBox} isChecked={status} onClick={this.completed} />
        <Text style={{ width: 320 }} onPress={this.edit}>{item.text}</Text>
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
*/
