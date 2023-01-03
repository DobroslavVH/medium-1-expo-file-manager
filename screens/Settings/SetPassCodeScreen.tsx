import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import * as SecureStore from 'expo-secure-store'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import useLock from '../../hooks/useLock'
import { setSnack } from '../../features/files/snackbarSlice'
import styles from './SetPassCodeScreenStyle'


const SetPassCodeScreen: React.FC = () => {

  const dispatch = useAppDispatch()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { colors } = useAppSelector((state) => state.theme.theme)

  const [newPinFirst, setNewPinFirst] = useState<string>('')
  const [newPinSecont, setNewPinSecont] = useState<string>('')
  const [firstPinDone, setFirstPinDone] = useState(false)
  const [secret, setSecret] = useState('')
  const [checkPin, setCheckPin] = useState('')
  const [dotsArray, setDotsArray] = useState<boolean[]>([
    false,
    false,
    false,
    false
  ])

  const { pinActive } = useLock()

  const getSecret = async () => {
    SecureStore.getItemAsync('secret').then((res) => setSecret(res))
  }

  useEffect(() => {
    getSecret()
  }, [])

  useEffect(() => {
    if (checkPin.length === 4) {
      if (secret === checkPin) {
        SecureStore.deleteItemAsync('secret').then(() => {
          SecureStore.deleteItemAsync('hasPassCode').then(() => {
            dispatch(setSnack({ message: 'PIN code is removed' }))
            navigation.goBack()
          })
        })
      } else {
        dispatch(setSnack({ message: 'Wrong PIN' }))
        setCheckPin('')
      }
    }
  }, [checkPin])

  useEffect(() => {
    if (!pinActive) {
      const firstPinLen = newPinFirst.length
      const secontPinLen = newPinSecont.length
      if (firstPinLen === 4) {
        setFirstPinDone(true)
      }
      if (firstPinLen === 4 && secontPinLen === 4) {
        if (newPinFirst === newPinSecont) {
          savePinToStorage()
        } else {
          dispatch(setSnack({ message: 'Pins are not the same' }))
          setNewPinFirst('')
          setNewPinSecont('')
          setFirstPinDone(false)
        }
      }
    }
  }, [newPinFirst, newPinSecont])

  const savePinToStorage = async () => {
    SecureStore.setItemAsync('hasPassCode', JSON.stringify(true)).then(() => {
      SecureStore.setItemAsync('secret', newPinFirst).then(() => {
        dispatch(setSnack({ message: 'New PIN is set' }))
        navigation.goBack()
      })
    })
  }

  const handleRemove = () => {
    if (!firstPinDone && newPinFirst.length > 0) {
      setNewPinFirst((prev) => prev.slice(0, prev.length - 1))
    }
    if (firstPinDone && newPinSecont.length > 0) {
      setNewPinSecont((prev) => prev.slice(0, prev.length - 1))
    }
  }

  const onDigitPress = (digit: number) => {
    if (!pinActive) {
      if (!firstPinDone && newPinFirst.length < 4) {
        setNewPinFirst((prev) => prev + digit)
      }
      if (firstPinDone && newPinSecont.length < 4) {
        setNewPinSecont((prev) => prev + digit)
      }
    } else {
      if (checkPin.length < 4) {
        setCheckPin((prev) => prev + digit)
      }
    }
  }

  const DigitItem = ({ digit }: { digit: number }) => {
    return (
      <TouchableOpacity
        key={digit}
        style={styles.digitItem}
        onPress={() => onDigitPress(digit)}
      >
        <Text style={[styles.digitNumber, { color: colors.primary }]}>{digit}</Text>
      </TouchableOpacity>
    )
  }

  const DigitsRow = ({ digits }: { digits: number[] }) => {
    return (
      <View style={styles.digitRow}>
        {digits.map((digit) => (<DigitItem key={digit} digit={digit} />))}
      </View>
    )
  }

  const PinDot = ({ filled, index }: { filled: boolean, index: number }) => {
    return (
      <View
        key={`${index}-dot`}
        style={[styles.pinDot, { backgroundColor: filled ? '0089CD' : colors.primary }]}
      ></View>
    )
  }

  const PinDots = () => {
    return (
      <View style={styles.pinDotsContainer}>
        {dotsArray.map((dot, index) => (
          <PinDot key={`${index}-D`} filled={dot} index={index} />
        ))}
      </View>
    )
  }

  useEffect(() => {
    let dotsRef = !pinActive
      ? !firstPinDone
        ? newPinFirst
        : newPinSecont
      : checkPin
    switch (dotsRef.length) {
      case 0:
        setDotsArray((_) => [false, false, false, false])
        break
      case 1:
        setDotsArray((_) => [true, false, false, false])
        break
      case 2:
        setDotsArray((_) => [true, true, false, false])
        break
      case 3:
        setDotsArray((_) => [true, true, true, false])
        break
      case 4:
        setDotsArray((_) => [true, true, true, true])
        setTimeout(() => {
          setDotsArray((_) => [false, false, false, false])
        }, 100);
        break
      default:
        break
    }
  }, [newPinFirst, newPinSecont, checkPin])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.setupContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.primary }]}>
          {!pinActive ? 'Set up a PIN code' : 'Remove PIN code'}
        </Text>
        <Text style={[styles.title, { color: colors.primary, fontSize: 18 }]}>
          {!pinActive
            ? !firstPinDone
              ? 'Enter new PIN'
              : 'Enter new PIN again'
            : 'Enter your PIN'
          }
        </Text>
        <View style={{ width: '100%', height: 50, marginTop: 20 }}>
          <PinDots />
        </View>
        <View style={styles.digitsContainer}>
          <DigitsRow digits={[1, 2, 3]} />
          <DigitsRow digits={[4, 5, 6]} />
          <DigitsRow digits={[7, 8, 9]} />
          <View style={styles.digitRow}>
            <View style={styles.digitItem}></View>
            <TouchableOpacity
              key={0}
              style={styles.digitItem}
              onPress={() => onDigitPress(0)}
            >
              <Text style={[styles.digitNumber, { color: colors.primary }]}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              key={'remove'}
              style={styles.digitItem}
              onPress={handleRemove}
            >
              <Text style={[styles.digitNumber, { color: colors.primary }]}>
                {'<'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SetPassCodeScreen