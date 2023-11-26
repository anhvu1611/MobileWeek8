import { StyleSheet, Text, View,Image, Pressable, FlatList, TextInput } from 'react-native';
import React, {useState, useEffect} from 'react';

export default function App({navigation}) {
  var [data, setData] = React.useState([]);
  const [newItemName, setNewItemName] = useState('');
  useEffect(() => {
        fetch('https://6540bd5245bedb25bfc27ba1.mockapi.io/api/lab7/apiTakeNote')
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => console.error(error))
  }, []);
  
  //Add item
  const handleAddItem = () => {
    if (!newItemName) {
      // Kiểm tra nếu tên mục mới không được nhập
      alert('Vui lòng nhập tên mục mới');
      return;
    }
    // Gửi request POST để thêm một mục mới
    fetch('https://6540bd5245bedb25bfc27ba1.mockapi.io/api/lab7/apiTakeNote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newItemName }),
    })
      .then((response) => response.json())
      .then((json) => {
        // Cập nhật trạng thái với mục mới
        setData([...data, json]);
        setNewItemName('');
      })
      .catch((error) => console.error(error));
  };
  //delete item
  const handleDeleteItem = (itemId) => {
    fetch(`https://6540bd5245bedb25bfc27ba1.mockapi.io/api/lab7/apiTakeNote/${itemId}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Cập nhật trạng thái bằng cách loại bỏ mục đã xóa
        const updatedData = data.filter((item) => item.id !== itemId);
        setData(updatedData);
      })
      .catch((error) => console.error(error));
  };

  //update item
  const handleUpdateItemName = (itemId, newName) => {
    if (!newName) {
      alert('Vui lòng nhập tên mới');
      return;
    }
    fetch(`https://6540bd5245bedb25bfc27ba1.mockapi.io/api/lab7/apiTakeNote/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName }),
    })
      .then(() => {
        // Cập nhật trạng thái bằng cách cập nhật tên của mục cần cập nhật
        const updatedData = data.map((item) => {
          if (item.id === itemId) {
            return { ...item, name: newName };
          }
          return item;
        });
        setData(updatedData);
      })
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={{fontSize:20, fontWeight:700, color:'blue'}}>Todo List</Text>
      </View>
      <FlatList
        data={data}
        renderItem={({item})=>{
            return (
                <View style={{backgroundColor:'#ffff', height:50, borderRadius:10, marginTop:10, padding:5, flexDirection:'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{backgroundColor: '#48d0f1', justifyContent: 'center', alignItems: 'center', height:40, width:40, borderRadius:10}}>
                            <Text style={{color:'#ffff', fontSize:16}}>{item.id}</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center', marginLeft:20}}>
                            <Text style={{fontSize:20, fontWeight: 'bold'}}>{item.name}</Text>
                        </View>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', width:40, height:40}}>
                        <Pressable 
                            onPress={() => handleDeleteItem(item.id)}
                            style={{backgroundColor:'#48d0f1', width:40, height:40, borderRadius:50, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize:20, fontWeight: 'bold'}}>-</Text>
                        </Pressable>
                    </View>
                </View>
            )
        }}
      />

      <View style={{flexDirection: 'row'}}>
        <TextInput placeholder="Nhập tên" 
            style={{backgroundColor:"white", width:'80%', borderRadius:10, padding: 10, marginRight:10}}
            value={newItemName}
            onChangeText={(text) => setNewItemName(text)}
        />
        <Pressable 
            style={{width:40, height:40, borderRadius:50, backgroundColor:'green', justifyContent: 'center', alignItems: 'center'}}
            onPress={handleAddItem}
        >
            <Text style={{fontSize:20, fontWeight:'bold', color:'white'}}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#48d0f1',
    padding: 20
  },
});

