import {View, Text} from 'react-native';
import React from 'react';
import {categoryBG, colors} from '../themes';
import {ExpenseType} from '../types';

type ExpenseCardProps = {
  item: ExpenseType;
};
const ExpenseCard = ({item}: ExpenseCardProps) => {
  return (
    <View
      style={{
        backgroundColor: categoryBG[item.category as keyof typeof categoryBG],
      }}
      className="flex-row justify-between items-center p-5 mb-3 rounded-2xl">
      <View>
        <Text className={`${colors.heading} font-bold`}>{item.title}</Text>
        <Text className={`${colors.heading} text-xs`}>{item.category}</Text>
      </View>
      <View>
        <Text>Rs{item.amount}</Text>
      </View>
    </View>
  );
};

export default ExpenseCard;
