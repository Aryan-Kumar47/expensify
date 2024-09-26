import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import {colors} from '../themes';
import BackButton from '../components/BackButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../navigation/AppNavigation';
import {categories} from '../constants';
import Snackbar from 'react-native-snackbar';
import {addDoc} from 'firebase/firestore';
import {expensesRef} from '../config/firebase';
import Loading from '../components/Loading';

type AddExpenseScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  'AddExpense'
>;
const AddExpenseScreen = ({navigation, route}: AddExpenseScreenProps) => {
  const {id, country, place} = route.params;
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const handleAddExpense = async () => {
    if (title && amount && category) {
      setLoading(true);
      let doc = await addDoc(expensesRef, {
        title,
        amount,
        category,
        tripId: id,
      });
      setLoading(false);
      if (doc && doc.id) {
        navigation.goBack();
      }
    } else {
      Snackbar.show({
        text: 'Please fill all the fields!',
        backgroundColor: 'red',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };
  return (
    <ScreenWrapper>
      <ScrollView>
        <View className="flex justify-between h-full mx-4">
          <View>
            <View className="relative mt-5">
              <View className="absolute top-0 left-0 z-[1]">
                <BackButton />
              </View>
              <Text
                className={`${colors.heading} text-xl font-bold text-center`}>
                Add Expense
              </Text>
              <Text
                className={`${colors.heading} opacity-70 text-base font-bold text-center`}>
                {place}, {country}
              </Text>
            </View>
            <View className="flex-row justify-center my-3 mt-5">
              <Image
                className="w-72 h-72"
                source={require('../assets/images/expenseBanner.png')}
              />
            </View>
            <View className="space-y-2 mx-2">
              <Text className={`${colors.heading} text-lg font-bold`}>
                For What?
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                className={`p-4 bg-white rounded-full mb-3 ${colors.heading}`}
              />
              <Text className={`${colors.heading} text-lg font-bold`}>
                How Much
              </Text>
              <TextInput
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                className={`p-4 bg-white rounded-full mb-3 ${colors.heading}`}
              />
            </View>
            <View className="mx-2 space-x-2">
              <Text className={`text-lg font-bold ${colors.heading}`}>
                Category
              </Text>
              <View className="flex-row flex-wrap items-center">
                {categories.map(cat => {
                  let bgColor = 'bg-white';
                  if (cat.value == category) bgColor = 'bg-green-200';
                  return (
                    <TouchableOpacity
                      onPress={() => setCategory(cat.value)}
                      key={cat.value}
                      className={`rounded-full ${bgColor} px-4 p-3 mb-2 mr-2`}>
                      <Text className={`${colors.heading}`}>{cat.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
          <View>
            {loading ? (
              <Loading />
            ) : (
              <TouchableOpacity
                onPress={handleAddExpense}
                style={{backgroundColor: colors.button}}
                className="my-6 rounded-full p-3 shadow-sm mx-2">
                <Text className="text-center text-white text-lg font-bold">
                  Add Expense
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default AddExpenseScreen;
