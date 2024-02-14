import React, { useState } from "react";
import { View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Feather";
const SearchableComponent = ({
  data,
  searchKey,
  placeholder,
  onFilter,
}: any) => {
  const handleSearch = (text: any) => {
    if (text) {
      const filteredData = data.filter((item: any) =>
        item[searchKey].toLowerCase().includes(text.toLowerCase())
      );
      onFilter(filteredData);
    } else {
      onFilter(data);
    }
  };

  return (
    <View>
      <View
        style={{
          backgroundColor: "#fff",
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 10,
          marginTop: 15,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: 5,
        }}
      >
        <TextInput
          placeholder={`Search by ${placeholder}`}
          onChangeText={handleSearch}
          placeholderTextColor="gray"
          style={{ padding: 5, flex: 1, fontSize: 16, color: "#000" }}
        />
        <Icon name="search" size={20} color={"#000"} />
      </View>
    </View>
  );
};
export default SearchableComponent;
