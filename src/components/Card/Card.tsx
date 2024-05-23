import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-easy-icon';

interface CardProps {
  title: string;
  details: { label: string; value: string | number }[];
}

const Card: React.FC<CardProps> = ({ title, details }:any) => {
  return (
    <View style={cardStyles.cardContainer}>
      <View style={cardStyles.cardHeader}>
        <Text style={cardStyles.cardTitle}>{title}</Text>
      </View>
      <View style={cardStyles.cardContent}>
        {details.map((detail:any, index:number) => (
          <View key={index} style={cardStyles.detailContainer}>
            <Text style={cardStyles.detailLabel}>{detail.label}</Text>
            <Text style={cardStyles.detailValue}>{detail.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailContainer: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Card;
