import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import {colors} from '../themes';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../navigation/AppNavigation';
import EmptyList from '../components/EmptyList';
import BackButton from '../components/BackButton';
import ExpenseCard from '../components/ExpenseCard';
import {ExpenseType} from '../types';
import {useIsFocused} from '@react-navigation/native';
import {getDocs, query, where} from 'firebase/firestore';
import {expensesRef} from '../config/firebase';
import Loading from '../components/Loading';

type TripExpensesScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'TripExpenses'
>;
const TripExpensesScreen = ({navigation, route}: TripExpensesScreenProps) => {
  const {id, country, place} = route.params;
  const [expenses, setExpense] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const fetchExpense = async () => {
    setLoading(true);
    const q = query(expensesRef, where('tripId', '==', id));
    const querySnapShot = await getDocs(q);
    const data: ExpenseType[] = [];
    querySnapShot.forEach(doc => {
      data.push({
        id: doc.id,
        title: doc.data().title,
        amount: doc.data().amount,
        category: doc.data().category,
      });
    });
    setLoading(false);
    setExpense(data);
  };
  useEffect(() => {
    if (isFocused) {
      fetchExpense();
    }
  }, [isFocused]);
  return (
    <ScreenWrapper>
      <View className="px-4">
        <View className="relative mt-5">
          <View className="absolute top-2 left-0 z-[1]">
            <BackButton />
          </View>
          <View>
            <Text className={`${colors.heading} text-xl font-bold text-center`}>
              {place}
            </Text>
            <Text className={`${colors.heading} text-xs text-center`}>
              {country}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-center items-center rounded-xl mb-4">
          <Image
            source={require('../assets/images/7.png')}
            className="w-80 h-80"
          />
        </View>
        <View className="space-y-3 h-1/2">
          <View className="flex-row justify-between items-center">
            <Text className={`${colors.heading} font-bold text-xl`}>
              Expenses
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddExpense', {id, country, place})
              }
              className="p-2 px-3 bg-white border-gray-200 border rounded-full">
              <Text className={`${colors.heading}`}>Add Expense</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 330}}>
            {loading ? (
              <Loading />
            ) : (
              <FlatList
                data={expenses}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                ListEmptyComponent={
                  <EmptyList message="You haven't recorded any expenses yet" />
                }
                // contentContainerStyle={{flex: 1}}
                className="mx-1"
                renderItem={({item}) => {
                  return <ExpenseCard item={item} />;
                }}
              />
            )}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default TripExpensesScreen;
