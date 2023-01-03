import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, Keyboard, BackHandler } from 'react-native'

import WebView from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import { useAppSelector } from '../hooks/reduxHooks'
import styles from './webStyles'


const Web: React.FC = () => {
  const { colors } = useAppSelector((state) => state.theme.theme)
  const [target, setTarget] = useState('https://google.com/')
  const [url, setUrl] = useState(target)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingBarVisible, setLoadingBarVisible] = useState(false)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const browserRef = useRef<WebView>();

  useEffect(() => {
    const backAction = () => {
      browserRef.current?.goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return backHandler.remove()
  }, [])

  const searchEngines = { google: (uri: string) => `https://www.google.com/search?q=${uri}` }

  function upgradeUrl(uri: string, searchEngine = 'google') {
    const isUrl = uri.split(' ').length === 1 && uri.includes('.')
    if (isUrl) {
      if (!uri.startsWith('http')) {
        return 'https://' + uri
      }
      return uri
    }
    const encodedURI = encodeURI(uri)
    return searchEngines[searchEngine](encodedURI)
  }

  const goForward = () => {
    if (browserRef && canGoForward) {
      browserRef.current?.goForward()
    }
  }

  const goBack = () => {
    if (browserRef && canGoBack) {
      browserRef.current?.goBack()
    }
  }

  const reloadPage = () => {
    if (browserRef) {
      browserRef.current?.reload()
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchBar}>
        <TextInput
          style={[styles.searchBarInput, { borderColor: colors.primary, color: colors.text }]}
          selection={!isFocused ? { start: 0, end: 0 } : null}
          blurOnSubmit
          keyboardType='url'
          onChangeText={(text) => setUrl(text)}
          onSubmitEditing={() => {
            Keyboard.dismiss
            setTarget(upgradeUrl(url))
          }}
          value={url}
          onFocus={() => setIsFocused(true)}
          onblur={() => setIsFocused(false)}
        />
        <View
          style={[styles.progressBar, {
            backgroundColor: colors.primary,
            width: `${loadingProgress * 100}%`,
            opacity: loadingBarVisible ? 1 : 0
          }]}
        ></View>
        <View style={[styles.setTarget, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={() => setTarget(url)}>
            <Ionicons name={'arrow-forward-circle-outline'} size={35} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <WebView
        allowsLinkPreview
        ref={browserRef}
        source={{ uri: target }}
        pullToRefreshEnabled
        pagingEnabled
        setSupportMultipleWindows={false}
        onLoadStart={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent
          setLoadingBarVisible(nativeEvent.loading)
          setUrl(nativeEvent.url)
          setCanGoBack(nativeEvent.canGoBack)
          setCanGoForward(nativeEvent.canGoForward)
        }}
        onLoadEnd={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent
          setLoadingBarVisible(nativeEvent.loading)
          setTarget(nativeEvent.url)
        }}
        onLoadProgress={({ nativeEvent }) => {
          setLoadingProgress(nativeEvent.progress)
        }}
      />
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons
            name="ios-arrow-back"
            size={32}
            color={canGoBack ? colors.primary : colors.background}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={reloadPage}>
          <Ionicons name="ios-refresh" size={32} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={goForward}>
          <Ionicons
            name='ios-arrow-forward'
            size={32}
            color={canGoForward ? colors.primary : colors.background}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Web